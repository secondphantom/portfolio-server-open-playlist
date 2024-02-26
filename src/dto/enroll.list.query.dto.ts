import { QueryEnrollListDto } from "../application/interfaces/enroll.repo";
import { ServiceMeGetEnrollListByQueryDto } from "../application/service/me.service";

export class EnrollListQueryDto {
  private userId: number;
  private order: "update" | "create";
  private page: number;
  private pageSize: number;

  constructor({
    userId,
    page,
    order,
    pageSize,
  }: ServiceMeGetEnrollListByQueryDto & { pageSize?: number }) {
    this.userId = userId;
    this.order = order ? order : "update";
    this.page = page === undefined ? 1 : page;
    this.pageSize = pageSize ? pageSize : 10;
  }

  getRepoQueryDto = (): QueryEnrollListDto => {
    return {
      userId: this.userId,
      order: this.order,
      page: this.page,
      pageSize: this.pageSize,
    };
  };
}
