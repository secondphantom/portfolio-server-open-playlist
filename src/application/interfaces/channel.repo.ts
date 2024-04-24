import {
  ChannelEntitySelect,
  RepoCreateChannelDto,
} from "../../domain/channel.domain";

export interface IChannelRepo {
  getByChannelId: <T extends keyof ChannelEntitySelect>(
    channelId: string,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof ChannelEntitySelect]?: boolean }
  ) => Promise<Pick<ChannelEntitySelect, T> | undefined>;

  create: (channel: RepoCreateChannelDto) => Promise<void>;
}
