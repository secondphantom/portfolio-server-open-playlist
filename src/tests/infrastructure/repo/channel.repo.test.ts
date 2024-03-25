import dotenv from "dotenv";
dotenv.config();

import { DrizzleClient } from "../../../infrastructure/db/drizzle.client";
import { IChannelRepo } from "../../../application/interfaces/channel.repo";
import { ChannelRepo } from "../../../infrastructure/repo/channel.repo";
import { RepoCreateChannelDto } from "../../../domain/channel.domain";

describe.skip("channel repo", () => {
  let channelRepo: IChannelRepo;

  beforeAll(() => {
    const dbClient = new DrizzleClient({
      DATABASE_URL_RAILWAY_POSTGRES:
        process.env["DATABASE_URL_RAILWAY_POSTGRES"]!,
      LOG_LEVEL: "verbose",
    });
    channelRepo = new ChannelRepo(dbClient);
  });

  test("create channel", async () => {
    const createChannelDto = {
      channelId: "channelId",
      name: "channelTitle",
      handle: "",
      enrollCount: 0,
      extra: {},
    } satisfies RepoCreateChannelDto;

    await channelRepo.createChannel(createChannelDto);

    const channel = await channelRepo.getChannelByChannelId(
      createChannelDto.channelId,
      {
        channelId: true,
        name: true,
        handle: true,
        enrollCount: true,
      }
    );

    for (const [key, value] of Object.entries(channel!)) {
      expect(value).toEqual(
        createChannelDto[key as any as keyof typeof channel]
      );
    }
  });
});
