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
