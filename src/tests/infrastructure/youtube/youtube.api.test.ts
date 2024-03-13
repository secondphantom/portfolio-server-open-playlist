import dotenv from "dotenv";
import { IYoutubeApi } from "../../../application/interfaces/youtbue.api";
import { YoutubeApi } from "../../../infrastructure/youtubue/youtube.api";
dotenv.config();

describe.skip("youtube api", () => {
  let youtubeApi: IYoutubeApi;

  beforeAll(() => {
    youtubeApi = new YoutubeApi({
      YOUTUBE_DATA_API_KEY: process.env.YOUTUBE_DATA_API_KEY!,
    });
  });

  test("get valid video info", async () => {
    const videoId = "zA8guDqfv40";

    const videoInfo = await youtubeApi.getVideoInfo(videoId);

    expect(videoInfo).toEqual(youtubeVideoInfoExpect);
  });

  test("invalid video id", async () => {
    const videoId = "zA8guDqfv4022222";

    expect(async () => {
      await youtubeApi.getVideoInfo(videoId);
    }).rejects.toThrow();
  });
});

const youtubeVideoInfoExpect = expect.objectContaining({
  videoId: expect.any(String),
  publishedAt: expect.any(Date),
  title: expect.any(String),
  description: expect.any(String),
  defaultLanguage: expect.any(String),
  duration: expect.any(Number),
  channelId: expect.any(String),
  channelTitle: expect.any(String),
});
