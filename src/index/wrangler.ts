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
import { CourseRepo } from "../infrastructure/repo/course.repo";
import { ChannelRepo } from "../infrastructure/repo/channel.repo";
import { YoutubeApi } from "../infrastructure/youtubue/youtube.api";
import { MeRequestValidator } from "../infrastructure/validator/me.request.validator";
import { MeService } from "../application/service/me.service";
import { EnrollRepo } from "../infrastructure/repo/enroll.repo";
import { MeController } from "../controller/me/me.controller";

type AuthRequest = {
  userId: number;
  uuid: string;
  role: number;
};
type IRequestWithAuth = IRequest & {
  auth: AuthRequest;
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

  private authController: AuthController;
  private courseController: CourseController;
  private meController: MeController;

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
    const meRequestValidator = MeRequestValidator.getInstance();

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
      courseRepo,
      enrollRepo,
    });

    this.authController = AuthController.getInstance({
      authService,
      authRequestValidator,
    });

    this.courseController = CourseController.getInstance({
      courseRequestValidator,
      courseService,
    });

    this.meController = MeController.getInstance({
      meRequestValidator,
      meService,
    });

    this.verifyAuthMiddleware = async (req: IRequest) => {
      const result = await this.authController.verifyAccessToken({
        accessToken: req.cookies["AccessToken"],
      });

      if (result.getResponse().code >= 300) {
        return this.createJsonResponse(result);
      }

      const payload = result.getResponse().payload.data as AuthRequest;

      req.auth = payload;
    };

    this.cors = createCors({
      methods: ["GET", "POST"],
      origins: [...this.env.CORS_ALLOW_ORIGIN.split(",")],
    });

    this.app.all("*", (request) => {
      return this.cors.preflight(request);
    });

    this.initAuthRouter();
    this.initCourseRouter();
    this.initMeRouter();

    this.app.all(
      "*",
      () =>
        new Response(
          JSON.stringify({
            success: false,
            message: "Not Found",
          }),
          {
            status: 404,
          }
        )
    );
  }

  private initAuthRouter = () => {
    this.app.post("/api/auth/sign-up", async (req) => {
      const body = await req.json();

      const result = await this.authController.signUp(body as any);

      return this.createJsonResponse(result);
    });

    this.app.get("/api/auth/verify-email", async ({ query }) => {
      const result = await this.authController.verifyEmail(query as any);

      return this.createJsonResponse(result);
    });

    this.app.post("/api/auth/resend-verification-email", async (req) => {
      const body = await req.json();
      const result = await this.authController.resendVerificationEmail(
        body as any
      );

      return this.createJsonResponse(result);
    });

    this.app.post("/api/auth/sign-in", async (req) => {
      const body = await req.json();
      const result = await this.authController.signIn(body as any);

      return this.createJsonResponse(result);
    });

    this.app.get(
      "/api/auth/verify-access-token",
      withCookies,
      async ({ cookies }) => {
        const result = await this.authController.verifyAccessToken({
          accessToken: cookies["AccessToken"],
        });

        return this.createJsonResponse(result);
      }
    );

    this.app.get(
      "/api/auth/refresh-access-token",
      withCookies,
      async ({ cookies }) => {
        const result = await this.authController.refreshAccessToken({
          refreshToken: cookies["RefreshToken"],
        });

        return this.createJsonResponse(result);
      }
    );
  };

  private initCourseRouter = () => {
    this.app.post(
      "/api/courses",
      withCookies,
      this.verifyAuthMiddleware,
      async (req) => {
        const body = await req.json();
        const result = await this.courseController.createCourse(body as any);
        return this.createJsonResponse(result);
      }
    );
  };

  private initMeRouter = () => {
    this.app.post(
      "/api/me/enrolls",
      withCookies,
      this.verifyAuthMiddleware,
      async (req: IRequestWithAuth) => {
        const auth = req.auth;
        const body = (await req.json()) as any;
        const result = await this.meController.createEnroll({
          courseId: body["courseId"],
          userId: auth["userId"],
        });
        return this.createJsonResponse(result);
      }
    );
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
    headers.append("Content-type", "application/json");
    for (const { name, value } of responseHeaders) {
      headers.append(name, value);
    }
    const body = payload;

    return this.cors.corsify(
      new Response(JSON.stringify(body), {
        status: code,
        headers,
      })
    );
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
