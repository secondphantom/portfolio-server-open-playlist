import { ChannelDomain } from "../../domain/channel.domain";
import { CourseDomain } from "../../domain/course.domain";
import { ServerError } from "../../dto/error";
import { IChannelRepo } from "../interfaces/channel.repo";
import { ICourseRepo } from "../interfaces/course.repo";
import { IYoutubeApi } from "../interfaces/youtbue.api";

export type ServiceCourseCreateDto = {
  videoId: string;
};

export class CourseService {
  static instance: CourseService | undefined;
  static getInstance = (inputs: {
    courseRepo: ICourseRepo;
    channelRepo: IChannelRepo;
    youtubeApi: IYoutubeApi;
  }) => {
    if (this.instance) return this.instance;
    this.instance = new CourseService(inputs);
    return this.instance;
  };

  private courseRepo: ICourseRepo;
  private youtubeApi: IYoutubeApi;
  private channelRepo: IChannelRepo;

  constructor({
    courseRepo,
    channelRepo,
    youtubeApi,
  }: {
    courseRepo: ICourseRepo;
    channelRepo: IChannelRepo;
    youtubeApi: IYoutubeApi;
  }) {
    this.courseRepo = courseRepo;
    this.channelRepo = channelRepo;
    this.youtubeApi = youtubeApi;
  }

  // [POST] /courses
  createCourse = async ({ videoId }: ServiceCourseCreateDto) => {
    const course = await this.courseRepo.getCourseByVideoId(videoId);

    if (course) {
      throw new ServerError({
        code: 409,
        message: "Conflict",
      });
    }

    const videoInfo = await this.youtubeApi.getVideoInfo(videoId);

    const courseDomain = new CourseDomain({
      videoId: videoInfo.videoId,
      channelId: videoInfo.channelId,
      language: videoInfo.defaultLanguage,
      title: videoInfo.title,
      description: videoInfo.description,
      duration: videoInfo.duration,
      publishedAt: videoInfo.publishedAt,
    });
    courseDomain.updateChaptersByDescription();

    const isValidCourse = courseDomain.getIsValid();

    if (!isValidCourse) {
      throw new ServerError({
        code: 400,
        message: "Not Valid Youtube Video",
      });
    }

    const channel = await this.channelRepo.getChannelByChannelId(
      videoInfo.channelId
    );

    if (!channel) {
      const channelDomain = new ChannelDomain({
        channelId: videoInfo.channelId,
        name: videoInfo.channelTitle,
      });
      await this.channelRepo.createChannel(channelDomain.getCreateChannelDto());
    }

    const createCourseDto = courseDomain.getCreateCourseDto();
    await this.courseRepo.createCourse(createCourseDto);
  };
  // [GET] /courses/:id
  // [GET] /courses?
}
