import * as schema from "../../schema/schema";
import { IEnrollRepo } from "../../application/interfaces/enroll.repo";
import {
  EnrollEntitySelect,
  RepoCreateEnrollDto,
} from "../../domain/enroll.domain";
import { DrizzleClient } from "../db/drizzle.client";

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

  getByUserIdAndCourseId = async <T extends keyof EnrollEntitySelect>(
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
}
