import { ChannelService } from "../../application/service/channel.service";
import { errorResolver } from "../../dto/error.resolver";
import { ControllerResponse } from "../../dto/response";
import {
  RequestChannelGetChannelByChannelId,
  RequestChannelGetCourseListByQuery,
} from "../../spec/channel/channel.request";
import {
  IChannelRequestValidator,
  IChannelResponseValidator,
} from "./channel.interface";

export class ChannelController {
  static instance: ChannelController | undefined;
  static getInstance = ({
    channelService,
    channelRequestValidator,
    channelResponseValidator,
  }: {
    channelService: ChannelService;
    channelRequestValidator: IChannelRequestValidator;
    channelResponseValidator: IChannelResponseValidator;
  }) => {
    if (this.instance) return this.instance;
    this.instance = new ChannelController(
      channelService,
      channelRequestValidator,
      channelResponseValidator
    );
    return this.instance;
  };

  constructor(
    private channelService: ChannelService,
    private channelRequestValidator: IChannelRequestValidator,
    private channelResponseValidator: IChannelResponseValidator
  ) {}

  getChannelByChannelId = async (req: RequestChannelGetChannelByChannelId) => {
    try {
      const dto = this.channelRequestValidator.getChannelByChannelId(req);
      const data = await this.channelService.getChannelByChannelId(dto);

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

  getCourseListByQuery = async (req: RequestChannelGetCourseListByQuery) => {
    try {
      const dto = this.channelRequestValidator.getCourseListByQuery(req);
      const data = await this.channelService.getCourseListByQuery(dto);
      const validData =
        this.channelResponseValidator.getCourseListByQuery(data);

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
