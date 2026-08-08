import type { Webhook } from "stoat-api";

import type { Client } from "../Client.js";
import { File } from "../classes/File.js";

import type { Hydrate } from "./index.js";

export type HydratedChannelWebhook = {
  id: string;
  name: string;
  avatar?: File;
  channelId: string;
  token: string;
};

export const channelWebhookHydration: Hydrate<
  Omit<Webhook, "creator_id" | "permissions">,
  HydratedChannelWebhook
> = {
  functions: {
    id: (webhook) => ["id", webhook.id],
    name: (webhook) => ["name", webhook.name],
    avatar: (webhook, ctx) => [
      "avatar",
      webhook.avatar ? new File(ctx as Client, webhook.avatar) : undefined,
    ],
    channel_id: (webhook) => ["channelId", webhook.channel_id],
    token: (webhook) => ["token", webhook.token!],
  },
  postHydration: () => ({}),
};
