import type { Emoji as APIEmoji, EmojiParent } from "stoat-api";

import type { Hydrate } from "./index.js";

export type HydratedEmoji = {
  id: string;
  parent: EmojiParent;
  creatorId: string;
  name: string;
  animated: boolean;
  nsfw: boolean;
};

export const emojiHydration: Hydrate<APIEmoji, HydratedEmoji> = {
  functions: {
    _id: (emoji) => ["id", emoji._id],
    parent: (emoji) => ["parent", emoji.parent],
    creator_id: (emoji) => ["creatorId", emoji.creator_id],
    name: (emoji) => ["name", emoji.name],
    animated: (emoji) => ["animated", emoji.animated || false],
    nsfw: (emoji) => ["nsfw", emoji.nsfw || false],
  },
  postHydration: () => ({}),
};
