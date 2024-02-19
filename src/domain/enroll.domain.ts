import {
  CourseChapter,
  EnrollChapterProgress,
  enrolls,
} from "../schema/schema";

export type EnrollEntitySelect = typeof enrolls.$inferSelect;
export type EnrollEntityInsert = typeof enrolls.$inferInsert;

export type RepoCreateEnrollDto = Pick<
  Required<EnrollEntityInsert>,
  "courseId" | "userId" | "chapterProgress" | "totalProgress"
>;

export class EnrollDomain {
  private courseId: number;
  private userId: number;
  private chapterProgress: EnrollChapterProgress[];
  private totalProgress: number;
  private createdAt: Date | undefined;
  private updatedAt: Date | undefined;
  constructor({
    courseId,
    userId,
    chapterProgress,
    totalProgress,
    createdAt,
    updatedAt,
  }: Omit<EnrollEntityInsert, "chapterProgress" | "totalProgress"> &
    Partial<Pick<EnrollEntityInsert, "chapterProgress" | "totalProgress">>) {
    this.courseId = courseId;
    this.userId = userId;
    this.chapterProgress = chapterProgress === undefined ? [] : chapterProgress;
    this.totalProgress = this.updateProgress(this.chapterProgress);
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  private updateProgress = (chapterProgress: EnrollChapterProgress[]) => {
    if (chapterProgress.length === 0) return 0;

    const totalProgress =
      chapterProgress.filter((v) => v.progress === 1).length /
      chapterProgress.length;
    return totalProgress;
  };

  createInitProgress = (chapters: CourseChapter[]) => {
    this.chapterProgress = chapters.map(({ time }) => {
      return {
        time,
        progress: 0,
      };
    }) satisfies EnrollChapterProgress[];
  };

  getCreateEnrollDto = (): RepoCreateEnrollDto => {
    return {
      courseId: this.courseId,
      userId: this.userId,
      chapterProgress: this.chapterProgress,
      totalProgress: this.totalProgress,
    };
  };
}
