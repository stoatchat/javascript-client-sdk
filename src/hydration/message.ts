import { ReactiveMap } from "@solid-primitives/map";
import { ReactiveSet } from "@solid-primitives/set";
import type { Interactions, Masquerade, Message } from "stoat-api";

import type { Client } from "../Client.js";
import { File } from "../classes/File.js";
import { MessageWebhook } from "../classes/Message.js";
import { MessageEmbed } from "../classes/MessageEmbed.js";
import { SystemMessage } from "../classes/SystemMessage.js";

import type { Hydrate } from "./index.js";

export type HydratedMessage = {
  id: string;
  nonce?: string;
  channelId: string;
  authorId?: string;
  webhook?: MessageWebhook;
  content?: string;
  systemMessage?: SystemMessage;
  attachments?: File[];
  editedAt?: Date;
  embeds?: MessageEmbed[];
  mentionIds?: string[];
  roleMentionIds?: string[];
  replyIds?: string[];
  reactions: ReactiveMap<string, ReactiveSet<string>>;
  interactions?: Interactions;
  masquerade?: Masquerade;
  pinned?: boolean;
  flags?: MessageFlags;
};

export const messageHydration: Hydrate<
  Omit<Message, "user" | "member">,
  HydratedMessage
> = {
  functions: {
    _id: (message) => ["id", message._id],
    nonce: (message) => ["nonce", message.nonce!],
    channel: (message) => ["channelId", message.channel],
    author: (message) => ["authorId", message.author],
    webhook: (message, ctx) => [
      "webhook",
      message.webhook
        ? new MessageWebhook(ctx as Client, message.webhook, message.author)
        : undefined,
    ],
    content: (message) => ["content", message.content!],
    system: (message, ctx) => [
      "systemMessage",
      SystemMessage.from(ctx as Client, message, message.system!),
    ],
    attachments: (message, ctx) => [
      "attachments",
      message.attachments!.map((file) => new File(ctx as Client, file)),
    ],
    edited: (message) => ["editedAt", new Date(message.edited!)],
    embeds: (message, ctx) => [
      "embeds",
      message.embeds!.map((embed) => MessageEmbed.from(ctx as Client, embed)),
    ],
    mentions: (message) => ["mentionIds", message.mentions!],
    role_mentions: (message) => ["roleMentionIds", message.role_mentions!],
    replies: (message) => ["replyIds", message.replies!],
    reactions: (message) => {
      const map = new ReactiveMap<string, ReactiveSet<string>>();
      if (message.reactions) {
        for (const reaction of Object.keys(message.reactions)) {
          map.set(reaction, new ReactiveSet(message.reactions![reaction]));
        }
      }
      return ["reactions", map];
    },
    interactions: (message) => ["interactions", message.interactions],
    masquerade: (message) => ["masquerade", message.masquerade!],
    pinned: (message) => ["pinned", message.pinned!],
    flags: (message) => ["flags", message.flags!],
  },
  postHydration: () => ({
    reactions: new ReactiveMap(),
  }),
};

/**
 * Flags attributed to messages
 */
export enum MessageFlags {
  /**
   * Message will not send push / desktop notifications
   */
  SuppressNotifications = 1,
  /**
   * Message will mention all users who can see the channel
   */
  MentionsEveryone = 2,
  /**
   * Message will mention all users who are online and can see the channel.
   * This cannot be true if MentionsEveryone is true
   */
  MentionsOnline = 3,
}
