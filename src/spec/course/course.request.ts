export type RequestCourseCreate = {
  auth: {
    userId: number;
  };
  content: {
    url: string;
  };
};

export type RequestCourseGetById = {
  auth: {
    userId?: number;
  };
  params: {
    courseId: string;
  };
};

export type RequestCourseListByQuery = {
  auth: {
    userId?: number;
  };
  query: {
    page?: number;
    categoryId?: number;
    order?: "popular" | "recent" | "create";
    videoId?: string;
    search?: string;
    channelId?: string;
    language?: string;
  };
};
