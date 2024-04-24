import * as schema from "../../schema/schema";
import { IChannelRepo } from "../../application/interfaces/channel.repo";
import {
  ChannelEntitySelect,
  RepoCreateChannelDto,
} from "../../domain/channel.domain";
import { Db, DrizzleClient } from "../db/drizzle.client";

export class ChannelRepo implements IChannelRepo {
  static instance: ChannelRepo | undefined;
  static getInstance = (drizzleClient: DrizzleClient) => {
    if (this.instance) return this.instance;
    this.instance = new ChannelRepo(drizzleClient);
    return this.instance;
  };

  constructor(private drizzleClient: DrizzleClient) {}

  getByChannelId = async <T extends keyof ChannelEntitySelect = any>(
    channelId: string,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof ChannelEntitySelect]?: boolean }
  ) => {
    const { db, client } = await this.drizzleClient.getDb();
    const channel = await db.query.channels.findFirst({
      where: (channel, { eq }) => {
        return eq(channel.channelId, channelId);
      },
      columns: columns
        ? (columns as { [key in keyof ChannelEntitySelect]: boolean })
        : undefined,
    });
    await this.drizzleClient.endDb(client);
    return channel;
  };

  create = async (channel: RepoCreateChannelDto) => {
    const { db, client } = await this.drizzleClient.getDb();
    await db.insert(schema.channels).values(channel);
    await this.drizzleClient.endDb(client);
  };
}
