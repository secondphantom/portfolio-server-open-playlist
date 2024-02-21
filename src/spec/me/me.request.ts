export type RequestMeCreateEnrollReq = {
  userId: number;
  courseId: number;
};

export type RequestMeUpdateProfileReq = {
  userId: number;
  profileName: string;
};

export type RequestMeGetEnrollByCourseIdReq = {
  userId: number;
  courseId: string;
};

export type RequestMeUpdateEnrollByCourseIdReq = {
  auth: {
    userId: number;
  };
  content: {
    courseId: number;
    chapterProgress: { time: number; progress: number }[];
  };
};
