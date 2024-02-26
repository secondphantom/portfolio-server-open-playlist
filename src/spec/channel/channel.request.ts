export type RequestChannelGetCourseListByQuery = {
  auth: {
    userId?: number;
  };
  query: {
    channelId: string;
    page?: number;
    order?: "popular" | "recent";
    videoId?: string;
    search?: string;
    language?: string;
    categoryId?: number;
  };
};
