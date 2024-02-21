import z from "zod";

import {
  ServiceMeCreateEnrollDto,
  ServiceMeUpdateProfileDto,
} from "../../application/service/me.service";
import { IMeRequestValidator } from "../../controller/me/me.interfcae";
import {
  RequestMeCreateEnrollReq,
  RequestMeUpdateProfileReq,
} from "../../spec/me/me.request";
import { ServerError } from "../../dto/error";

export class MeRequestValidator implements IMeRequestValidator {
  static instance: MeRequestValidator | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new MeRequestValidator();
    return this.instance;
  };

  constructor() {}

  private requestMeCreateEnrollBody = z
    .object({
      userId: z.number(),
      courseId: z.number(),
    })
    .strict();

  createEnroll = (req: RequestMeCreateEnrollReq) => {
    try {
      const dto = this.requestMeCreateEnrollBody.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestMeUpdateProfileReq = z
    .object({
      userId: z.number(),
      profileName: z.string().min(1),
    })
    .strict();

  updateProfile = (req: RequestMeUpdateProfileReq) => {
    try {
      const dto = this.requestMeUpdateProfileReq.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };
}
