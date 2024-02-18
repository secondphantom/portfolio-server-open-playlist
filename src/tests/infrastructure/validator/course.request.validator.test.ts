import { CourseRequestValidator } from "../../../infrastructure/validator/course.request.validator";

describe("course request validator", () => {
  const validator = CourseRequestValidator.getInstance();

  test.each<{
    message: string;
    throwError: boolean;
    dto: any;
  }>([
    {
      message: "valid url",
      throwError: false,
      dto: {
        url: "https://www.youtube.com/watch?v=zA8guDqfv40&ab_channel=freeCodeCamp.org",
        videoId: "zA8guDqfv40",
      },
    },
    {
      message: "valid url",
      throwError: false,
      dto: {
        url: "https://youtu.be/zA8guDqfv40?si=LYwNDE4F14zIxtjn",
        videoId: "zA8guDqfv40",
      },
    },
    {
      message: "valid url",
      throwError: true,
      dto: {
        url: "https://www.youtube.com/",
      },
    },
    {
      message: "invalid short url",
      throwError: true,
      dto: {
        url: "https://www.youtube.com/shorts/QKKvMx_7gdA",
      },
    },
    {
      message: "invalid short url",
      throwError: true,
      dto: {
        url: "https://youtube.com/shorts/QKKvMx_7gdA?si=z2oprs-rDqn3oa9T",
      },
    },
    {
      message: "invalid channel url",
      throwError: true,
      dto: {
        url: "https://www.youtube.com/@freecodecamp",
      },
    },
    {
      message: "invalid channel url",
      throwError: true,
      dto: {
        url: "https://www.youtube.com/channel/UC8butISFwT-Wl7EV0hUK0BQ",
      },
    },
  ])("$message", async ({ dto, throwError }) => {
    if (throwError) {
      expect(() => {
        validator.createCourse(dto as any);
      }).toThrow();
      return;
    }
    const { videoId } = validator.createCourse(dto as any);
    expect(videoId).toEqual(dto.videoId);
    return;
  });
});
