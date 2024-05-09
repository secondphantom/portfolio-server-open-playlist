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
  version: number;
  channel: {
    channelId: string;
    name: string;
  };
  enrolls?: {
    userId: number;
    totalProgress: number;
    updatedAt: Date;
    chapterProgress: { [key in string]: number };
    recentProgress: { chapterIndex: number };
    version: number;
  }[];
  category: {
    id: number;
    name: string;
  } | null;
};

export type ResponseCourseGetByVideoId = ResponseCourseGetById;

export type ResponseCourseGetListByQuery = {
  courses: {
    id: number;
    videoId: string;
    title: string;
    categoryId: number;
    enrollCount: number;
    createdAt: Date;
    publishedAt: Date;
    channel: {
      name: string;
      channelId: string;
    };
    enrolls?: { userId: number }[];
  }[];
  pagination: {
    currentPage: number;
    pageSize: number;
  };
};
