import * as schema from "../../schema/schema";
import { IEnrollRepo } from "../../application/interfaces/enroll.repo";
import {
  EnrollEntitySelect,
  RepoCreateEnrollDto,
} from "../../domain/enroll.domain";
import { DrizzleClient } from "../db/drizzle.client";
import { CourseEntitySelect } from "../../domain/course.domain";
import { UserEntitySelect } from "../../domain/user.domain";

export class EnrollRepo implements IEnrollRepo {
  static instance: EnrollRepo | undefined;
  static getInstance = (drizzleClient: DrizzleClient) => {
    if (this.instance) return this.instance;
    this.instance = new EnrollRepo(drizzleClient);
    return this.instance;
  };
  private db: ReturnType<typeof this.drizzleClient.getDb>;
  constructor(private drizzleClient: DrizzleClient) {
    this.db = drizzleClient.getDb();
  }

  getEnrollByUserIdAndCourseId = async <T extends keyof EnrollEntitySelect>(
    { courseId, userId }: { userId: number; courseId: number },
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof EnrollEntitySelect]?: boolean }
  ) => {
    const enroll = await this.db.query.enrolls.findFirst({
      where: (enroll, { eq, and }) => {
        return and(eq(enroll.userId, userId), eq(enroll.courseId, courseId));
      },
      columns: columns
        ? (columns as { [key in keyof EnrollEntitySelect]: boolean })
        : undefined,
    });

    return enroll;
  };

  createEnroll = async (enroll: RepoCreateEnrollDto) => {
    await this.db.insert(schema.enrolls).values(enroll);
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
    const enroll = await this.db.query.enrolls.findFirst({
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

    return enroll as any;
  };
}
