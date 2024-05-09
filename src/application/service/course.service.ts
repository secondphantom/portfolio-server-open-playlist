import { ChannelDomain } from "../../domain/channel.domain";
import { CourseDomain } from "../../domain/course.domain";
import { UserCreditDomain } from "../../domain/user.credit.domain";
import { CourseListQueryDto } from "../../dto/course.list.query.dto";
import { ServerError } from "../../dto/error";
import { IChannelRepo } from "../interfaces/channel.repo";
import { ICourseRepo } from "../interfaces/course.repo";
import { IUserCreditRepo } from "../interfaces/user.credit.repo";
import { IYoutubeApi } from "../interfaces/youtbue.api";

export type ServiceCourseCreateDto = {
  userId: number;
  videoId: string;
};

export type ServiceCourseGetByIdDto = {
  userId?: number;
  courseId: number;
};

export type ServiceCourseGetByVideoIdDto = {
  userId?: number;
  videoId: string;
};

export type ServiceCourseGetListByQueryDto = {
  userId?: number;
  page?: number;
  categoryId?: number;
  order?: "popular" | "recent" | "create";
  videoId?: string;
  search?: string;
  channelId?: string;
  language?: string;
};

type ConstructorInputs = {
  courseRepo: ICourseRepo;
  channelRepo: IChannelRepo;
  youtubeApi: IYoutubeApi;
  userCreditRepo: IUserCreditRepo;
};

export class CourseService {
  static instance: CourseService | undefined;
  static getInstance = (inputs: ConstructorInputs) => {
    if (this.instance) return this.instance;
    this.instance = new CourseService(inputs);
    return this.instance;
  };

  private courseRepo: ICourseRepo;
  private youtubeApi: IYoutubeApi;
  private channelRepo: IChannelRepo;
  private userCreditRepo: IUserCreditRepo;

  constructor({
    courseRepo,
    channelRepo,
    youtubeApi,
    userCreditRepo,
  }: ConstructorInputs) {
    this.courseRepo = courseRepo;
    this.channelRepo = channelRepo;
    this.youtubeApi = youtubeApi;
    this.userCreditRepo = userCreditRepo;
  }

  // [POST] /courses
  createCourse = async ({ videoId, userId }: ServiceCourseCreateDto) => {
    const userCredit = await this.userCreditRepo.getByUserId(userId);

    if (!userCredit) {
      throw new ServerError({
        code: 401,
        message: "Unauthorized",
      });
    }

    const userCreditDomain = new UserCreditDomain({ ...userCredit });

    const { success } = userCreditDomain.consumeCreditForCreateCourse();

    if (!success) {
      throw new ServerError({
        code: 403,
        message: "Insufficient credit",
      });
    }

    const course = await this.courseRepo.getByVideoId(videoId, {
      id: true,
    });

    if (course) {
      throw new ServerError({
        code: 409,
        message: "Conflict",
      });
    }

    const videoInfo = await this.youtubeApi.getVideoInfo(videoId);

    const courseDomain = new CourseDomain({
      videoId: videoInfo.videoId,
      channelId: videoInfo.channelId,
      language: videoInfo.defaultLanguage,
      title: videoInfo.title,
      description: videoInfo.description,
      duration: videoInfo.duration,
      publishedAt: videoInfo.publishedAt,
    });
    courseDomain.updateChaptersByDescription();

    const isValidCourse = courseDomain.getIsValid();

    if (!isValidCourse) {
      throw new ServerError({
        code: 400,
        message: "Not Valid Youtube Video",
      });
    }

    const channel = await this.channelRepo.getByChannelId(videoInfo.channelId);

    if (!channel) {
      const channelDomain = new ChannelDomain({
        channelId: videoInfo.channelId,
        name: videoInfo.channelTitle,
      });
      await this.channelRepo.create(channelDomain.getCreateChannelDto());
    }

    const createCourseDto = courseDomain.getCreateCourseDto();
    await this.courseRepo.create(createCourseDto);

    await this.userCreditRepo.updateByUserId(userId, {
      ...userCreditDomain.getEntity(),
      userId: undefined,
    });
  };
  // [GET] /courses/:id
  getCourseById = async (dto: ServiceCourseGetByIdDto) => {
    const course = await this.courseRepo.getByIdWith(
      {
        courseId: dto.courseId,
        userId: dto.userId,
      },
      {
        course: {
          id: true,
          videoId: true,
          language: true,
          title: true,
          description: true,
          summary: true,
          chapters: true,
          enrollCount: true,
          duration: true,
          createdAt: true,
          publishedAt: true,
          version: true,
        },
        channel: {
          channelId: true,
          name: true,
        },
        enroll: {
          userId: true,
          totalProgress: true,
          updatedAt: true,
          chapterProgress: true,
          recentProgress: true,
          version: true,
        },
        category: {
          id: true,
          name: true,
        },
      }
    );

    if (!course) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    return course;
  };

  // [GET] /courses/:videoId
  getCourseByVideoId = async (dto: ServiceCourseGetByVideoIdDto) => {
    const course = await this.courseRepo.getByVideoIdWith(
      {
        videoId: dto.videoId,
        userId: dto.userId,
      },
      {
        course: {
          id: true,
          videoId: true,
          language: true,
          title: true,
          description: true,
          summary: true,
          chapters: true,
          enrollCount: true,
          duration: true,
          createdAt: true,
          publishedAt: true,
          version: true,
        },
        channel: {
          channelId: true,
          name: true,
        },
        enroll: {
          userId: true,
          totalProgress: true,
          updatedAt: true,
          chapterProgress: true,
          recentProgress: true,
          version: true,
        },
        category: {
          id: true,
          name: true,
        },
      }
    );

    if (!course) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    return course;
  };

  // [GET] /courses?
  getCourseListByQuery = async (dto: ServiceCourseGetListByQueryDto) => {
    const courseListQueryDto = new CourseListQueryDto({ ...dto });

    const queryDto = courseListQueryDto.getRepoQueryDto();
    const courses = await this.courseRepo.getListByQuery(queryDto);

    const pagination = {
      currentPage: queryDto.page,
      pageSize: queryDto.pageSize,
    };

    if (courses.length === 0) {
      throw new ServerError({
        code: 200,
        message: "Empty",
        data: {
          courses: [],
          pagination,
        },
      });
    }

    return {
      courses,
      pagination,
    };
  };
}
