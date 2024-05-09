import {
  CourseChapter,
  EnrollChapterProgress,
  EnrollRecentProgress,
  enrolls,
} from "../schema/schema";

export type EnrollEntitySelect = typeof enrolls.$inferSelect;
export type EnrollEntityInsert = typeof enrolls.$inferInsert;

export type RepoCreateEnrollDto = Pick<
  Required<EnrollEntityInsert>,
  | "courseId"
  | "userId"
  | "version"
  | "chapterProgress"
  | "totalProgress"
  | "recentProgress"
  | "videoId"
>;

export class EnrollDomain {
  private courseId: number;
  private videoId: string;
  private userId: number;
  private version: number;
  private chapterProgress: EnrollChapterProgress;
  private totalProgress: number;
  private recentProgress: EnrollRecentProgress;
  private createdAt: Date | undefined;
  private updatedAt: Date | undefined;

  constructor({
    courseId,
    userId,
    version,
    chapterProgress,
    totalProgress,
    recentProgress,
    createdAt,
    updatedAt,
    videoId,
  }: Omit<
    EnrollEntityInsert,
    "chapterProgress" | "totalProgress" | "recentProgress"
  > &
    Partial<
      Pick<
        EnrollEntityInsert,
        "chapterProgress" | "totalProgress" | "recentProgress"
      >
    >) {
    this.courseId = courseId;
    this.videoId = videoId;
    this.userId = userId;
    this.version = version;
    this.chapterProgress = chapterProgress === undefined ? {} : chapterProgress;
    this.totalProgress = this.updateProgress(this.chapterProgress);
    this.recentProgress = recentProgress ? recentProgress : { chapterIndex: 0 };
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  private updateProgress = (chapterProgress: EnrollChapterProgress) => {
    const chapterProgressList = Object.values(chapterProgress);
    if (chapterProgressList.length === 0) return 0;

    const totalProgress =
      chapterProgressList.filter((v) => v === 1).length /
      chapterProgressList.length;
    return totalProgress;
  };

  createInitProgress = (chapters: CourseChapter[]) => {
    chapters.forEach(({ time }) => {
      this.chapterProgress[time] = 0;
    });
  };

  getCreateEnrollDto = (): RepoCreateEnrollDto => {
    return {
      courseId: this.courseId,
      userId: this.userId,
      version: this.version,
      chapterProgress: this.chapterProgress,
      totalProgress: this.totalProgress,
      recentProgress: this.recentProgress,
      videoId: this.videoId,
    };
  };

  getEntity = () => {
    return {
      courseId: this.courseId,
      userId: this.userId,
      chapterProgress: this.chapterProgress,
      totalProgress: this.totalProgress,
      recentProgress: this.recentProgress,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      version: this.version,
    };
  };
}
