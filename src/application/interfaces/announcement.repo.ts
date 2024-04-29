import { announcements } from "../../schema/schema";
import { AdminEntitySelect } from "./admins.repo";

export type AnnouncementEntitySelect = typeof announcements.$inferSelect;
export type AnnouncementEntityInsert = typeof announcements.$inferInsert;

export type QueryAnnouncementListDto = {
  order: "recent" | "old";
  page: number;
  pageSize: number;
  search?: string;
  isDisplayedOn?: boolean;
  displayStartDate?: Date;
  displayEndDate?: Date;
};

export type SimpleAnnouncementListDto = {
  order: "recent" | "old";
  limit: number;
  isDisplayedOn?: boolean;
  displayStartDate?: Date;
  displayEndDate?: Date;
};

export type QueryAnnouncement = Pick<
  AnnouncementEntitySelect,
  "id" | "title" | "createdAt" | "isDisplayedOn"
> &
  Pick<AdminEntitySelect, "profileName" | "id">;

export interface IAnnouncementRepo {
  create: (dto: AnnouncementEntityInsert) => Promise<void>;
  getListByQuery: (
    query: QueryAnnouncementListDto
  ) => Promise<AnnouncementEntitySelect[]>;
  getById: <T extends keyof AnnouncementEntitySelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof AnnouncementEntitySelect]?: boolean }
  ) => Promise<Pick<AnnouncementEntitySelect, T> | undefined>;
  getByIdWith: <
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
  ) => Promise<
    | (Pick<AnnouncementEntitySelect, T> & {
        admin: Pick<AdminEntitySelect, W1>;
      })
    | undefined
  >;
  deleteById: (id: number) => Promise<void>;
  getListBySimple: <T extends keyof AnnouncementEntitySelect>(
    query: SimpleAnnouncementListDto,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof AnnouncementEntitySelect]?: boolean }
  ) => Promise<Pick<AnnouncementEntitySelect, T>[]>;
}
