export type ResponseChannelGetCourseListByQuery = {
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
