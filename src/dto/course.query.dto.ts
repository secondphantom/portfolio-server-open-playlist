import { QueryCourseListDto } from "../application/interfaces/course.repo";
import { ServiceCourseGetListByQueryDto as ServiceCourseGetListByQueryDto } from "../application/service/course.service";

export class CourseListQueryDto {
  private userId?: number;
  private page: number;
  private categoryId?: number;
  private order: "popular" | "recent";
  private videoId: string | undefined;
  private search: string | undefined;
  private channelId: string | undefined;
  private language: string | undefined;
  private pageSize = 10;

  constructor({
    userId,
    page,
    categoryId,
    order,
    videoId,
    search,
    channelId,
    language,
  }: ServiceCourseGetListByQueryDto) {
    this.userId = userId;
    this.page = page === undefined ? 1 : page;
    this.categoryId = categoryId;
    this.order = order ? order : "recent";
    this.videoId = videoId;
    this.search = search;
    this.channelId = channelId;
    this.language = language;
  }

  getRepoQueryDto = (): QueryCourseListDto => {
    return {
      userId: this.userId,
      page: this.page,
      categoryId: this.categoryId,
      order: this.order,
      videoId: this.videoId,
      search: this.search,
      channelId: this.channelId,
      language: this.language,
      pageSize: this.pageSize,
    };
  };
}
