import * as schema from "../../schema/schema";

import {
  CourseEntitySelect,
  RepoCreateCourseDto,
} from "../../domain/course.domain";
import { DrizzleClient } from "../db/drizzle.client";
import { ICourseRepo } from "../../application/interfaces/course.repo";

export class CourseRepo implements ICourseRepo {
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
    });

    return course;
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
