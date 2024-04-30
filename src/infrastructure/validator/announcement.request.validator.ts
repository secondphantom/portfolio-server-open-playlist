import z from "zod";

import { IAnnouncementRequestValidator } from "../../controller/announcement/announcement.interface";
import {
  RequestAnnouncementGetById,
  RequestAnnouncementGetListByQuery,
} from "../../spec/announcement/announcement.requests";
import { ServerError } from "../../dto/error";
import {
  zodBooleanTransform,
  zodDateTransform,
  zodIntTransform,
} from "./lib/zod.util";

export class AnnouncementRequestValidator
  implements IAnnouncementRequestValidator
{
  static instance: AnnouncementRequestValidator | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new AnnouncementRequestValidator();
    return this.instance;
  };

  constructor() {}

  private requestAnnouncementGetById = z
    .object({
      id: zodIntTransform,
    })
    .strict();

  getAnnouncementById = (req: RequestAnnouncementGetById) => {
    try {
      const dto = this.requestAnnouncementGetById.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestAnnouncementGetListByQuery = z
    .object({
      order: z.union([z.literal("recent"), z.literal("old")]).optional(),
      page: zodIntTransform.optional(),
      search: z.string().min(2).optional(),
      isDisplayedOn: zodBooleanTransform.optional(),
      displayStartDate: zodDateTransform.optional(),
      displayEndDate: zodDateTransform.optional(),
    })
    .strict();

  getAnnouncementListByQuery = (req: RequestAnnouncementGetListByQuery) => {
    try {
      const dto = this.requestAnnouncementGetListByQuery.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };
}
