import { MeService } from "../../application/service/me.service";
import { errorResolver } from "../../dto/error.resolver";
import { ControllerResponse } from "../../dto/response";
import {
  RequestMeCreateEnroll,
  RequestMeGetEnrollByCourseId,
  RequestMeGetEnrollListByQuery,
  RequestMeUpdateEnrollByCourseId,
  RequestMeUpdateProfile,
} from "../../spec/me/me.request";
import { IMeRequestValidator, IMeResponseValidator } from "./me.interfcae";

export class MeController {
  static instance: MeController | undefined;
  static getInstance = ({
    meService,
    meRequestValidator,
    meResponseValidator,
  }: {
    meService: MeService;
    meRequestValidator: IMeRequestValidator;
    meResponseValidator: IMeResponseValidator;
  }) => {
    if (this.instance) return this.instance;
    this.instance = new MeController(
      meService,
      meRequestValidator,
      meResponseValidator
    );
    return this.instance;
  };

  constructor(
    private meService: MeService,
    private meRequestValidator: IMeRequestValidator,
    private meResponseValidator: IMeResponseValidator
  ) {}

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
}
