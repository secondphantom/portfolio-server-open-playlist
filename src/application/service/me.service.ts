import { EnrollDomain } from "../../domain/enroll.domain";
import { EnrollListQueryDto } from "../../dto/enroll.list.query.dto";
import { ServerError } from "../../dto/error";
import {
  EnrollChapterProgress,
  EnrollRecentProgress,
} from "../../schema/schema";
import { ICourseRepo } from "../interfaces/course.repo";
import { IEnrollRepo } from "../interfaces/enroll.repo";
import { IUserRepo } from "../interfaces/user.repo";

export type ServiceMeCreateEnrollDto = {
  userId: number;
  courseId: number;
};

export type ServiceMeUpdateProfileDto = {
  userId: number;
  profileName: string;
};

export type ServiceMeGetEnrollByCourseIdDto = {
  userId: number;
  courseId: number;
};

export type ServiceMeUpdateEnrollByCourseIdDto = {
  userId: number;
  courseId: number;
  chapterProgress: EnrollChapterProgress;
};

export type ServiceMeUpdateEnrollProgressByCourseIdDto = {
  userId: number;
  courseId: number;
  partialChapterProgress?: EnrollChapterProgress;
  recentProgress?: EnrollRecentProgress;
};

export type ServiceMeGetEnrollListByQueryDto = {
  userId: number;
  page?: number;
  order?: "update" | "create";
};

type ConstructorInputs = {
  userRepo: IUserRepo;
  enrollRepo: IEnrollRepo;
  courseRepo: ICourseRepo;
};

export class MeService {
  static instance: MeService | undefined;
  static getInstance = (inputs: ConstructorInputs) => {
    if (this.instance) return this.instance;
    this.instance = new MeService(inputs);
    return this.instance;
  };
  private enrollRepo: IEnrollRepo;
  private courseRepo: ICourseRepo;
  private userRepo: IUserRepo;

  constructor({ enrollRepo, courseRepo, userRepo }: ConstructorInputs) {
    this.userRepo = userRepo;
    this.enrollRepo = enrollRepo;
    this.courseRepo = courseRepo;
  }

  // [POST] /me/enroll
  createEnroll = async ({ userId, courseId }: ServiceMeCreateEnrollDto) => {
    const enroll = await this.enrollRepo.getEnrollByUserIdAndCourseId(
      {
        userId,
        courseId,
      },
      {
        userId: true,
        courseId: true,
      }
    );

    if (enroll) {
      throw new ServerError({
        code: 409,
        message: "Conflict",
      });
    }

    const course = await this.courseRepo.getCourseById(courseId, {
      chapters: true,
    });

    if (!course) {
      throw new ServerError({
        code: 404,
        message: "Course Not Found",
      });
    }

    const enrollDomain = new EnrollDomain({
      userId,
      courseId,
    });

    enrollDomain.createInitProgress(course.chapters);

    const createEnrollDto = enrollDomain.getCreateEnrollDto();

    await this.enrollRepo.createEnroll(createEnrollDto);
  };

  // [PATCH] /me/profile
  updateProfile = async (dto: ServiceMeUpdateProfileDto) => {
    await this.userRepo.updateUserById(dto.userId, {
      profileName: dto.profileName,
    });
  };

  // [GET] /me/enrolls/courses/:id
  getEnrollsByCourseId = async ({
    userId,
    courseId,
  }: ServiceMeGetEnrollByCourseIdDto) => {
    const enroll = await this.enrollRepo.getEnrollByUserIdAndCourseIdWith(
      {
        userId,
        courseId,
      },
      {
        enroll: {
          userId: true,
          courseId: true,
          chapterProgress: true,
          totalProgress: true,
          updatedAt: true,
        },
        course: {
          title: true,
          chapters: true,
          videoId: true,
        },
      }
    );

    if (!enroll) {
      throw new ServerError({
        code: 400,
        message: "Not Found",
      });
    }

    return enroll;
  };

  // [PATCH] /me/enrolls/courses
  updateEnrollByCourseId = async ({
    userId,
    courseId,
    chapterProgress,
  }: ServiceMeUpdateEnrollByCourseIdDto) => {
    const enrollDomain = new EnrollDomain({
      courseId,
      userId,
      chapterProgress,
    });

    const entity = enrollDomain.getEntity();

    await this.enrollRepo.updateEnrollByCourseId(
      {
        userId,
        courseId,
      },
      {
        chapterProgress: entity.chapterProgress,
        totalProgress: entity.totalProgress,
        recentProgress: entity.recentProgress,
      }
    );
  };

  // [PATCH] /me/enrolls/courses/progress
  updateEnrollProgressByCourseId = async ({
    userId,
    courseId,
    partialChapterProgress,
    recentProgress,
  }: ServiceMeUpdateEnrollProgressByCourseIdDto) => {
    await this.enrollRepo.updateEnrollProgressByCourseId(
      {
        userId,
        courseId,
      },
      {
        partialChapterProgress: partialChapterProgress,
        recentProgress: recentProgress,
      }
    );
  };

  // [GET] /me/enrolls?
  getEnrollListByQuery = async (dto: ServiceMeGetEnrollListByQueryDto) => {
    const enrollListQueryDto = new EnrollListQueryDto({ ...dto });
    const queryDto = enrollListQueryDto.getRepoQueryDto();
    const enrolls = await this.enrollRepo.getEnrollListByQuery(queryDto);

    const pagination = {
      currentPage: queryDto.page,
      pageSize: queryDto.pageSize,
    };

    if (enrolls.length === 0) {
      throw new ServerError({
        code: 200,
        message: "Empty",
        data: {
          enrolls: [],
          pagination,
        },
      });
    }

    return {
      enrolls,
      pagination,
    };
  };
}
