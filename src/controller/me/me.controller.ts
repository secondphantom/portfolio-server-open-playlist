import { MeService } from "../../application/service/me.service";
import { errorResolver } from "../../dto/error.resolver";
import { ControllerResponse } from "../../dto/response";
import {
  RequestMeCreateEnrollReq,
  RequestMeUpdateProfileReq,
} from "../../spec/me/me.request";
import { IMeRequestValidator } from "./me.interfcae";

export class MeController {
  static instance: MeController | undefined;
  static getInstance = ({
    meService,
    meRequestValidator,
  }: {
    meService: MeService;
    meRequestValidator: IMeRequestValidator;
  }) => {
    if (this.instance) return this.instance;
    this.instance = new MeController(meRequestValidator, meService);
    return this.instance;
  };

  constructor(
    private meRequestValidator: IMeRequestValidator,
    private meService: MeService
  ) {}

  createEnroll = async (req: RequestMeCreateEnrollReq) => {
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
      const { code, message } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
        },
      });
    }
  };

  updateProfile = async (req: RequestMeUpdateProfileReq) => {
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
      const { code, message } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
        },
      });
    }
  };
}
