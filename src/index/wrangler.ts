import { IRequest, Router, createCors, withCookies } from "itty-router";
import { ENV } from "../env";
import { AuthController } from "../controller/auth/auth.controller";
import { AuthService } from "../application/service/auth.service";
import { UserRepo } from "../infrastructure/repo/user.repo";
import { DrizzleClient } from "../infrastructure/db/drizzle.client";
import { CryptoUtil } from "../infrastructure/crypto/crypto.util";
import { JwtUtil } from "../infrastructure/jwt/jwt.util";
import { EmailUtil } from "../infrastructure/email/email.util";
import { ControllerResponse } from "../dto/response";
import { AuthRequestValidator } from "../infrastructure/validator/auth.request.validator";
import { CourseRequestValidator } from "../infrastructure/validator/course.request.validator";
import { CourseController } from "../controller/course/course.controller";
import { CourseService } from "../application/service/course.service";
import CourseRepo from "../infrastructure/repo/course.repo";
import { ChannelRepo } from "../infrastructure/repo/channel.repo";
import { YoutubeApi } from "../infrastructure/youtubue/youtube.api";
import { MeRequestValidator } from "../infrastructure/validator/me.request.validator";
import { MeService } from "../application/service/me.service";
import { EnrollRepo } from "../infrastructure/repo/enroll.repo";
import { MeController } from "../controller/me/me.controller";
import { CourseResponseValidator } from "../infrastructure/validator/course.response.validator";
import { MeResponseValidator } from "../infrastructure/validator/me.response.validator";
import { ChannelRequestValidator } from "../infrastructure/validator/channel.request.validator";
import { ChannelResponseValidator } from "../infrastructure/validator/channel.response.validator";
import { ChannelService } from "../application/service/channel.service";
import { ChannelController } from "../controller/channel/channel.controller";

type AuthPayload = {
  userId: number;
  uuid: string;
  role: number;
};

type AuthRequest = {
  auth: AuthPayload;
};

type AuthRequestOptional = {
  auth?: AuthPayload;
};

type ContentRequest<T = any> = {
  content: T;
};

export class WranglerSever {
  static instance: WranglerSever;

  static getInstance = (env: ENV) => {
    if (this.instance) return this.instance;
    this.instance = new WranglerSever(env);
    return this.instance;
  };

  private cors: ReturnType<typeof createCors>;

  private app = Router();
  private verifyAuthMiddleware: ({
    cookies,
  }: IRequest) => Promise<Response | undefined>;
  private withContentMiddleware: (
    req: IRequest
  ) => Promise<Response | undefined>;
  private authMiddleware: (req: IRequest) => Promise<void>;

  private authController: AuthController;
  private courseController: CourseController;
  private meController: MeController;
  private channelController: ChannelController;

  constructor(private env: ENV) {
    const dbClient = DrizzleClient.getInstance(this.env);
    const cryptoUtil = CryptoUtil.getInstance();
    const jwtUtil = JwtUtil.getInstance(this.env);
    const emailUtil = EmailUtil.getInstance();
    const youtubeApi = YoutubeApi.getInstance(this.env);

    const userRepo = UserRepo.getInstance(dbClient);
    const courseRepo = CourseRepo.getInstance(dbClient);
    const channelRepo = ChannelRepo.getInstance(dbClient);
    const enrollRepo = EnrollRepo.getInstance(dbClient);

    const authRequestValidator = AuthRequestValidator.getInstance();
    const courseRequestValidator = CourseRequestValidator.getInstance();
    const courseResponseValidator = CourseResponseValidator.getInstance();
    const meRequestValidator = MeRequestValidator.getInstance();
    const meResponseValidator = MeResponseValidator.getInstance();
    const channelRequestValidator = ChannelRequestValidator.getInstance();
    const channelResponseValidator = ChannelResponseValidator.getInstance();

    const authService = AuthService.getInstance({
      cryptoUtil,
      emailUtil,
      ENV: this.env,
      jwtUtil,
      userRepo,
    });

    const courseService = CourseService.getInstance({
      channelRepo,
      courseRepo,
      youtubeApi,
    });

    const meService = MeService.getInstance({
      userRepo,
      courseRepo,
      enrollRepo,
    });

    const channelService = ChannelService.getInstance({
      channelRepo,
      courseRepo,
    });

    this.authController = AuthController.getInstance({
      authService,
      authRequestValidator,
      ENV: this.env,
    });

    this.courseController = CourseController.getInstance({
      courseRequestValidator,
      courseResponseValidator,
      courseService,
    });

    this.meController = MeController.getInstance({
      meService,
      meRequestValidator,
      meResponseValidator,
    });

    this.channelController = ChannelController.getInstance({
      channelService,
      channelRequestValidator,
      channelResponseValidator,
    });

    this.verifyAuthMiddleware = async (req: IRequest) => {
      const result = await this.authController.verifyAccessToken({
        accessToken: req.cookies["accessToken"],
      });

      if (result.getResponse().code >= 300) {
        return this.createJsonResponse(result);
      }

      const payload = result.getResponse().payload.data;

      req.auth = payload;
    };

    this.authMiddleware = async (req: IRequest) => {
      const result = await this.authController.verifyAccessToken({
        accessToken: req.cookies["accessToken"],
      });

      if (result.getResponse().code >= 300) {
        req.auth = undefined;
        return;
      }

      const payload = result.getResponse().payload.data;

      req.auth = payload;
    };

    this.withContentMiddleware = async (req: IRequest) => {
      try {
        const content = await req.json();
        req.content = content;
      } catch (error) {
        return this.createJsonResponse(
          new ControllerResponse({
            code: 400,
            payload: {
              success: false,
              message: "Invalid Input",
            },
          })
        );
      }
    };

    this.cors = createCors({
      methods: ["GET", "POST"],
      origins: [...this.env.CORS_ALLOW_ORIGIN.split(",")],
      headers: {
        ...(this.env.CORS_CREDENTIAL === "true" && {
          "Access-Control-Allow-Credentials": true,
        }),
      },
    });

    this.app.all("*", (request) => {
      return this.cors.preflight(request);
    });

    this.initAuthRouter();
    this.initCourseRouter();
    this.initMeRouter();
    this.initChannelRouter();

    this.app.all("*", () =>
      this.createJsonResponse(
        new ControllerResponse({
          code: 404,
          payload: {
            success: false,
            message: "Not Found",
          },
        })
      )
    );
  }

  private initAuthRouter = () => {
    this.app.post(
      "/api/auth/sign-up",
      this.withContentMiddleware,
      async (req) => {
        const content = req.content;

        const result = await this.authController.signUp(content);

        return this.createJsonResponse(result);
      }
    );

    this.app.get("/api/auth/verify-email", async ({ query }) => {
      const result = await this.authController.verifyEmail(query as any);

      return this.createJsonResponse(result);
    });

    this.app.post(
      "/api/auth/resend-verification-email",
      this.withContentMiddleware,
      async (req) => {
        const content = req.content;
        const result = await this.authController.resendVerificationEmail(
          content
        );

        return this.createJsonResponse(result);
      }
    );

    this.app.post(
      "/api/auth/sign-in",
      this.withContentMiddleware,
      async (req: IRequest & ContentRequest) => {
        const content = req.content;
        const result = await this.authController.signIn(content);

        return this.createJsonResponse(result);
      }
    );

    this.app.get(
      "/api/auth/verify-access-token",
      withCookies,
      async ({ cookies }) => {
        const result = await this.authController.verifyAccessToken({
          accessToken: cookies["accessToken"],
        });

        return this.createJsonResponse(result);
      }
    );

    this.app.get(
      "/api/auth/refresh-access-token",
      withCookies,
      async ({ cookies }) => {
        const result = await this.authController.refreshAccessToken({
          refreshToken: cookies["refreshToken"],
        });

        return this.createJsonResponse(result);
      }
    );

    this.app.post("/api/auth/sign-out", async () => {
      const result = await this.authController.signOut();

      return this.createJsonResponse(result);
    });

    this.app.post(
      "/api/auth/find-password",
      this.withContentMiddleware,
      async (req) => {
        const content = req.content;

        const result = await this.authController.findPassword(content);

        return this.createJsonResponse(result);
      }
    );

    this.app.get("/api/auth/verify-reset-password-token", async (req) => {
      const { query } = req;
      const result = await this.authController.verifyResetPasswordToken(
        query as any
      );

      return this.createJsonResponse(result);
    });

    this.app.post(
      "/api/auth/reset-password",
      this.withContentMiddleware,
      async (req) => {
        const content = req.content;

        const result = await this.authController.resetPassword(content);

        return this.createJsonResponse(result);
      }
    );
  };

  private initCourseRouter = () => {
    this.app.get(
      "/api/courses",
      withCookies,
      this.authMiddleware,
      async (req: IRequest & AuthRequest) => {
        const { query, auth } = req;
        const result = await this.courseController.getCourseListByQuery({
          auth: {
            userId: auth ? auth.userId : undefined,
          },
          query,
        });
        return this.createJsonResponse(result);
      }
    );

    this.app.post(
      "/api/courses",
      withCookies,
      this.verifyAuthMiddleware,
      this.withContentMiddleware,
      async (req: IRequest & AuthRequest & ContentRequest) => {
        const content = req.content;
        const result = await this.courseController.createCourse(content);
        return this.createJsonResponse(result);
      }
    );

    this.app.get(
      "/api/courses/:id",
      withCookies,
      this.authMiddleware,
      async (req: IRequest & AuthRequestOptional) => {
        const { params, auth } = req;

        const result = await this.courseController.getCourseById({
          auth: {
            userId: auth ? auth.userId : undefined,
          },
          params: {
            courseId: params.id,
          },
        });
        return this.createJsonResponse(result);
      }
    );
  };

  private initMeRouter = () => {
    this.app.post(
      "/api/me/enrolls",
      withCookies,
      this.verifyAuthMiddleware,
      this.withContentMiddleware,
      async (req: IRequest & AuthRequest & ContentRequest) => {
        const { auth, content } = req;
        const result = await this.meController.createEnroll({
          auth,
          content,
        });
        return this.createJsonResponse(result);
      }
    );

    this.app.get(
      "/api/me/enrolls",
      withCookies,
      this.verifyAuthMiddleware,
      async (req: IRequest & AuthRequest) => {
        const { auth, query } = req;
        const result = await this.meController.getEnrollListByQuery({
          auth,
          query,
        });
        return this.createJsonResponse(result);
      }
    );

    this.app.patch(
      "/api/me/profile",
      withCookies,
      this.verifyAuthMiddleware,
      this.withContentMiddleware,
      async (req: IRequest & AuthRequest & ContentRequest) => {
        const { auth, content } = req;
        const result = await this.meController.updateProfile({
          auth,
          content,
        });
        return this.createJsonResponse(result);
      }
    );

    this.app.get(
      "/api/me/enrolls/courses/:id",
      withCookies,
      this.verifyAuthMiddleware,
      async (req: IRequest & AuthRequest) => {
        const { params, auth } = req;
        const result = await this.meController.getEnrollsByCourseId({
          auth,
          params: {
            courseId: params.id,
          },
        });
        return this.createJsonResponse(result);
      }
    );

    this.app.patch(
      "/api/me/enrolls/courses",
      withCookies,
      this.verifyAuthMiddleware,
      this.withContentMiddleware,
      async (req: IRequest & AuthRequest & ContentRequest) => {
        const { auth, content } = req;
        const result = await this.meController.updateEnrollByCourseId({
          auth,
          content,
        });
        return this.createJsonResponse(result);
      }
    );

    this.app.patch(
      "/api/me/enrolls/courses/progress",
      withCookies,
      this.verifyAuthMiddleware,
      this.withContentMiddleware,
      async (req: IRequest & AuthRequest & ContentRequest) => {
        const { auth, content } = req;
        const result = await this.meController.updateEnrollProgressByCourseId({
          auth,
          content,
        });
        return this.createJsonResponse(result);
      }
    );
  };

  private initChannelRouter = () => {
    this.app.get(
      "/api/channels/:id/courses",
      withCookies,
      this.authMiddleware,
      async (req: IRequest & AuthRequest) => {
        const { query, auth, params } = req;
        const result = await this.channelController.getCourseListByQuery({
          auth: {
            userId: auth ? auth.userId : undefined,
          },
          query: {
            channelId: params["id"],
            ...query,
          },
        });
        return this.createJsonResponse(result);
      }
    );

    this.app.get("/api/channels/:id", async (req: IRequest) => {
      const { params } = req;
      const result = await this.channelController.getChannelByChannelId({
        params: {
          channelId: params["id"],
        },
      });
      return this.createJsonResponse(result);
    });
  };

  private createJsonResponse = async (
    controllerResponse: ControllerResponse
  ) => {
    const {
      code,
      payload,
      headers: responseHeaders,
    } = controllerResponse.getResponse();
    const headers = new Headers();
    for (const { name, value } of responseHeaders) {
      headers.append(name, value);
    }
    headers.append("Access-Control-Allow-Methods", ["GET", "POST"].join(", "));
    headers.append("Access-Control-Allow-Origin", this.env.CORS_ALLOW_ORIGIN);
    headers.append("Content-type", "application/json");
    if (this.env.CORS_CREDENTIAL === "true") {
      headers.append("Access-Control-Allow-Credentials", "true");
    }

    const body = payload;

    return new Response(JSON.stringify(body), {
      status: code,
      headers,
    });
  };

  get handle() {
    return this.app.handle;
  }
}

export default {
  fetch: (request: Request, env: ENV) => {
    const controller = WranglerSever.getInstance(env);
    return controller.handle(request);
  },
};
