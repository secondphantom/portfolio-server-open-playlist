import { EnrollDomain } from "../../domain/enroll.domain";
import { ServerError } from "../../dto/error";
import { ICourseRepo } from "../interfaces/course.repo";
import { IEnrollRepo } from "../interfaces/enroll.repo";

export type ServiceMeCreateEnrollDto = {
  courseId: number;
  userId: number;
};

type ConstructorInputs = {
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

  constructor({ enrollRepo, courseRepo }: ConstructorInputs) {
    this.enrollRepo = enrollRepo;
    this.courseRepo = courseRepo;
  }

  // [POST] /me/enroll
  createEnroll = async ({ userId, courseId }: ServiceMeCreateEnrollDto) => {
    const enroll = await this.enrollRepo.getByUserIdAndCourseId(
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

  // [GET] /me/enrolls?
  // [PATCH] /me/profile
}
