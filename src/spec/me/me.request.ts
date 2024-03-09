export type RequestMeCreateEnroll = {
  auth: {
    userId: number;
  };
  content: {
    courseId: number;
  };
};

export type RequestMeGetProfile = {
  auth: {
    userId: number;
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
    chapterProgress: { [key in string]: number };
  };
};

export type RequestMeUpdateEnrollProgressByCourseId = {
  auth: {
    userId: number;
  };
  content: {
    courseId: number;
    partialChapterProgress?: { [key in string]: number };
    recentProgress?: { chapterIndex: number };
    totalProgress?: number;
  };
};

export type RequestMeGetEnrollListByQuery = {
  auth: {
    userId: number;
  };
  query: {
    page?: number;
    order?: "update" | "create";
  };
};
