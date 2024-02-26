import z from "zod";

import { IMeRequestValidator } from "../../controller/me/me.interfcae";
import {
  RequestMeCreateEnroll,
  RequestMeGetEnrollByCourseId,
  RequestMeGetEnrollListByQuery,
  RequestMeUpdateEnrollByCourseId,
  RequestMeUpdateProfile,
} from "../../spec/me/me.request";
import { ServerError } from "../../dto/error";
import { ServiceMeUpdateByCourseIdDto } from "../../application/service/me.service";
import { zodIntTransform } from "./lib/zod.util";

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
      auth: z.object({
        userId: z.number(),
      }),
      content: z
        .object({
          courseId: z.number(),
        })
        .strict(),
    })
    .strict();

  createEnroll = (req: RequestMeCreateEnroll) => {
    try {
      const dto = this.requestMeCreateEnrollReq.parse(req);
      return {
        ...dto.content,
        userId: dto.auth.userId,
      };
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestMeUpdateProfileReq = z
    .object({
      auth: z.object({
        userId: z.number(),
      }),
      content: z
        .object({
          profileName: z.string().min(1),
        })
        .strict(),
    })
    .strict();

  updateProfile = (req: RequestMeUpdateProfile) => {
    try {
      const dto = this.requestMeUpdateProfileReq.parse(req);
      return {
        ...dto.content,
        userId: dto.auth.userId,
      };
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestMeGetEnrollByCourseIdReq = z
    .object({
      auth: z.object({
        userId: z.number(),
      }),
      params: z
        .object({
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
        .strict(),
    })
    .strict();

  getEnrollsByCourseId = (req: RequestMeGetEnrollByCourseId) => {
    try {
      const dto = this.requestMeGetEnrollByCourseIdReq.parse(req);
      return {
        ...dto.params,
        userId: dto.auth.userId,
      };
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestMeUpdateEnrollByCourseIdReq = z
    .object({
      auth: z.object({
        userId: z.number(),
      }),
      content: z
        .object({
          courseId: z.number(),
          chapterProgress: z.array(
            z.object({ time: z.number(), progress: z.number() })
          ),
        })
        .strict(),
    })
    .strict();

  updateEnrollsByCourseId = (req: RequestMeUpdateEnrollByCourseId) => {
    try {
      const dto = this.requestMeUpdateEnrollByCourseIdReq.parse(req);
      return {
        userId: dto.auth.userId,
        ...dto.content,
      };
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestMeGetEnrollListByQuery = z
    .object({
      auth: z.object({
        userId: z.number(),
      }),
      query: z
        .object({
          page: zodIntTransform.optional(),
          order: z.union([z.literal("update"), z.literal("create")]).optional(),
        })
        .strict(),
    })
    .strict();

  getEnrollListByQuery = (req: RequestMeGetEnrollListByQuery) => {
    try {
      const dto = this.requestMeGetEnrollListByQuery.parse(req);
      return {
        userId: dto.auth.userId,
        ...dto.query,
      };
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };
}
