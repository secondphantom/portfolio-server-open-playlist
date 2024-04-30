import {
  ServiceAnnouncementGetByIdDto,
  ServiceAnnouncementGetListByQueryDto,
} from "../../application/service/announcement.service";
import {
  RequestAnnouncementGetById,
  RequestAnnouncementGetListByQuery,
} from "../../spec/announcement/announcement.requests";
import {
  ResponseAnnouncementGetById,
  ResponseAnnouncementGetIsDisplayedOn,
  ResponseAnnouncementGetListByQuery,
} from "../../spec/announcement/announcement.responses";

export interface IAnnouncementRequestValidator {
  getAnnouncementById: (
    req: RequestAnnouncementGetById
  ) => ServiceAnnouncementGetByIdDto;
  getAnnouncementListByQuery: (
    req: RequestAnnouncementGetListByQuery
  ) => ServiceAnnouncementGetListByQueryDto;
}

export interface IAnnouncementResponseValidator {
  getAnnouncementById: (data: any) => ResponseAnnouncementGetById;
  getAnnouncementListByQuery: (data: any) => ResponseAnnouncementGetListByQuery;
  getAnnouncementIsDisplayedOn: (
    data: any
  ) => ResponseAnnouncementGetIsDisplayedOn;
}
