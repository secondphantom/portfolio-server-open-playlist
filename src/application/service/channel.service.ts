import { CourseListQueryDto } from "../../dto/course.query.dto";
import { ServerError } from "../../dto/error";
import { ICourseRepo } from "../interfaces/course.repo";

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
  static getInstance = (inputs: { courseRepo: ICourseRepo }) => {
    if (this.instance) return this.instance;
    this.instance = new ChannelService(inputs);
    return this.instance;
  };
  private courseRepo: ICourseRepo;

  constructor({ courseRepo }: { courseRepo: ICourseRepo }) {
    this.courseRepo = courseRepo;
  }

  // [GET] /channels/:id

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
