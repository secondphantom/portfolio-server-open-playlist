export type RequestMeCreateEnroll = {
  auth: {
    userId: number;
  };
  content: {
    courseId: number;
  };
};

export type RequestMeUpdateProfile = {
  auth: {
    userId: number;
  };
  content: {
    profileName: string;
  };
};

export type RequestMeGetEnrollByCourseId = {
  auth: {
    userId: number;
  };
  params: {
    courseId: string;
  };
};

export type RequestMeUpdateEnrollByCourseId = {
  auth: {
    userId: number;
  };
  content: {
    courseId: number;
    chapterProgress: { time: number; progress: number }[];
  };
};
