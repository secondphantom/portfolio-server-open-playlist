import z from "zod";

import { IAnnouncementResponseValidator } from "../../controller/announcement/announcement.interface";
import { ServerError } from "../../dto/error";

export class AnnouncementResponseValidator
  implements IAnnouncementResponseValidator
{
  static instance: AnnouncementResponseValidator | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new AnnouncementResponseValidator();
    return this.instance;
  };

  constructor() {}

  private responseAnnouncementGetById = z
    .object({
      id: z.number(),
      title: z.string(),
      content: z.string(),
      isDisplayedOn: z.boolean(),
      displayStartDate: z.date(),
      displayEndDate: z.date(),
      createdAt: z.date(),
      updatedAt: z.date(),
      admin: z
        .object({
          id: z.number(),
          profileName: z.string(),
        })
        .strict(),
    })
    .strict();

  getAnnouncementById = (data: any) => {
    try {
      const dto = this.responseAnnouncementGetById.parse(data);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Response",
      });
    }
  };

  private responseAnnouncementGetListByQuery = z
    .object({
      announcements: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          createdAt: z.date(),
          isDisplayedOn: z.boolean(),
          admin: z
            .object({
              id: z.number(),
              profileName: z.string(),
            })
            .strict(),
        })
      ),
      pagination: z.object({
        currentPage: z.number(),
        pageSize: z.number(),
      }),
    })
    .strict();

  getAnnouncementListByQuery = (data: any) => {
    try {
      const dto = this.responseAnnouncementGetListByQuery.parse(data);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Response",
      });
    }
  };

  private responseAnnouncementGetIsDisplayedOn = z
    .object({
      id: z.number(),
      title: z.string(),
      createdAt: z.date(),
      isDisplayedOn: z.boolean(),
    })
    .strict();

  getAnnouncementIsDisplayedOn = (data: any) => {
    try {
      const dto = this.responseAnnouncementGetIsDisplayedOn.parse(data);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Response",
      });
    }
  };
}
