import { QueryCourseListDto } from "../application/interfaces/course.repo";
import { ServiceCourseGetListByQueryDto as ServiceCourseGetListByQueryDto } from "../application/service/course.service";

export class CourseListQueryDto {
  private userId?: number;
  private page: number;
  private categoryId?: number;
  private order: "popular" | "recent" | "create";
  private videoId: string | undefined;
  private search: string | undefined;
  private channelId: string | undefined;
  private language: string | undefined;
  private pageSize: number;

  constructor({
    userId,
    page,
    categoryId,
    order,
    videoId,
    search,
    channelId,
    language,
    pageSize,
  }: ServiceCourseGetListByQueryDto & { pageSize?: number }) {
    this.userId = userId;
    this.page = page === undefined ? 1 : page;
    this.categoryId = categoryId;
    this.order = order ? order : "recent";
    this.videoId = videoId;
    this.search = search;
    this.channelId = channelId;
    this.language = language;
    this.pageSize = pageSize ? pageSize : 10;
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
