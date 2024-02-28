import * as schema from "../../schema/schema";

import {
  CourseEntitySelect,
  RepoCreateCourseDto,
} from "../../domain/course.domain";
import { DrizzleClient } from "../db/drizzle.client";
import {
  ICourseRepo,
  QueryCourse,
  QueryCourseListDto,
} from "../../application/interfaces/course.repo";
import { UserEntitySelect } from "../../domain/user.domain";
import { ChannelEntitySelect } from "../../domain/channel.domain";
import { CategoryEntitySelect } from "../../domain/category.domain";
import { EnrollEntitySelect } from "../../domain/enroll.domain";
import { and, desc, eq, sql } from "drizzle-orm";

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

  getCourseListByQuery = async (query: QueryCourseListDto) => {
    const {
      userId,
      page,
      categoryId,
      order,
      videoId,
      search,
      channelId,
      language,
      pageSize,
    } = query;

    if (search) {
      const orderBy = ((order: string) => {
        switch (order) {
          case "popular":
            return [desc(schema.courses.enrollCount)];
          case "recent":
            return [desc(schema.courses.publishedAt)];
          default:
            return [];
        }
      })(order);

      const courses = await this.db
        .select({
          id: schema.courses.id,
          title: schema.courses.title,
          videoId: schema.courses.videoId,
          categoryId: schema.courses.categoryId,
          createdAt: schema.courses.createdAt,
          publishedAt: schema.courses.publishedAt,
          enrollCount: schema.courses.enrollCount,
          ...(userId
            ? {
                enrolls: sql`coalesce((select json_arrayagg(json_object("userId",\`user_id\`)) from \`Enrolls\` \`courses_enrolls\` where (\`courses_enrolls\`.\`course_id\` = \`Courses\`.\`id\` and \`courses_enrolls\`.\`user_id\` = ${userId})), json_array()) as \`enrolls\``,
              }
            : {}),
          channel: sql`(select json_object("name",\`name\`,"channelId", \`channel_id\`) from (select * from \`Channels\` \`courses_channel\` where \`courses_channel\`.\`channel_id\` = \`Courses\`.\`channel_id\` limit ${1}) \`courses_channel\`) as \`channel\``,
        })
        .from(schema.courses)
        .where(
          and(
            ...[
              search ? sql`MATCH(\`title\`) AGAINST(${search})` : undefined,
              categoryId
                ? eq(schema.courses.categoryId, categoryId)
                : undefined,
              videoId ? eq(schema.courses.videoId, videoId) : undefined,
              channelId ? eq(schema.courses.channelId, channelId) : undefined,
              language ? eq(schema.courses.language, language) : undefined,
            ].filter((v) => !!v)
          )
        )
        .limit(pageSize)
        .offset((page - 1) * pageSize)
        .orderBy(...orderBy);
      console.log(JSON.stringify(courses[0]));
      return courses as QueryCourse[];
    }

    const courses = await this.db.query.courses.findMany({
      where: (course, { eq, and }) => {
        return and(
          ...[
            categoryId ? eq(course.categoryId, categoryId) : undefined,
            videoId ? eq(course.videoId, videoId) : undefined,
            channelId ? eq(course.channelId, channelId) : undefined,
            language ? eq(course.language, language) : undefined,
          ].filter((v) => !!v)
        );
      },
      orderBy: (course, { asc, desc }) => {
        switch (order) {
          case "popular":
            return [desc(course.enrollCount)];
          case "recent":
            return [desc(course.publishedAt)];
          default:
            return [];
        }
      },
      offset: (page - 1) * pageSize,
      limit: pageSize,
      columns: {
        id: true,
        title: true,
        videoId: true,
        categoryId: true,
        createdAt: true,
        publishedAt: true,
        enrollCount: true,
      },
      with: {
        enrolls:
          userId !== undefined
            ? {
                where: (enroll, { eq, and }) => {
                  return eq(enroll.userId, userId!);
                },
                columns: {
                  userId: true,
                },
              }
            : undefined,
        channel: {
          columns: {
            name: true,
            channelId: true,
          },
        },
      },
    });

    return courses as QueryCourse[];
  };
}
