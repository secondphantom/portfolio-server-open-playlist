export type ResponseMeGetEnrollByCourseId = {
  userId: number;
  courseId: number;
  chapterProgress: { time: number; progress: number }[];
  totalProgress: number;
  updatedAt: Date;
  course: {
    title: string;
    chapters: { time: number; title: string }[];
    videoId: string;
  };
};

export type ResponseMeGetEnrollListByQuery = {
  enrolls: {
    createdAt: Date;
    updatedAt: Date;
    courseId: number;
    totalProgress: number;
    course: {
      id: number;
      videoId: string;
      title: string;
    };
  }[];
  pagination: {
    currentPage: number;
    pageSize: number;
  };
};
