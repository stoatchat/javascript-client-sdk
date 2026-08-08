import { ReactiveSet } from "@solid-primitives/set";
import type { ChannelUnread } from "stoat-api";

import type { Hydrate } from "./index.js";

export type HydratedChannelUnread = {
  id: string;
  lastMessageId?: string;
  messageMentionIds: ReactiveSet<string>;
};

export const channelUnreadHydration: Hydrate<
  ChannelUnread,
  HydratedChannelUnread
> = {
  functions: {
    _id: (unread) => ["id", unread._id.channel],
    last_id: (unread) => ["lastMessageId", unread.last_id!],
    mentions: (unread) => [
      "messageMentionIds",
      new ReactiveSet(unread.mentions!),
    ],
  },
  initialHydration: () => ({
    messageMentionIds: new ReactiveSet(),
  }),
};
