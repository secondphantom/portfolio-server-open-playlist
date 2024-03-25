import * as schema from "../../schema/schema";

import {
  CourseEntitySelect,
  RepoCreateCourseDto,
} from "../../domain/course.domain";
import { Db, DrizzleClient } from "../db/drizzle.client";
import {
  ICourseRepo,
  QueryCourse,
  QueryCourseListDto,
} from "../../application/interfaces/course.repo";
import { UserEntitySelect } from "../../domain/user.domain";
import { ChannelEntitySelect } from "../../domain/channel.domain";
import { CategoryEntitySelect } from "../../domain/category.domain";
import { EnrollEntitySelect } from "../../domain/enroll.domain";
import { SQL, and, desc, eq, sql } from "drizzle-orm";

export default class CourseRepo implements ICourseRepo {
  static instance: CourseRepo | undefined;
  static getInstance = (drizzleClient: DrizzleClient) => {
    if (this.instance) return this.instance;
    this.instance = new CourseRepo(drizzleClient);
    return this.instance;
  };

  constructor(private drizzleClient: DrizzleClient) {}

  getCourseByVideoId = async <T extends keyof CourseEntitySelect>(
    videoId: string,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof CourseEntitySelect]?: boolean }
  ) => {
    const { db, client } = await this.drizzleClient.getDb();
    const course = await db.query.courses.findFirst({
      where: (course, { eq }) => {
        return eq(course.videoId, videoId);
      },
      columns: columns
        ? (columns as { [key in keyof CourseEntitySelect]: boolean })
        : undefined,
    });
    await this.drizzleClient.endDb(client);

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
    const { db, client } = await this.drizzleClient.getDb();
    const course = await db.query.courses.findFirst({
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
    await this.drizzleClient.endDb(client);

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
    const { db, client } = await this.drizzleClient.getDb();
    const course = await db.query.courses.findFirst({
      where: (course, { eq }) => {
        return eq(course.id, id);
      },
      columns: columns
        ? (columns as { [key in keyof CourseEntitySelect]: boolean })
        : undefined,
    });
    await this.drizzleClient.endDb(client);

    return course;
  };

  createCourse = async (course: RepoCreateCourseDto) => {
    const { db, client } = await this.drizzleClient.getDb();
    await db.insert(schema.courses).values(course as any);
    await this.drizzleClient.endDb(client);
  };

  getCourseListByQuery = async (query: QueryCourseListDto) => {
    const { db, client } = await this.drizzleClient.getDb();

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

    const orderBy = ((order: string) => {
      switch (order) {
        case "popular":
          return [desc(schema.courses.enrollCount)];
        case "recent":
          return [desc(schema.courses.publishedAt)];
        case "create":
          return [desc(schema.courses.createdAt)];
        default:
          return [];
      }
    })(order);
    if (search) {
      const sqlChunks: SQL[] = [];
      sqlChunks.push(sql`select "courses"."id", "courses"."title", "courses"."video_id", "courses"."category_id", "courses"."created_at", "courses"."published_at", "courses"."enroll_count", "courses_enrolls"."data" as "enrolls", "courses_channel"."data" as "channel" from "Courses" 
			"courses" left join lateral (select coalesce(json_agg(json_build_array("courses_enrolls"."user_id")), '[]'::json) as "data" from "Enrolls" "courses_enrolls" where ("courses_enrolls"."course_id" = "courses"."id" and "courses_enrolls"."user_id" = ${userId})) "courses_enrolls" on true left join lateral (select json_build_array("courses_channel"."name", "courses_channel"."channel_id") as "data" from (select * from "Channels" "courses_channel" where "courses_channel"."channel_id" = "courses"."channel_id" limit 1) "courses_channel") "courses_channel" on true order`);
      const courses = await db
        .select({
          id: sql`"Courses"."id"`,
          title: sql`"Courses"."title"`,
          videoId: sql`"Courses"."video_id"`,
          categoryId: sql`"Courses"."category_id"`,
          createdAt: sql`"Courses"."created_at"`,
          publishedAt: sql`"Courses"."published_at"`,
          enrollCount: sql`"Courses"."enroll_count"`,
          enrolls: sql`"courses_enrolls"."data" as "enrolls"`,
          channel: sql`"courses_channel"."data" as "channel"`,
        })
        .from(
          sql`"Courses" left join lateral (select coalesce(json_agg(json_build_object('userId',"courses_enrolls"."user_id")), '[]'::json) as "data" from "Enrolls" "courses_enrolls" where ("courses_enrolls"."course_id" = "Courses"."id" and "courses_enrolls"."user_id" = ${userId})) "courses_enrolls" on true left join lateral (select json_build_object('name',"courses_channel"."name",'channelId', "courses_channel"."channel_id") as "data" from (select * from "Channels" "courses_channel" where "courses_channel"."channel_id" = "Courses"."channel_id" limit 1) "courses_channel") "courses_channel" on true` as any
        )
        .where(
          and(
            ...[
              categoryId
                ? eq(schema.courses.categoryId, categoryId)
                : undefined,
              videoId ? eq(schema.courses.videoId, videoId) : undefined,
              channelId ? eq(schema.courses.channelId, channelId) : undefined,
              language ? eq(schema.courses.language, language) : undefined,
              search
                ? sql`title_tsvector @@ plainto_tsquery('simple',lower(${search}))`
                : undefined,
            ].filter((v) => !!v)
          )
        )
        .limit(pageSize)
        .offset((page - 1) * pageSize)
        .orderBy(...orderBy)
        .then((v) =>
          v.map((v) => ({
            ...v,
            id: parseInt(v.id as any),
            createdAt: new Date(v.createdAt as any),
            publishedAt: new Date(v.publishedAt as any),
          }))
        );
      return courses as QueryCourse[];
    }

    const courses = await db.query.courses.findMany({
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
      orderBy: orderBy,
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
    await this.drizzleClient.endDb(client);

    return courses as QueryCourse[];
  };
}
