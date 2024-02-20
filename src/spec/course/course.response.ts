export type ResponseCourseGetById = {
  id: number;
  videoId: string;
  language: string;
  title: string;
  description: string;
  summary: string | null;
  chapters: { time: number; title: string }[];
  enrollCount: number;
  duration: number;
  createdAt: Date;
  publishedAt: Date;
  channel: {
    channelId: string;
    name: string;
  };
  enrolls?: {
    userId: number;
    totalProgress: number;
    updatedAt: Date;
  }[];
  category: {
    id: number;
    name: string;
  } | null;
};
