import * as schema from "../../schema/schema";
import {
  IEnrollRepo,
  QueryEnrollListDto,
} from "../../application/interfaces/enroll.repo";
import {
  EnrollEntitySelect,
  RepoCreateEnrollDto,
} from "../../domain/enroll.domain";
import { Db, DrizzleClient } from "../db/drizzle.client";
import { CourseEntitySelect } from "../../domain/course.domain";
import { UserEntitySelect } from "../../domain/user.domain";
import { SQL, and, eq, sql } from "drizzle-orm";

export class EnrollRepo implements IEnrollRepo {
  static instance: EnrollRepo | undefined;
  static getInstance = (drizzleClient: DrizzleClient) => {
    if (this.instance) return this.instance;
    this.instance = new EnrollRepo(drizzleClient);
    return this.instance;
  };

  constructor(private drizzleClient: DrizzleClient) {}

  getEnrollByUserIdAndCourseId = async <T extends keyof EnrollEntitySelect>(
    { courseId, userId }: { userId: number; courseId: number },
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof EnrollEntitySelect]?: boolean }
  ) => {
    const { db, client } = await this.drizzleClient.getDb();
    const enroll = await db.query.enrolls.findFirst({
      where: (enroll, { eq, and }) => {
        return and(eq(enroll.userId, userId), eq(enroll.courseId, courseId));
      },
      columns: columns
        ? (columns as { [key in keyof EnrollEntitySelect]: boolean })
        : undefined,
    });
    await this.drizzleClient.endDb(client);

    return enroll;
  };

  createEnroll = async (enroll: RepoCreateEnrollDto) => {
    const { db, client } = await this.drizzleClient.getDb();
    await Promise.all([
      db.execute(
        sql`UPDATE "Courses" SET enroll_count = enroll_count + 1 WHERE id = ${enroll.courseId}`
      ),
      db.insert(schema.enrolls).values(enroll),
    ]);
    await this.drizzleClient.endDb(client);
  };

  getEnrollByUserIdAndCourseIdWith = async <
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
  ) => {
    const { db, client } = await this.drizzleClient.getDb();
    const enroll = await db.query.enrolls.findFirst({
      where: (enrolls, { eq, and }) => {
        return and(
          eq(enrolls.courseId, where.courseId),
          eq(enrolls.userId, where.userId)
        );
      },
      columns: columns?.enroll,
      with: {
        course: columns?.course
          ? {
              columns: columns?.course,
            }
          : undefined,
        user: columns?.user
          ? {
              columns: columns?.user,
            }
          : undefined,
      },
    });
    await this.drizzleClient.endDb(client);

    return enroll as any;
  };

  updateEnrollByCourseId = async (
    where: { userId: number; courseId: number },
    value: Partial<EnrollEntitySelect>
  ) => {
    const { db, client } = await this.drizzleClient.getDb();
    await db
      .update(schema.enrolls)
      .set(value)
      .where(
        and(
          eq(schema.enrolls.userId, where.userId),
          eq(schema.enrolls.courseId, where.courseId)
        )
      );
    await this.drizzleClient.endDb(client);
  };

  getEnrollListByQuery = async (query: QueryEnrollListDto) => {
    const { userId, pageSize, order, page } = query;
    const { db, client } = await this.drizzleClient.getDb();
    const enrolls = await db.query.enrolls.findMany({
      where: (enroll, { eq }) => {
        return eq(enroll.userId, userId);
      },
      orderBy: (course, { asc, desc }) => {
        switch (order) {
          case "update":
            return [desc(course.updatedAt)];
          case "create":
            return [desc(course.createdAt)];
          default:
            return [];
        }
      },
      offset: (page - 1) * pageSize,
      limit: pageSize,
      columns: {
        courseId: true,
        totalProgress: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        course: {
          columns: {
            id: true,
            videoId: true,
            title: true,
          },
        },
      },
    });
    await this.drizzleClient.endDb(client);
    return enrolls;
  };

  updateEnrollProgressByCourseId = async (
    { userId, courseId }: { userId: number; courseId: number },
    {
      partialChapterProgress,
      recentProgress,
      totalProgress,
    }: {
      partialChapterProgress?: schema.EnrollChapterProgress;
      recentProgress?: schema.EnrollRecentProgress;
      totalProgress?: number;
    }
  ) => {
    const sqlChunks: SQL[] = [];
    sqlChunks.push(sql`UPDATE "Enrolls" SET`);

    if (partialChapterProgress) {
      const [key, value] = Object.entries(partialChapterProgress)[0];
      sqlChunks.push(
        sql.raw(
          `chapter_progress = jsonb_set(chapter_progress, '{${key}}', '${value}')`
        )
      );
      sqlChunks.push(sql`, `);
      sqlChunks.push(sql`total_progress = ${totalProgress}`);
    }

    if (partialChapterProgress && recentProgress) {
      sqlChunks.push(sql`, `);
    }

    if (recentProgress) {
      sqlChunks.push(sql`recent_progress = ${JSON.stringify(recentProgress)}`);
    }

    sqlChunks.push(sql`WHERE user_id = ${userId} AND course_id = ${courseId}`);
    const { db, client } = await this.drizzleClient.getDb();
    await db.execute(sql.join(sqlChunks, sql.raw(" ")));
    await this.drizzleClient.endDb(client);
  };
}
