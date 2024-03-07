import { CourseDomain } from "../../domain/course.domain";
import { CourseChapter } from "../../schema/schema";

describe("course domain", () => {
  describe.only("updateChaptersByDescription", () => {
    test.only("valid chapter", async () => {
      const courseDomain = new CourseDomain({
        description:
          "Data Structures and Algorithms is an important aspect of every coding interview. This Algorithms and Data Structures course will teach you everything you need to prepare for placements, coding interviews, and logic building. The course walks you through multiple Java algorithms, data structure problems, and their solutions with step-by-step visualizations, so that you are actually learning instead of blindly memorizing solutions.💻 Code: https://github.com/dinesh-varyani/ds-algos✏️ Course developed by @itsdineshvaryani ⭐️ Contents ⭐️00:00:00 Introduction\n00:03:46 Introduction to Data Structures\n00:03:46 Introduction to Data Structures\n00:08:49 Introduction to Algorithms\n00:19:43 Time Complexity of an Algorithm\n00:25:05 Space Complexity of an Algorithm",
      } as any);
      courseDomain.updateChaptersByDescription();
      const chapters = courseDomain["chapters"];

      console.log(chapters);
      chapters.forEach((v) => expect(v).toEqual(chapterSchemaExpect));
      expect(chapters.length).toEqual(5);
    });
    test("not matches chapter", async () => {
      const courseDomain = new CourseDomain({
        description:
          "The AWS Cloud Project Bootcamp is a training program to equip you with the skills to design, build, and implement a cloud project.\n\n⚠️ If you are having issues playing this, try watching here: You can also watch here: https://www.youtube.com/playlist?list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv\n\nhttps://aws.cloudprojectbootcamp.com\n\nDeveloped by Andrew Brown.",
      } as any);
      courseDomain.updateChaptersByDescription();
      const chapters = courseDomain["chapters"];
      expect(chapters.length).toEqual(0);
    });
    test("chapter order error", async () => {
      const courseDomain = new CourseDomain({
        description:
          "The AWS Cloud Project Bootcamp is a training program to equip you with the skills to design, build, and implement a cloud project.\n\n⚠️ If you are having issues playing this, try watching here: You can also watch here: https://www.youtube.com/playlist?list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv\n\nhttps://aws.cloudprojectbootcamp.com\n\nDeveloped by Andrew Brown.\n\n00:00 Intro\n07:10 Welcome to the FREE AWS Cloud Project Bootcamp\n10:05 Create a GitHub Account\n13:46 Set Up MFA on your GitHub Account\n15:01 Create a Gitpod Account\n17:56 How Do I get the Gitpod Button\n21:56 Setup GitHub Codespaces\n23:16 Create AWS Account\n33:08 Creating Repository from the Github Template\n34:54 Create Lucidchart Account\n37:38 Create Honeycomb.io Account\n39:56 Create Rollbar Account\n41:08 Wk 0 Billing & Architecture\n2:40:32 Wk 0 Generate Credentials, AWS CLI, Budget & Billing Alarm via CLI\n4:03:37 Wk 0 Pricing Basics & Free tier\n07:12 Welcome to the FREE AWS Cloud Project Bootcamp",
      } as any);
      courseDomain.updateChaptersByDescription();
      const chapters = courseDomain["chapters"];
      expect(chapters.length).toEqual(0);
    });
    test("insert Intro", async () => {
      const courseDomain = new CourseDomain({
        description:
          "The AWS Cloud Project Bootcamp is a training program to equip you with the skills to design, build, and implement a cloud project.\n\n⚠️ If you are having issues playing this, try watching here: You can also watch here: https://www.youtube.com/playlist?list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv\n\nhttps://aws.cloudprojectbootcamp.com\n\nDeveloped by Andrew Brown.\n07:10 Welcome to the FREE AWS Cloud Project Bootcamp\n10:05 Create a GitHub Account\n13:46 Set Up MFA on your GitHub Account\n15:01 Create a Gitpod Account\n17:56 How Do I get the Gitpod Button\n21:56 Setup GitHub Codespaces\n23:16 Create AWS Account\n33:08 Creating Repository from the Github Template\n34:54 Create Lucidchart Account\n37:38 Create Honeycomb.io Account\n39:56 Create Rollbar Account\n41:08 Wk 0 Billing & Architecture\n2:40:32 Wk 0 Generate Credentials, AWS CLI, Budget & Billing Alarm via CLI\n4:03:37 Wk 0 Pricing Basics & Free tier",
      } as any);
      courseDomain.updateChaptersByDescription();
      const chapters = courseDomain["chapters"];

      expect(chapters[0]).toMatchObject({
        time: 0,
        title: "Intro",
      });
    });
  });
  describe("getIsValid", () => {
    test("min valid duration minutes", async () => {
      const courseDomain = new CourseDomain({
        description:
          "07:10 Welcome to the FREE AWS Cloud Project Bootcamp\n10:05 Create a GitHub Account",
        duration: 60 * 29,
      } as any);
      courseDomain.updateChaptersByDescription();
      const isValid = courseDomain.getIsValid();
      expect(isValid).toEqual(false);
    });
    test("min valid chapter count", async () => {
      const courseDomain = new CourseDomain({
        description: "",
        duration: 60 * 30,
      } as any);
      courseDomain.updateChaptersByDescription();
      const isValid = courseDomain.getIsValid();
      expect(isValid).toEqual(false);
    });
  });
});

const chapterSchemaExpect = expect.objectContaining<CourseChapter>({
  time: expect.any(Number),
  title: expect.any(String),
});
