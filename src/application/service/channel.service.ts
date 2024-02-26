import { CourseListQueryDto } from "../../dto/course.list.query.dto";
import { ServerError } from "../../dto/error";
import { IChannelRepo } from "../interfaces/channel.repo";
import { ICourseRepo } from "../interfaces/course.repo";

export type ServiceChannelGetChannelByChannelId = {
  channelId: string;
};

export type ServiceChannelGetCourseListByQueryDto = {
  channelId: string;
  userId?: number;
  page?: number;
  categoryId?: number;
  order?: "popular" | "recent";
  videoId?: string;
  search?: string;
  language?: string;
};

export class ChannelService {
  static instance: ChannelService | undefined;
  static getInstance = (inputs: {
    channelRepo: IChannelRepo;
    courseRepo: ICourseRepo;
  }) => {
    if (this.instance) return this.instance;
    this.instance = new ChannelService(inputs);
    return this.instance;
  };
  private courseRepo: ICourseRepo;
  private channelRepo: IChannelRepo;

  constructor({
    courseRepo,
    channelRepo,
  }: {
    channelRepo: IChannelRepo;
    courseRepo: ICourseRepo;
  }) {
    this.channelRepo = channelRepo;
    this.courseRepo = courseRepo;
  }

  // [GET] /channels/:id
  getChannelByChannelId = async (dto: ServiceChannelGetChannelByChannelId) => {
    const channel = this.channelRepo.getChannelByChannelId(dto.channelId, {
      channelId: true,
      name: true,
      enrollCount: true,
    });

    if (!channel) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    return channel;
  };

  // [GET] /channels/:id/courses?
  getCourseListByQuery = async (dto: ServiceChannelGetCourseListByQueryDto) => {
    const courseListQueryDto = new CourseListQueryDto({ ...dto });

    const queryDto = courseListQueryDto.getRepoQueryDto();
    const courses = await this.courseRepo.getCourseListByQuery(queryDto);

    const pagination = {
      currentPage: queryDto.page,
      pageSize: queryDto.pageSize,
    };

    if (courses.length === 0) {
      throw new ServerError({
        code: 200,
        message: "Empty",
        data: {
          courses: [],
          pagination,
        },
      });
    }

    return {
      courses,
      pagination,
    };
  };
}
