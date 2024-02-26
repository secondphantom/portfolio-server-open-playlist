import {
  ServiceChannelGetChannelByChannelId,
  ServiceChannelGetCourseListByQueryDto,
} from "../../application/service/channel.service";
import {
  RequestChannelGetChannelByChannelId,
  RequestChannelGetCourseListByQuery,
} from "../../spec/channel/channel.request";
import { ResponseChannelGetCourseListByQuery } from "../../spec/channel/channel.response";

export interface IChannelRequestValidator {
  getChannelByChannelId: (
    query: RequestChannelGetChannelByChannelId
  ) => ServiceChannelGetChannelByChannelId;
  getCourseListByQuery: (
    query: RequestChannelGetCourseListByQuery
  ) => ServiceChannelGetCourseListByQueryDto;
}

export interface IChannelResponseValidator {
  getCourseListByQuery: (data: any) => ResponseChannelGetCourseListByQuery;
}
