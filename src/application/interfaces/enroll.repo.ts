import {
  EnrollEntitySelect,
  RepoCreateEnrollDto,
} from "../../domain/enroll.domain";

export interface IEnrollRepo {
  getByUserIdAndCourseId: <T extends keyof EnrollEntitySelect>(
    where: { userId: number; courseId: number },
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof EnrollEntitySelect]?: boolean }
  ) => Promise<Pick<EnrollEntitySelect, T> | undefined>;

  createEnroll: (enroll: RepoCreateEnrollDto) => Promise<void>;
}
