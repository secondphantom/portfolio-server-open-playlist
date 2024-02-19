import { EnrollDomain } from "../../domain/enroll.domain";

describe("enroll domain", () => {
  describe("updateProgress", () => {
    test("undefined", () => {
      const enrollDomain = new EnrollDomain({
        courseId: 0,
        userId: 0,
      });

      const totalProgress = enrollDomain["totalProgress"];

      expect(totalProgress).toEqual(0);
    });
    test("length = 0", () => {
      const enrollDomain = new EnrollDomain({
        courseId: 0,
        userId: 0,
        chapterProgress: [],
      });

      const totalProgress = enrollDomain["totalProgress"];

      expect(totalProgress).toEqual(0);
    });
    test("existed", () => {
      const enrollDomain = new EnrollDomain({
        courseId: 0,
        userId: 0,
        chapterProgress: [
          { time: 0, progress: 1 },
          { time: 0, progress: 0.1 },
          { time: 0, progress: 1 },
        ],
      });

      const totalProgress = enrollDomain["totalProgress"];

      expect(totalProgress).toEqual(2 / 3);
    });
  });

  test("createInitProgress", () => {
    const enrollDomain = new EnrollDomain({
      courseId: 0,
      userId: 0,
    });

    const chapters = [
      { time: 0, title: "" },
      { time: 1, title: "" },
      { time: 2, title: "" },
    ];

    enrollDomain.createInitProgress(chapters);

    const chapterProgress = enrollDomain["chapterProgress"];

    chapterProgress.forEach(({ time }, index) => {
      expect(time).toEqual(chapters[index].time);
    });
  });
});
