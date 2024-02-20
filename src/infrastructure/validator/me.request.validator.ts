import z from "zod";

import { ServiceMeCreateEnrollDto } from "../../application/service/me.service";
import { IMeRequestValidator } from "../../controller/me/me.interfcae";
import { RequestMeCreateEnrollBody } from "../../spec/me/me.request";
import { ServerError } from "../../dto/error";

export class MeRequestValidator implements IMeRequestValidator {
  static instance: MeRequestValidator | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new MeRequestValidator();
    return this.instance;
  };

  constructor() {}

  private requestMeCreateEnrollBody = z.object({
    userId: z.number(),
    courseId: z.number(),
  });

  createEnroll = (body: RequestMeCreateEnrollBody) => {
    try {
      const dto = this.requestMeCreateEnrollBody.parse(body);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };
}
