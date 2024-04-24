import z from "zod";

import { IMeRequestValidator } from "../../controller/me/me.interfcae";
import {
  RequestMeCreateEnroll,
  RequestMeCreateFreeCredit,
  RequestMeDeleteAccount,
  RequestMeGetCredit,
  RequestMeGetEnrollByCourseId,
  RequestMeGetEnrollListByQuery,
  RequestMeGetProfile,
  RequestMeUpdateEnrollByCourseId,
  RequestMeUpdateEnrollProgressByCourseId,
  RequestMeUpdateProfile,
} from "../../spec/me/me.request";
import { ServerError } from "../../dto/error";
import { ServiceMeUpdateEnrollByCourseIdDto } from "../../application/service/me.service";
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

  private requestMeGetProfileReq = z
    .object({
      auth: z.object({
        userId: z.number(),
      }),
    })
    .strict();

  getProfile = (req: RequestMeGetProfile) => {
    try {
      const dto = this.requestMeGetProfileReq.parse(req);
      return {
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
          profileName: z.string().min(1).max(80),
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
          chapterProgress: z.record(z.string(), z.number()),
          version: z.number(),
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

  private requestMeUpdateEnrollProgressByCourseId = z
    .object({
      auth: z.object({
        userId: z.number(),
      }),
      content: z
        .object({
          courseId: z.number(),
          partialChapterProgress: z.record(z.string(), z.number()).optional(),
          recentProgress: z
            .object({
              chapterIndex: z.number(),
            })
            .strict()
            .optional(),
          totalProgress: z.number().optional(),
        })
        .strict(),
    })
    .strict();

  updateEnrollProgressByCourseId = (
    req: RequestMeUpdateEnrollProgressByCourseId
  ) => {
    try {
      const dto = this.requestMeUpdateEnrollProgressByCourseId.parse(req);
      if (!dto.content.partialChapterProgress && !dto.content.recentProgress) {
        throw new Error("Invalid Input");
      }
      if (
        dto.content.partialChapterProgress &&
        dto.content.totalProgress === undefined
      ) {
        throw new Error("Invalid Input");
      }
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

  private requestMeGetCredit = z
    .object({
      auth: z.object({
        userId: z.number(),
      }),
    })
    .strict();

  getCredit = (req: RequestMeGetCredit) => {
    try {
      const dto = this.requestMeGetCredit.parse(req);
      return {
        userId: dto.auth.userId,
      };
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestMeCreateFreeCredit = z
    .object({
      auth: z.object({
        userId: z.number(),
      }),
    })
    .strict();

  createFreeCredit = (req: RequestMeCreateFreeCredit) => {
    try {
      const dto = this.requestMeCreateFreeCredit.parse(req);
      return {
        userId: dto.auth.userId,
      };
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestMeDeleteAccount = z
    .object({
      auth: z.object({
        userId: z.number(),
      }),
    })
    .strict();

  deleteAccount = (req: RequestMeDeleteAccount) => {
    try {
      const dto = this.requestMeDeleteAccount.parse(req);
      return {
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
