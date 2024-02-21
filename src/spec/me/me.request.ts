export type RequestMeCreateEnrollReq = {
  auth: {
    userId: number;
  };
  content: {
    courseId: number;
  };
};

export type RequestMeUpdateProfileReq = {
  auth: {
    userId: number;
  };
  content: {
    profileName: string;
  };
};

export type RequestMeGetEnrollByCourseIdReq = {
  auth: {
    userId: number;
  };
  params: {
    courseId: string;
  };
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
