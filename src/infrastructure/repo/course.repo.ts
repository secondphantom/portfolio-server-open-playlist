import * as schema from "../../schema/schema";

import {
  CourseEntitySelect,
  RepoCreateCourseDto,
} from "../../domain/course.domain";
import { DrizzleClient } from "../db/drizzle.client";
import { ICourseRepo } from "../../application/interfaces/course.repo";
import { UserEntitySelect } from "../../domain/user.domain";
import { ChannelEntitySelect } from "../../domain/channel.domain";
import { CategoryEntitySelect } from "../../domain/category.domain";
import { EnrollEntitySelect } from "../../domain/enroll.domain";

export default class CourseRepo implements ICourseRepo {
  static instance: CourseRepo | undefined;
  static getInstance = (drizzleClient: DrizzleClient) => {
    if (this.instance) return this.instance;
    this.instance = new CourseRepo(drizzleClient);
    return this.instance;
  };
  private db: ReturnType<typeof this.drizzleClient.getDb>;
  constructor(private drizzleClient: DrizzleClient) {
    this.db = drizzleClient.getDb();
  }

  getCourseByVideoId = async <T extends keyof CourseEntitySelect>(
    videoId: string,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof CourseEntitySelect]?: boolean }
  ) => {
    const course = await this.db.query.courses.findFirst({
      where: (course, { eq }) => {
        return eq(course.videoId, videoId);
      },
      columns: columns
        ? (columns as { [key in keyof CourseEntitySelect]: boolean })
        : undefined,
      with: {
        enrolls: {},
      },
    });

    return course;
  };

  getCourseByIdWith = async <
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
  ) => {
    const course = await this.db.query.courses.findFirst({
      where: (course, { eq }) => {
        return eq(course.id, where.courseId);
      },
      columns: columns?.course,
      with: {
        enrolls: where.userId
          ? {
              where: (enroll, { eq, and }) => {
                return and(
                  eq(enroll.courseId, where.courseId),
                  eq(enroll.userId, where.userId!)
                );
              },
              columns: columns?.enroll,
            }
          : undefined,
        channel: columns?.channel
          ? {
              columns: columns?.channel,
            }
          : undefined,
        category: columns?.category
          ? {
              columns: columns?.category,
            }
          : undefined,
      },
    });

    return course as any;
  };

  getCourseById = async <T extends keyof CourseEntitySelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof CourseEntitySelect]?: boolean }
  ) => {
    const course = await this.db.query.courses.findFirst({
      where: (course, { eq }) => {
        return eq(course.id, id);
      },
      columns: columns
        ? (columns as { [key in keyof CourseEntitySelect]: boolean })
        : undefined,
    });

    return course;
  };

  createCourse = async (course: RepoCreateCourseDto) => {
    await this.db.insert(schema.courses).values(course);
  };
}
