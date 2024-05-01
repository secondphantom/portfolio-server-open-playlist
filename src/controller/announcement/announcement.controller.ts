import { AnnouncementService } from "../../application/service/announcement.service";
import { errorResolver } from "../../dto/error.resolver";
import { ControllerResponse } from "../../dto/response";
import {
  RequestAnnouncementGetById,
  RequestAnnouncementGetListByQuery,
} from "../../spec/announcement/announcement.requests";
import {
  IAnnouncementRequestValidator,
  IAnnouncementResponseValidator,
} from "./announcement.interface";

type ConstructorInputs = {
  announcementService: AnnouncementService;
  announcementRequestValidator: IAnnouncementRequestValidator;
  announcementResponseValidator: IAnnouncementResponseValidator;
};

export class AnnouncementController {
  static instance: AnnouncementController | undefined;
  static getInstance = (inputs: ConstructorInputs) => {
    if (this.instance) return this.instance;
    this.instance = new AnnouncementController(inputs);
    return this.instance;
  };

  private announcementRequestValidator: IAnnouncementRequestValidator;
  private announcementResponseValidator: IAnnouncementResponseValidator;
  private announcementService: AnnouncementService;

  constructor({
    announcementRequestValidator,
    announcementResponseValidator,
    announcementService,
  }: ConstructorInputs) {
    this.announcementRequestValidator = announcementRequestValidator;
    this.announcementResponseValidator = announcementResponseValidator;
    this.announcementService = announcementService;
  }

  getAnnouncementById = async (req: RequestAnnouncementGetById) => {
    try {
      const dto = this.announcementRequestValidator.getAnnouncementById(req);
      const data = await this.announcementService.getAnnouncementById(dto);
      const validData =
        this.announcementResponseValidator.getAnnouncementById(data);

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

  getAnnouncementListByQuery = async (
    req: RequestAnnouncementGetListByQuery
  ) => {
    try {
      const dto =
        this.announcementRequestValidator.getAnnouncementListByQuery(req);
      const data = await this.announcementService.getAnnouncementListByQuery(
        dto
      );
      const validData =
        this.announcementResponseValidator.getAnnouncementListByQuery(data);

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

  getAnnouncementIsDisplayedOn = async () => {
    try {
      const data =
        await this.announcementService.getAnnouncementIsDisplayedOn();
      const validData =
        this.announcementResponseValidator.getAnnouncementIsDisplayedOn(data);

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
