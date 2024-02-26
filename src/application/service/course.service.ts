import { ChannelDomain } from "../../domain/channel.domain";
import { CourseDomain } from "../../domain/course.domain";
import { CourseQueryDto } from "../../dto/course.query.dto";
import { ServerError } from "../../dto/error";
import { IChannelRepo } from "../interfaces/channel.repo";
import { ICourseRepo } from "../interfaces/course.repo";
import { IYoutubeApi } from "../interfaces/youtbue.api";

export type ServiceCourseCreateDto = {
  videoId: string;
};

export type ServiceCourseGetByIdDto = {
  userId?: number;
  courseId: number;
};

export type ServiceCourseGetByQueryDto = {
  userId?: number;
  page?: number;
  categoryId?: number;
  order?: "popular" | "recent";
  videoId?: string;
  search?: string;
  channelId?: string;
  language?: string;
};

export class CourseService {
  static instance: CourseService | undefined;
  static getInstance = (inputs: {
    courseRepo: ICourseRepo;
    channelRepo: IChannelRepo;
    youtubeApi: IYoutubeApi;
  }) => {
    if (this.instance) return this.instance;
    this.instance = new CourseService(inputs);
    return this.instance;
  };

  private courseRepo: ICourseRepo;
  private youtubeApi: IYoutubeApi;
  private channelRepo: IChannelRepo;

  constructor({
    courseRepo,
    channelRepo,
    youtubeApi,
  }: {
    courseRepo: ICourseRepo;
    channelRepo: IChannelRepo;
    youtubeApi: IYoutubeApi;
  }) {
    this.courseRepo = courseRepo;
    this.channelRepo = channelRepo;
    this.youtubeApi = youtubeApi;
  }

  // [POST] /courses
  createCourse = async ({ videoId }: ServiceCourseCreateDto) => {
    const course = await this.courseRepo.getCourseByVideoId(videoId);

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

    const channel = await this.channelRepo.getChannelByChannelId(
      videoInfo.channelId
    );

    if (!channel) {
      const channelDomain = new ChannelDomain({
        channelId: videoInfo.channelId,
        name: videoInfo.channelTitle,
      });
      await this.channelRepo.createChannel(channelDomain.getCreateChannelDto());
    }

    const createCourseDto = courseDomain.getCreateCourseDto();
    await this.courseRepo.createCourse(createCourseDto);
  };
  // [GET] /courses/:id
  getCourseById = async (dto: ServiceCourseGetByIdDto) => {
    const course = await this.courseRepo.getCourseByIdWith(
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
        },
        channel: {
          channelId: true,
          name: true,
        },
        enroll: {
          userId: true,
          totalProgress: true,
          updatedAt: true,
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
  getCourseByQuery = async (dto: ServiceCourseGetByQueryDto) => {
    const courseQueryDto = new CourseQueryDto({ ...dto });

    const courseRepoQueryDto = courseQueryDto.getRepoQueryDto();
    const courses = await this.courseRepo.getCourseListByQuery(
      courseRepoQueryDto
    );

    const pagination = {
      currentPage: courseRepoQueryDto.page,
      pageSize: courseRepoQueryDto.pageSize,
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
