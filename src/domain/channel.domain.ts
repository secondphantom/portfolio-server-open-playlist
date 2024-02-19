import { ChannelExtra, channels } from "../schema/schema";

export type ChannelEntitySelect = typeof channels.$inferSelect;
export type ChannelEntityInsert = typeof channels.$inferInsert;

export type RepoCreateChannelDto = Pick<
  Required<ChannelEntityInsert>,
  "channelId" | "name" | "handle" | "enrollCount" | "extra"
>;

export class ChannelDomain {
  private channelId: string;
  private name: string;
  private handle: string;
  private enrollCount: number;
  private extra: ChannelExtra;
  private createdAt: Date | undefined;
  private updatedAt: Date | undefined;

  constructor({
    channelId,
    name,
    handle,
    enrollCount,
    extra,
    createdAt,
    updatedAt,
  }: Omit<ChannelEntityInsert, "extra"> &
    Partial<Pick<ChannelEntityInsert, "extra">>) {
    this.channelId = channelId;
    this.name = name;
    this.handle = handle ? handle : "";
    this.extra = extra ? extra : {};
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
      extra: this.extra,
    };
  };
}
