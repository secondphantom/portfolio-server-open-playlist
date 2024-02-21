import z from "zod";

import { IMeRequestValidator } from "../../controller/me/me.interfcae";
import {
  RequestMeCreateEnrollReq,
  RequestMeGetEnrollByCourseIdReq,
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

  private requestMeCreateEnrollReq = z
    .object({
      userId: z.number(),
      courseId: z.number(),
    })
    .strict();

  createEnroll = (req: RequestMeCreateEnrollReq) => {
    try {
      const dto = this.requestMeCreateEnrollReq.parse(req);
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

  private requestMeGetEnrollByCourseIdReq = z
    .object({
      userId: z.number(),
      courseId: z.string().transform((val, ctx) => {
        const result = parseInt(val);
        if (isNaN(result)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Not a number",
          });
          return z.NEVER;
        }
        return result;
      }),
    })
    .strict();

  getEnrollsByCourseId = (req: RequestMeGetEnrollByCourseIdReq) => {
    try {
      const dto = this.requestMeGetEnrollByCourseIdReq.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };
}
