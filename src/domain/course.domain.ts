import { CourseChapter, CourseExtra, courses } from "../schema/schema";

export type CourseEntitySelect = typeof courses.$inferSelect;
export type CourseEntityInsert = typeof courses.$inferInsert;

export type RepoCreateCourseDto = Pick<
  Required<CourseEntityInsert>,
  | "videoId"
  | "channelId"
  | "categoryId"
  | "language"
  | "title"
  | "description"
  | "summary"
  | "chapters"
  | "enrollCount"
  | "generatedAi"
  | "duration"
  | "extra"
  | "publishedAt"
>;

export class CourseDomain {
  private id: number | undefined;
  private videoId: string;
  private channelId: string;
  private categoryId: number;
  private language: string;
  private title: string;
  private description: string;
  private summary: string | null;
  private chapters: CourseChapter[];
  private enrollCount: number;
  private generatedAi: boolean;
  private duration: number;
  private extra: CourseExtra;
  private createdAt: Date | undefined;
  private updatedAt: Date | undefined;
  private publishedAt: Date;

  private MIN_VALID_DURATION_MIN = 30;
  private MIN_VALID_CHAPTER_COUNT = 2;

  constructor({
    id,
    videoId,
    channelId,
    categoryId,
    language,
    title,
    description,
    summary,
    chapters,
    enrollCount,
    generatedAi,
    duration,
    extra,
    createdAt,
    updatedAt,
    publishedAt,
  }: Omit<CourseEntityInsert, "chapters" | "extra"> &
    Partial<Pick<CourseEntityInsert, "chapters" | "extra">>) {
    this.id = id;
    this.videoId = videoId;
    this.channelId = channelId;
    this.categoryId = categoryId ? categoryId : 0;
    this.language = language;
    this.title = title;
    this.description = description;
    this.summary = summary ? summary : null;
    this.chapters = chapters ? chapters : [];
    this.enrollCount = enrollCount === undefined ? 0 : enrollCount;
    this.generatedAi = generatedAi ? generatedAi : false;
    this.duration = duration;
    this.extra = extra ? extra : {};
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.publishedAt = publishedAt;
    this.updateChaptersByDescription();
  }

  updateChaptersByDescription = () => {
    if (this.description) return;

    const matches = this.description.match(
      /.*?((?:([0-5]?[0-9]):)?([0-5]?[0-9]):([0-5][0-9])).*/g
    );

    if (!matches) return;

    const chapters = matches
      ?.map((match) => {
        const groups =
          /(?<timeStr>.*?((?:([0-5]?[0-9]):)?([0-5]?[0-9]):([0-5][0-9])))(?<titleStr>.*)/.exec(
            match
          )?.groups;
        if (!groups) return null as any as CourseChapter;

        const { timeStr, titleStr } = groups;
        const INDEX_TIME_SEC: { [key in string]: number } = {
          "0": 1,
          "1": 60,
          "2": 60 * 60,
        };

        const time = timeStr
          .split(":")
          .reverse()
          .reduce((prev, cur, index) => {
            return prev + parseInt(cur) * INDEX_TIME_SEC[index];
          }, 0);
        const title = titleStr.trim();

        return { time, title };
      })
      .filter((v) => !!v);

    if (!chapters) return;

    const orderedChapter = structuredClone(chapters).sort((a, b) => {
      return a.time - b.time;
    });

    const isSameOrder =
      orderedChapter
        .map((v, index) => v!.time === chapters![index]!.time)
        .filter((v) => !v).length === 0;

    if (!isSameOrder) return;

    if (chapters[0].time !== 0) {
      chapters.unshift({ time: 0, title: "Intro" });
    }

    this.chapters = chapters;
  };

  getIsValid = () => {
    if (Math.floor(this.duration / 60) < this.MIN_VALID_DURATION_MIN) {
      return false;
    }
    if (this.chapters.length < this.MIN_VALID_CHAPTER_COUNT) {
      return false;
    }
    return true;
  };

  getCreateCourseDto = (): RepoCreateCourseDto => {
    return {
      videoId: this.videoId,
      channelId: this.channelId,
      categoryId: this.categoryId,
      language: this.language,
      title: this.title,
      description: this.description,
      summary: this.summary,
      chapters: this.chapters,
      enrollCount: this.enrollCount,
      generatedAi: this.generatedAi,
      duration: this.duration,
      extra: this.extra,
      publishedAt: this.publishedAt,
    };
  };
}
