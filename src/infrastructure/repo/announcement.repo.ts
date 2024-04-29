import { and, asc, desc, eq, gt, gte, lt, lte, sql } from "drizzle-orm";

import * as schema from "../../schema/schema";
import {
  AnnouncementEntityInsert,
  AnnouncementEntitySelect,
  IAnnouncementRepo,
  QueryAnnouncement,
  QueryAnnouncementListDto,
  SimpleAnnouncementListDto,
} from "../../application/interfaces/announcement.repo";
import { DrizzleClient } from "../db/drizzle.client";
import { AdminEntitySelect } from "../../application/interfaces/admins.repo";

export class AnnouncementRepo implements IAnnouncementRepo {
  static instance: AnnouncementRepo | undefined;
  static getInstance = (drizzleClient: DrizzleClient) => {
    if (this.instance) return this.instance;
    this.instance = new AnnouncementRepo(drizzleClient);
    return this.instance;
  };

  constructor(private drizzleClient: DrizzleClient) {}

  create = async (dto: AnnouncementEntityInsert) => {
    await this.drizzleClient.using((db) =>
      db.insert(schema.announcements).values(dto)
    );
  };

  getListByQuery = async ({
    order,
    page,
    pageSize,
    search,
    isDisplayedOn,
    displayStartDate,
    displayEndDate,
  }: QueryAnnouncementListDto) => {
    const orderBy = ((order: string) => {
      switch (order) {
        case "recent":
          return [desc(schema.announcements.createdAt)];
        case "old":
          return [asc(schema.announcements.createdAt)];
        default:
          return [];
      }
    })(order);

    if (search) {
      const announcements = await this.drizzleClient.using((db) =>
        db
          .select({
            id: sql`"Announcements"."id"`,
            title: sql`"Announcements"."title"`,
            createdAt: sql`"Announcements"."created_at"`,
            isDisplayedOn: sql`"Announcements"."is_displayed_on"`,
            admin: sql`"announcements_admin"."data" as "admin"`,
          })
          .from(
            sql`
					"Announcements" 
				left join lateral 
					(select json_build_object('profileName',"announcements_admin"."profile_name",'id', "announcements_admin"."id") as "data" 
					from (select * from "Admins" "announcements_admin" 
					where "announcements_admin"."id" = "Announcements"."admin_id" limit 1) "announcements_admin") "announcements_admin" on true` as any
          )
          .where(
            and(
              ...[
                isDisplayedOn
                  ? eq(schema.announcements.isDisplayedOn, isDisplayedOn)
                  : undefined,
                displayStartDate
                  ? lte(schema.announcements.displayStartDate, displayStartDate)
                  : undefined,
                displayEndDate
                  ? gt(schema.announcements.displayEndDate, displayEndDate)
                  : undefined,
                search
                  ? sql`title_tsvector @@ plainto_tsquery('simple',lower(${search}))`
                  : undefined,
              ].filter((v) => !!v)
            )
          )
          .limit(pageSize)
          .offset((page - 1) * pageSize)
          .orderBy(...orderBy)
          .then((v) =>
            v.map((v) => ({
              ...v,
              id: parseInt(v.id as any),
              createdAt: new Date(v.createdAt as any),
            }))
          )
      );

      return announcements as any as QueryAnnouncement[];
    }

    const announcements = await this.drizzleClient.using((db) =>
      db.query.announcements.findMany({
        columns: {
          id: true,
          title: true,
          createdAt: true,
          isDisplayedOn: true,
        },
        where: (value, { eq, and, gt, lte }) => {
          return and(
            ...[
              isDisplayedOn
                ? eq(value.isDisplayedOn, isDisplayedOn)
                : undefined,
              displayStartDate
                ? lte(value.displayStartDate, displayStartDate)
                : undefined,
              displayEndDate
                ? gt(value.displayEndDate, displayEndDate)
                : undefined,
            ].filter((v) => !!v)
          );
        },
        orderBy: orderBy,
        offset: (page - 1) * pageSize,
        limit: pageSize,
        with: {
          admin: {
            columns: {
              id: true,
              profileName: true,
            },
          },
        },
      })
    );

    return announcements as any;
  };

  getById = async <T extends keyof AnnouncementEntitySelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof AnnouncementEntitySelect]?: boolean }
  ) => {
    const announcement = this.drizzleClient.using((db) =>
      db.query.announcements.findFirst({
        where: (value, { eq }) => {
          return eq(value.id, id);
        },
        columns: columns
          ? (columns as { [key in keyof AnnouncementEntitySelect]: boolean })
          : undefined,
      })
    );
    return announcement;
  };

  getByIdWith = async <
    T extends keyof AnnouncementEntitySelect,
    W1 extends keyof AdminEntitySelect
  >(
    id: number,
    columns?: {
      announcement?:
        | {
            [key in T]?: boolean;
          }
        | { [key in keyof AnnouncementEntitySelect]?: boolean };
      admin?:
        | {
            [key in W1]?: boolean;
          }
        | { [key in keyof AdminEntitySelect]?: boolean };
    }
  ) => {
    const announcement = this.drizzleClient.using((db) =>
      db.query.announcements.findFirst({
        where: (value, { eq }) => {
          return eq(value.id, id);
        },
        columns: columns?.announcement,
        with: {
          admin: columns?.admin
            ? {
                columns: columns?.admin,
              }
            : undefined,
        },
      })
    );
    return announcement as any;
  };

  deleteById = async (id: number) => {
    await this.drizzleClient.using((db) =>
      db.delete(schema.announcements).where(eq(schema.announcements.id, id))
    );
  };

  getListBySimple = async <T extends keyof AnnouncementEntitySelect>(
    {
      order,
      limit,
      isDisplayedOn,
      displayStartDate,
      displayEndDate,
    }: SimpleAnnouncementListDto,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof AnnouncementEntitySelect]?: boolean }
  ) => {
    const orderBy = ((order: string) => {
      switch (order) {
        case "recent":
          return [desc(schema.announcements.createdAt)];
        case "old":
          return [asc(schema.announcements.createdAt)];
        default:
          return [];
      }
    })(order);
    const announcements = await this.drizzleClient.using((db) =>
      db.query.announcements.findMany({
        columns: columns
          ? (columns as { [key in keyof AnnouncementEntitySelect]: boolean })
          : undefined,
        where: (value, { eq, and, gt, lte }) => {
          return and(
            ...[
              isDisplayedOn
                ? eq(value.isDisplayedOn, isDisplayedOn)
                : undefined,
              displayStartDate
                ? lte(value.displayStartDate, displayStartDate)
                : undefined,
              displayEndDate
                ? gt(value.displayEndDate, displayEndDate)
                : undefined,
            ].filter((v) => !!v)
          );
        },
        orderBy: orderBy,
        limit: limit,
      })
    );
    return announcements;
  };
}
