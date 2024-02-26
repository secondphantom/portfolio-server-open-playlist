import z from "zod";

import { IChannelRequestValidator } from "../../controller/channel/channel.interface";
import { zodIntTransform } from "./lib/zod.util";
import { RequestChannelGetCourseListByQuery } from "../../spec/channel/channel.request";
import { ServerError } from "../../dto/error";

export class ChannelRequestValidator implements IChannelRequestValidator {
  static instance: ChannelRequestValidator | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new ChannelRequestValidator();
    return this.instance;
  };

  constructor() {}

  private requestChannelGetCourseListByQuery = z
    .object({
      auth: z.object({
        userId: z.number().optional(),
      }),
      query: z
        .object({
          channelId: z.string().min(2),
          page: zodIntTransform.optional(),
          categoryId: zodIntTransform.optional(),
          order: z
            .union([z.literal("popular"), z.literal("recent")])
            .optional(),
          videoId: z.string().min(2).optional(),
          search: z.string().min(2).optional(),

          language: z.string().min(1).optional(),
        })
        .strict(),
    })
    .strict();

  getCourseListByQuery = (req: RequestChannelGetCourseListByQuery) => {
    try {
      const dto = this.requestChannelGetCourseListByQuery.parse(req);
      return {
        ...dto.query,
        userId: dto.auth.userId,
      };
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };
}
