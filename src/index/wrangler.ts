import { Router, createCors } from "itty-router";
import { ENV } from "../env";
import { AuthController } from "../controller/auth/auth.controller";
import { AuthService } from "../application/service/auth.service";
import { UserRepo } from "../infrastructure/repo/user.repo";
import { DrizzleClient } from "../infrastructure/db/drizzle.client";
import { CryptoUtil } from "../infrastructure/crypto/crypto.util";
import { JwtUtil } from "../infrastructure/jwt/jwt.util";
import { EmailUtil } from "../infrastructure/email/email.util";
import { ControllerResponse } from "../dto/response";
import { AuthValidator } from "../infrastructure/validator/auth.validator";
export class WranglerSever {
  static instance: WranglerSever;

  static getInstance = (env: ENV) => {
    if (this.instance) return this.instance;
    this.instance = new WranglerSever(env);
    return this.instance;
  };

  private cors: ReturnType<typeof createCors>;

  private authController: AuthController;

  private app = Router();

  constructor(private env: ENV) {
    const dbClient = DrizzleClient.getInstance(this.env);
    const cryptoUtil = CryptoUtil.getInstance();
    const jwtUtil = JwtUtil.getInstance(this.env);
    const emailUtil = EmailUtil.getInstance();

    const userRepo = UserRepo.getInstance(dbClient);

    const authService = AuthService.getInstance({
      cryptoUtil,
      emailUtil,
      ENV: this.env,
      jwtUtil,
      userRepo,
    });

    const authValidator = AuthValidator.getInstance();

    this.authController = AuthController.getInstance({
      authService,
      authValidator,
    });

    this.cors = createCors({
      methods: ["GET"],
      origins: [...this.env.CORS_ALLOW_ORIGIN.split(",")],
    });

    this.app.all("*", (request) => {
      return this.cors.preflight(request);
    });

    this.app.post("/api/auth/sign-up", async (req: Request) => {
      const body = await req.json();

      const result = await this.authController.signUp(body as any);

      return this.createJsonResponse(result);
    });

    this.app.get("/api/auth/verify-email", async ({ query }) => {
      const result = await this.authController.verifyEmail(query as any);

      return this.createJsonResponse(result);
    });

    this.app.all(
      "*",
      () =>
        new Response(
          JSON.stringify({
            success: false,
            data: {
              message: "Not found",
            },
          }),
          {
            status: 404,
          }
        )
    );
  }

  private createJsonResponse = async (
    controllerResponse: ControllerResponse
  ) => {
    const headers = {
      "Content-type": "application/json",
    };
    const { code, payload } = controllerResponse.getResponse();
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
