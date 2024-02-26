import { ServiceChannelGetCourseListByQueryDto } from "../../application/service/channel.service";
import { RequestChannelGetCourseListByQuery } from "../../spec/channel/channel.request";
import { ResponseChannelGetCourseListByQuery } from "../../spec/channel/channel.response";

export interface IChannelRequestValidator {
  getCourseListByQuery: (
    query: RequestChannelGetCourseListByQuery
  ) => ServiceChannelGetCourseListByQueryDto;
}

export interface IChannelResponseValidator {
  getCourseListByQuery: (data: any) => ResponseChannelGetCourseListByQuery;
}
