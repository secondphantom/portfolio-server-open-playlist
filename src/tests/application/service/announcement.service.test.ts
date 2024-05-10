import dotenv from "dotenv";
import {
  AnnouncementEntityInsert,
  IAnnouncementRepo,
} from "../../../application/interfaces/announcement.repo";
import { AnnouncementService } from "../../../application/service/announcement.service";
import { DrizzleClient } from "../../../infrastructure/db/drizzle.client";
import { AnnouncementRepo } from "../../../infrastructure/repo/announcement.repo";
dotenv.config();

describe.skip("announcement service", () => {
  let announcementRepo: IAnnouncementRepo;
  let announcementService: AnnouncementService;
  let TEST_ANNOUNCEMENTS = [
    {
      id: 100,
      adminId: 1,
      title: "test title id 100",
      content: "test content",
    },
    {
      id: 101,
      adminId: 1,
      title: "test title id 101",
      content: "test content",
      isDisplayedOn: true,
      displayStartDate: new Date("2024-04-25"),
    },
    {
      id: 102,
      adminId: 1,
      title: "d9ckhiekdh102f",
      content: "test content",
      isDisplayedOn: false,
    },
    {
      id: 103,
      adminId: 1,
      title: "displayedon",
      content: "test content",
      isDisplayedOn: true,
      displayStartDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      displayEndDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    },
  ] satisfies AnnouncementEntityInsert[];

  beforeAll(async () => {
    const dbClient = DrizzleClient.getInstance({
      DATABASE_URL: process.env.DATABASE_URL!,
      LOG_LEVEL: "dev",
    });
    announcementRepo = AnnouncementRepo.getInstance(dbClient);
    announcementService = AnnouncementService.getInstance({
      announcementRepo,
    });

    await Promise.all(
      TEST_ANNOUNCEMENTS.map((v) => {
        return new Promise(async (res, rej) => {
          await announcementRepo.deleteById(v.id).catch(rej);
          res(null);
        });
      })
    );
    await Promise.all(
      TEST_ANNOUNCEMENTS.map((v) => {
        return new Promise(async (res, rej) => {
          await announcementRepo.create(v).catch(rej);
          res(null);
        });
      })
    );
  });

  afterAll(async () => {
    // await Promise.all(
    //   TEST_ANNOUNCEMENTS.map((v) => {
    //     return new Promise(async (res, rej) => {
    //       await announcementRepo.deleteById(v.id).catch(rej);
    //       res(null);
    //     });
    //   })
    // );
  });

  describe("getAnnouncementById", () => {
    test("fail: not found", async () => {
      try {
        await announcementService.getAnnouncementById({
          id: -1,
        });
      } catch (error: any) {
        expect(error.message).toBe("Not Found");
      }
    });
    test("success", async () => {
      const announcement = await announcementService.getAnnouncementById({
        id: TEST_ANNOUNCEMENTS[0].id,
      });
      expect(announcement).toEqual(
        expect.objectContaining({
          id: announcementSchemaExpect.id,
          title: announcementSchemaExpect.title,
          content: announcementSchemaExpect.content,
          isDisplayedOn: announcementSchemaExpect.isDisplayedOn,
          displayStartDate: announcementSchemaExpect.displayStartDate,
          displayEndDate: announcementSchemaExpect.displayEndDate,
          createdAt: announcementSchemaExpect.createdAt,
          updatedAt: announcementSchemaExpect.updatedAt,
          admin: adminSchemaExpect,
        })
      );
    });
  });

  describe("getAnnouncementListByQuery", () => {
    test("success", async () => {
      const result = await announcementService.getAnnouncementListByQuery({});

      for (const announcement of result.announcements) {
        expect(announcement).toEqual(
          expect.objectContaining({
            id: announcementSchemaExpect.id,
            title: announcementSchemaExpect.title,
            createdAt: announcementSchemaExpect.createdAt,
            isDisplayedOn: announcementSchemaExpect.isDisplayedOn,
            admin: adminSchemaExpect,
          })
        );
      }
    });

    test("success: isDisplayOn true", async () => {
      const result = await announcementService.getAnnouncementListByQuery({
        isDisplayedOn: true,
      });

      for (const announcement of result.announcements) {
        expect(announcement).toEqual(
          expect.objectContaining({
            id: announcementSchemaExpect.id,
            title: announcementSchemaExpect.title,
            createdAt: announcementSchemaExpect.createdAt,
            isDisplayedOn: true,
            admin: adminSchemaExpect,
          })
        );
      }
    });

    test("success: search query", async () => {
      const result = await announcementService.getAnnouncementListByQuery({
        search: TEST_ANNOUNCEMENTS[2].title,
      });

      for (const announcement of result.announcements) {
        expect(announcement).toEqual(
          expect.objectContaining({
            id: announcementSchemaExpect.id,
            title: TEST_ANNOUNCEMENTS[2].title,
            createdAt: announcementSchemaExpect.createdAt,
            isDisplayedOn: announcementSchemaExpect.isDisplayedOn,
            admin: adminSchemaExpect,
          })
        );
      }
    });
  });

  describe("getAnnouncementIsDisplayedOn", () => {
    test("success", async () => {
      const announcement =
        await announcementService.getAnnouncementIsDisplayedOn();

      expect(announcement).toEqual(
        expect.objectContaining({
          id: TEST_ANNOUNCEMENTS[3].id,
          title: announcementSchemaExpect.title,
          createdAt: announcementSchemaExpect.createdAt,
          isDisplayedOn: true,
        })
      );
    });
  });
});

const announcementSchemaExpect = {
  id: expect.any(Number),
  adminId: expect.any(Number),
  title: expect.any(String),
  titleTsvector: expect.any(String),
  content: expect.any(String),
  isDisplayedOn: expect.any(Boolean),
  displayStartDate: expect.any(Date),
  displayEndDate: expect.any(Date),
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
};

const adminSchemaExpect = {
  id: expect.any(Number),
  profileName: expect.any(String),
};
