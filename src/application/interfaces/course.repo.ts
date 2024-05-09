import { CategoryEntitySelect } from "../../domain/category.domain";
import { ChannelEntitySelect } from "../../domain/channel.domain";
import {
  CourseEntitySelect,
  RepoCreateCourseDto,
} from "../../domain/course.domain";
import { EnrollEntitySelect } from "../../domain/enroll.domain";

export type QueryCourseListDto = {
  userId?: number;
  page: number;
  categoryId?: number;
  order: "popular" | "recent" | "create";
  videoId: string | undefined;
  search: string | undefined;
  channelId: string | undefined;
  language: string | undefined;
  pageSize: number;
};

export type QueryCourse = Pick<
  CourseEntitySelect,
  | "id"
  | "videoId"
  | "title"
  | "categoryId"
  | "enrollCount"
  | "createdAt"
  | "publishedAt"
> & {
  enrolls: Pick<EnrollEntitySelect, "userId">[] | undefined;
  channel: Pick<ChannelEntitySelect, "name" | "channelId">;
};

export interface ICourseRepo {
  getByVideoId: <T extends keyof CourseEntitySelect>(
    videoId: string,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof CourseEntitySelect]?: boolean }
  ) => Promise<Pick<CourseEntitySelect, T> | undefined>;
  getByIdWith: <
    T extends keyof CourseEntitySelect,
    W1 extends keyof EnrollEntitySelect,
    W2 extends keyof ChannelEntitySelect,
    W3 extends keyof CategoryEntitySelect
  >(
    where: {
      courseId: number;
      userId?: number;
    },
    columns?: {
      course?:
        | {
            [key in T]?: boolean;
          }
        | { [key in keyof CourseEntitySelect]?: boolean };
      enroll?:
        | {
            [key in W1]?: boolean;
          }
        | { [key in keyof EnrollEntitySelect]?: boolean };
      channel?:
        | {
            [key in W2]?: boolean;
          }
        | { [key in keyof ChannelEntitySelect]?: boolean };
      category?:
        | {
            [key in W3]?: boolean;
          }
        | {
            [key in keyof CategoryEntitySelect]?: boolean;
          };
    }
  ) => Promise<
    | (Pick<CourseEntitySelect, T> & {
        enrolls: Pick<EnrollEntitySelect, W1> | undefined;
        channel: Pick<ChannelEntitySelect, W2> | undefined;
        category: Pick<CategoryEntitySelect, W3> | undefined | null;
      })
    | undefined
  >;
  getByVideoIdWith: <
    T extends keyof CourseEntitySelect,
    W1 extends keyof EnrollEntitySelect,
    W2 extends keyof ChannelEntitySelect,
    W3 extends keyof CategoryEntitySelect
  >(
    where: {
      videoId: string;
      userId?: number;
    },
    columns?: {
      course?:
        | {
            [key in T]?: boolean;
          }
        | { [key in keyof CourseEntitySelect]?: boolean };
      enroll?:
        | {
            [key in W1]?: boolean;
          }
        | { [key in keyof EnrollEntitySelect]?: boolean };
      channel?:
        | {
            [key in W2]?: boolean;
          }
        | { [key in keyof ChannelEntitySelect]?: boolean };
      category?:
        | {
            [key in W3]?: boolean;
          }
        | {
            [key in keyof CategoryEntitySelect]?: boolean;
          };
    }
  ) => Promise<
    | (Pick<CourseEntitySelect, T> & {
        enrolls: Pick<EnrollEntitySelect, W1> | undefined;
        channel: Pick<ChannelEntitySelect, W2> | undefined;
        category: Pick<CategoryEntitySelect, W3> | undefined | null;
      })
    | undefined
  >;
  getById: <T extends keyof CourseEntitySelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof CourseEntitySelect]?: boolean }
  ) => Promise<Pick<CourseEntitySelect, T> | undefined>;
  create: (channel: RepoCreateCourseDto) => Promise<void>;
  getListByQuery: (query: QueryCourseListDto) => Promise<QueryCourse[]>;
}
