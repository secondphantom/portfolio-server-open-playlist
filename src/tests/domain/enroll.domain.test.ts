import { EnrollDomain } from "../../domain/enroll.domain";

describe("enroll domain", () => {
  describe("updateProgress", () => {
    test("undefined", () => {
      const enrollDomain = new EnrollDomain({
        courseId: 0,
        userId: 0,
        version: 1,
        videoId: "videoId",
      });

      const totalProgress = enrollDomain["totalProgress"];

      expect(totalProgress).toEqual(0);
    });
    test("length = 0", () => {
      const enrollDomain = new EnrollDomain({
        courseId: 0,
        userId: 0,
        chapterProgress: {},
        version: 1,
        videoId: "videoId",
      });

      const totalProgress = enrollDomain["totalProgress"];

      expect(totalProgress).toEqual(0);
    });
    test("existed", () => {
      const enrollDomain = new EnrollDomain({
        courseId: 0,
        userId: 0,
        chapterProgress: {
          "0": 1,
          "1": 1,
          "2": 0,
        },
        version: 1,
        videoId: "videoId",
      });

      const totalProgress = enrollDomain["totalProgress"];

      expect(totalProgress).toEqual(2 / 3);
    });
  });

  test("createInitProgress", () => {
    const enrollDomain = new EnrollDomain({
      courseId: 0,
      userId: 0,
      version: 1,
      videoId: "videoId",
    });

    const chapters = [
      { time: 0, title: "" },
      { time: 1, title: "" },
      { time: 2, title: "" },
    ];

    enrollDomain.createInitProgress(chapters);

    const chapterProgress = enrollDomain["chapterProgress"];

    Object.entries(chapterProgress).forEach(([time], index) => {
      expect(time).toEqual(chapters[index].time.toString());
    });
  });
});
