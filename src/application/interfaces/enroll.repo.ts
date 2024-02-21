import { CourseEntitySelect } from "../../domain/course.domain";
import {
  EnrollEntitySelect,
  RepoCreateEnrollDto,
} from "../../domain/enroll.domain";
import { UserEntitySelect } from "../../domain/user.domain";

export interface IEnrollRepo {
  getEnrollByUserIdAndCourseId: <T extends keyof EnrollEntitySelect>(
    where: { userId: number; courseId: number },
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof EnrollEntitySelect]?: boolean }
  ) => Promise<Pick<EnrollEntitySelect, T> | undefined>;

  createEnroll: (enroll: RepoCreateEnrollDto) => Promise<void>;

  getEnrollByUserIdAndCourseIdWith: <
    T extends keyof EnrollEntitySelect,
    W1 extends keyof CourseEntitySelect,
    W2 extends keyof UserEntitySelect
  >(
    where: {
      userId: number;
      courseId: number;
    },
    columns?: {
      enroll?:
        | {
            [key in T]?: boolean;
          }
        | { [key in keyof EnrollEntitySelect]?: boolean };
      course?:
        | {
            [key in W1]?: boolean;
          }
        | { [key in keyof CourseEntitySelect]?: boolean };
      user?:
        | {
            [key in W2]?: boolean;
          }
        | { [key in keyof UserEntitySelect]?: boolean };
    }
  ) => Promise<
    | (Pick<EnrollEntitySelect, T> & {
        course: Pick<CourseEntitySelect, W1> | undefined;
        user: Pick<UserEntitySelect, W2> | undefined;
      })
    | undefined
  >;

  updateEnrollByCourseId: (
    where: {
      userId: number;
      courseId: number;
    },
    value: Partial<EnrollEntitySelect>
  ) => Promise<void>;
}
