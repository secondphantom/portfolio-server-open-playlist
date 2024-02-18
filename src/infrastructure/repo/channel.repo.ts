import * as schema from "../../schema/schema";
import { IChannelRepo } from "../../application/interfaces/channel.repo";
import {
  ChannelEntitySelect,
  RepoCreateChannelDto,
} from "../../domain/channel.domain";
import { DrizzleClient } from "../db/drizzle.client";

export class ChannelRepo implements IChannelRepo {
  static instance: ChannelRepo | undefined;
  static getInstance = (drizzleClient: DrizzleClient) => {
    if (this.instance) return this.instance;
    this.instance = new ChannelRepo(drizzleClient);
    return this.instance;
  };

  private db: ReturnType<typeof this.drizzleClient.getDb>;
  constructor(private drizzleClient: DrizzleClient) {
    this.db = drizzleClient.getDb();
  }

  getChannelByChannelId = async <T extends keyof ChannelEntitySelect = any>(
    channelId: string,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof ChannelEntitySelect]?: boolean }
  ) => {
    const channel = await this.db.query.channels.findFirst({
      where: (channel, { eq }) => {
        return eq(channel.channelId, channelId);
      },
      columns: columns
        ? (columns as { [key in keyof ChannelEntitySelect]: boolean })
        : undefined,
    });
    return channel;
  };

  createChannel = async (channel: RepoCreateChannelDto) => {
    await this.db.insert(schema.channels).values(channel);
  };
}
