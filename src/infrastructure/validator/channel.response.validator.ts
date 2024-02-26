import z from "zod";
import { IChannelResponseValidator } from "../../controller/channel/channel.interface";
import { ServerError } from "../../dto/error";

export class ChannelResponseValidator implements IChannelResponseValidator {
  static instance: ChannelResponseValidator | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new ChannelResponseValidator();
    return this.instance;
  };

  constructor() {}

  private responseChannelGetCourseListByQuery = z.object({
    courses: z.array(
      z.object({
        id: z.number(),
        videoId: z.string(),
        title: z.string(),
        channelId: z.string(),
        categoryId: z.number(),
        enrollCount: z.number(),
        createdAt: z.date(),
        publishedAt: z.date(),
        enrolls: z.array(z.object({ userId: z.number() })).optional(),
      })
    ),
    pagination: z.object({
      currentPage: z.number(),
      pageSize: z.number(),
    }),
  });

  getCourseListByQuery = (data: any) => {
    try {
      const dto = this.responseChannelGetCourseListByQuery.parse(data);
      return dto;
    } catch (error) {
      console.log(error);
      throw new ServerError({
        code: 400,
        message: "Invalid Response",
      });
    }
  };
}
