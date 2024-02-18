import { channels } from "../schema/schema";

export type ChannelEntitySelect = typeof channels.$inferSelect;
export type ChannelEntityInsert = typeof channels.$inferInsert;

export type RepoCreateChannelDto = Pick<
  Required<ChannelEntityInsert>,
  "channelId" | "name" | "handle" | "enrollCount"
>;

export class ChannelDomain {
  private channelId: string;
  private name: string;
  private handle: string;
  private enrollCount: number;
  private createdAt: Date | undefined;
  private updatedAt: Date | undefined;

  constructor({
    channelId,
    name,
    handle,
    enrollCount,
    createdAt,
    updatedAt,
  }: ChannelEntityInsert) {
    this.channelId = channelId;
    this.name = name;
    this.handle = handle ? handle : "";
    this.enrollCount = enrollCount ? enrollCount : 0;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  getCreateChannelDto = () => {
    return {
      channelId: this.channelId,
      name: this.name,
      handle: this.handle,
      enrollCount: this.enrollCount,
    };
  };
}
