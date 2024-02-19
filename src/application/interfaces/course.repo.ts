import {
  CourseEntitySelect,
  RepoCreateCourseDto,
} from "../../domain/course.domain";

export interface ICourseRepo {
  getCourseByVideoId: <T extends keyof CourseEntitySelect>(
    videoId: string,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof CourseEntitySelect]?: boolean }
  ) => Promise<Pick<CourseEntitySelect, T> | undefined>;
  getCourseById: <T extends keyof CourseEntitySelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof CourseEntitySelect]?: boolean }
  ) => Promise<Pick<CourseEntitySelect, T> | undefined>;
  createCourse: (channel: RepoCreateCourseDto) => Promise<void>;
}
