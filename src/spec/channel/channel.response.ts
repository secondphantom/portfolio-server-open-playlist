export type ResponseChannelGetCourseListByQuery = {
  courses: {
    id: number;
    videoId: string;
    title: string;
    channelId: string;
    categoryId: number;
    enrollCount: number;
    createdAt: Date;
    publishedAt: Date;
    enrolls?: { userId: number }[];
  }[];
  pagination: {
    currentPage: number;
    pageSize: number;
  };
};
