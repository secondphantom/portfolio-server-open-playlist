import {
  IYoutubeApi,
  YoutubeVideoInfo,
} from "../../application/interfaces/youtbue.api";
import { ENV } from "../../env";
import wretch from "wretch";
import { VideoListApiResponse } from "./youtube.api.types";
import { ServerError } from "../../dto/error";

type C_ENV = Pick<ENV, "YOUTUBE_DATA_API_KEY">;

export class YoutubeApi implements IYoutubeApi {
  static instance: YoutubeApi | undefined;
  static getInstance = (ENV: C_ENV) => {
    if (this.instance) return this.instance;
    this.instance = new YoutubeApi(ENV);
    return this.instance;
  };

  constructor(private ENV: C_ENV) {}
  getVideoInfo = async (videoId: string) => {
    const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&key=${this.ENV.YOUTUBE_DATA_API_KEY}&id=${videoId}`;

    const { items } = await wretch()
      .get(url)
      .json<VideoListApiResponse>()
      .catch((error) => {
        throw new ServerError({
          code: 503,
          message: "Youtube Api is not available",
        });
      });

    if (items.length === 0) {
      throw new ServerError({
        code: 404,
        message: "Not Found Youtube Video",
      });
    }

    const {
      id,
      snippet: {
        publishedAt,
        title,
        description,
        defaultLanguage,
        channelId,
        channelTitle,
        liveBroadcastContent,
      },
      contentDetails: { duration: durationISO },
    } = items[0];

    if (liveBroadcastContent === "live") {
      throw new ServerError({
        code: 400,
        message: "You can not create a course with live youtube video",
      });
    }

    return {
      videoId: id,
      publishedAt: new Date(publishedAt),
      title,
      description,
      defaultLanguage: defaultLanguage ? defaultLanguage : "en",
      duration: this.convertISO8601ToSeconds(durationISO),
      channelId,
      channelTitle,
    };
  };

  private convertISO8601ToSeconds = (input: string) => {
    const regex = /P(?:([0-9]+)D)?T(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+)S)?/;
    const parts = regex.exec(input)!;

    const days = parseInt(parts[1]) || 0;
    const hours = parseInt(parts[2]) || 0;
    const minutes = parseInt(parts[3]) || 0;
    const seconds = parseInt(parts[4]) || 0;

    return days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds;
  };
}
