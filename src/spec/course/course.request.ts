export type RequestCourseCreateBody = {
  url: string;
};

export type RequestCourseGetById = {
  auth: {
    userId?: number;
  };
  params: {
    courseId: string;
  };
};
