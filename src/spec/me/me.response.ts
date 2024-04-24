export type ResponseMeGetProfile = {
  profileName: string;
  email: string;
  updatedAt: Date;
};

export type ResponseMeGetEnrollByCourseId = {
  userId: number;
  courseId: number;
  chapterProgress: { [key in string]: number };
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

export type ResponseMeGetCredit = {
  userId: number;
  freeCredits: number;
  purchasedCredits: number;
  freeCreditUpdatedAt: Date;
  purchasedCreditUpdatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};
