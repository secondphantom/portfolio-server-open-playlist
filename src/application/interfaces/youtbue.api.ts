export type YoutubeVideoInfo = {
  videoId: string;
  publishedAt: Date;
  title: string;
  description: string;
  defaultLanguage: string;
  duration: number;
  channelId: string;
  channelTitle: string;
};

export interface IYoutubeApi {
  getVideoInfo: (videoId: string) => Promise<YoutubeVideoInfo>;
}
