import { ServerError } from "../../dto/error";
import { IAnnouncementRepo } from "../interfaces/announcement.repo";

export type ServiceAnnouncementGetByIdDto = {
  id: number;
};

export type ServiceAnnouncementGetListByQueryDto = {
  order?: "recent" | "old";
  page?: number;
  search?: string;
  isDisplayedOn?: boolean;
  displayStartDate?: Date;
  displayEndDate?: Date;
};

type ConstructorInputs = {
  announcementRepo: IAnnouncementRepo;
};

export class AnnouncementService {
  static instance: AnnouncementService | undefined;
  static getInstance = (inputs: ConstructorInputs) => {
    if (this.instance) return this.instance;
    this.instance = new AnnouncementService(inputs);
    return this.instance;
  };

  private announcementRepo: IAnnouncementRepo;

  constructor({ announcementRepo }: ConstructorInputs) {
    this.announcementRepo = announcementRepo;
  }

  // [GET] /announcements/:id
  getAnnouncementById = async ({ id }: ServiceAnnouncementGetByIdDto) => {
    const announcement = await this.announcementRepo.getByIdWith(id, {
      announcement: {
        id: true,
        title: true,
        content: true,
        isDisplayedOn: true,
        displayStartDate: true,
        displayEndDate: true,
        createdAt: true,
        updatedAt: true,
      },
      admin: {
        id: true,
        profileName: true,
      },
    });

    if (!announcement) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    return announcement;
  };

  // [GET] /announcements?
  getAnnouncementListByQuery = async ({
    order,
    page,
    search,
    isDisplayedOn,
    displayStartDate,
    displayEndDate,
  }: ServiceAnnouncementGetListByQueryDto) => {
    const pagination = {
      currentPage: page === undefined ? 1 : page,
      pageSize: 10,
    };

    const announcements = await this.announcementRepo.getListByQuery({
      order: order ? order : "recent",
      page: pagination.currentPage,
      pageSize: 10,
      search,
      isDisplayedOn,
      displayStartDate,
      displayEndDate,
    });

    if (announcements.length === 0) {
      throw new ServerError({
        code: 200,
        message: "Empty",
        data: {
          announcements: [],
          pagination,
        },
      });
    }

    return {
      announcements,
      pagination,
    };
  };

  // [GET] /announcements/is-displayed-on
  getAnnouncementIsDisplayedOn = async () => {
    const nowDate = new Date();
    const announcements = await this.announcementRepo.getListBySimple(
      {
        order: "recent",
        limit: 1,
        displayStartDate: nowDate,
        displayEndDate: nowDate,
        isDisplayedOn: true,
      },
      {
        id: true,
        title: true,
        createdAt: true,
        isDisplayedOn: true,
      }
    );

    if (announcements.length === 0) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    return announcements[0];
  };
}
