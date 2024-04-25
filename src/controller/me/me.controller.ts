import { MeService } from "../../application/service/me.service";
import { errorResolver } from "../../dto/error.resolver";
import { ControllerResponse } from "../../dto/response";
import { ENV } from "../../env";
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
import { IMeRequestValidator, IMeResponseValidator } from "./me.interfcae";

type C_ENV = Pick<ENV, "CORS_CREDENTIAL">;
type ConstructorInputs = {
  meService: MeService;
  meRequestValidator: IMeRequestValidator;
  meResponseValidator: IMeResponseValidator;
  ENV: C_ENV;
};

export class MeController {
  static instance: MeController | undefined;
  static getInstance = (input: ConstructorInputs) => {
    if (this.instance) return this.instance;
    this.instance = new MeController(input);
    return this.instance;
  };

  private meService: MeService;
  private meRequestValidator: IMeRequestValidator;
  private meResponseValidator: IMeResponseValidator;
  private ENV: C_ENV;

  constructor({
    meService,
    meRequestValidator,
    meResponseValidator,
    ENV,
  }: ConstructorInputs) {
    this.meService = meService;
    this.meRequestValidator = meRequestValidator;
    this.meResponseValidator = meResponseValidator;
    this.ENV = ENV;
  }

  createEnroll = async (req: RequestMeCreateEnroll) => {
    try {
      const dto = this.meRequestValidator.createEnroll(req);
      await this.meService.createEnroll(dto);

      return new ControllerResponse({
        code: 201,
        payload: {
          success: true,
          message: "Success Created",
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  getProfile = async (req: RequestMeGetProfile) => {
    try {
      const dto = this.meRequestValidator.getProfile(req);
      const data = await this.meService.getProfile(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          data,
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  updateProfile = async (req: RequestMeUpdateProfile) => {
    try {
      const dto = this.meRequestValidator.updateProfile(req);
      await this.meService.updateProfile(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success Updated",
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  getEnrollsByCourseId = async (req: RequestMeGetEnrollByCourseId) => {
    try {
      const dto = this.meRequestValidator.getEnrollsByCourseId(req);
      const data = await this.meService.getEnrollsByCourseId(dto);
      const validData = this.meResponseValidator.getEnrollsByCourseId(data);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          data: validData,
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  updateEnrollByCourseId = async (req: RequestMeUpdateEnrollByCourseId) => {
    try {
      const dto = this.meRequestValidator.updateEnrollsByCourseId(req);
      await this.meService.updateEnrollByCourseId(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success Updated",
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  updateEnrollProgressByCourseId = async (
    req: RequestMeUpdateEnrollProgressByCourseId
  ) => {
    try {
      const dto = this.meRequestValidator.updateEnrollProgressByCourseId(req);
      await this.meService.updateEnrollProgressByCourseId(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success Updated",
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  getEnrollListByQuery = async (req: RequestMeGetEnrollListByQuery) => {
    try {
      const dto = this.meRequestValidator.getEnrollListByQuery(req);
      const data = await this.meService.getEnrollListByQuery(dto);
      const validData = this.meResponseValidator.getEnrollListByQuery(data);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          data: validData,
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  getCredit = async (req: RequestMeGetCredit) => {
    try {
      const dto = this.meRequestValidator.getCredit(req);
      const data = await this.meService.getCredit(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          data,
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  createFreeCredit = async (req: RequestMeCreateFreeCredit) => {
    try {
      const dto = this.meRequestValidator.createFreeCredit(req);
      await this.meService.createFreeCredit(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success Created",
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  deleteAccount = async (req: RequestMeDeleteAccount) => {
    try {
      const dto = this.meRequestValidator.deleteAccount(req);
      await this.meService.deleteAccount(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success Deleted",
        },
        headers: [
          {
            name: "Set-Cookie",
            value: `accessToken=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; HttpOnly; Secure; SameSite=${
              this.ENV.CORS_CREDENTIAL === "true" ? "None" : "Strict"
            }`,
          },
          {
            name: "Set-Cookie",
            value: `refreshToken=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; HttpOnly; Secure; SameSite=${
              this.ENV.CORS_CREDENTIAL === "true" ? "None" : "Strict"
            }`,
          },
        ],
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };
}
