import { ReactiveSet } from "@solid-primitives/set";
import type { Channel as APIChannel } from "stoat-api";

import type { Client } from "../Client.js";
import { File } from "../classes/File.js";
import { Merge } from "../lib/merge.js";

import type { Hydrate } from "./index.js";

export type HydratedChannel = {
  id: string;
  channelType: APIChannel["channel_type"];

  name: string;
  description?: string;
  icon?: File;

  active: boolean;
  typingIds: ReactiveSet<string>;
  recipientIds: ReactiveSet<string>;

  userId?: string;
  ownerId?: string;
  serverId?: string;

  permissions?: bigint;
  defaultPermissions?: { a: bigint; d: bigint };
  rolePermissions?: Record<string, { a: bigint; d: bigint }>;
  nsfw: boolean;
  slowmode: number;

  lastMessageId?: string;

  voice?: { maxUsers?: number };
};

export const channelHydration: Hydrate<Merge<APIChannel>, HydratedChannel> = {
  functions: {
    _id: (channel) => ["id", channel._id],
    channel_type: (channel) => ["channelType", channel.channel_type],
    name: (channel) => ["name", channel.name],
    description: (channel) => ["description", channel.description!],
    icon: (channel, ctx) => ["icon", new File(ctx as Client, channel.icon!)],
    active: (channel) => ["active", channel.active || false],
    recipients: (channel) => [
      "recipientIds",
      new ReactiveSet(channel.recipients),
    ],
    user: (channel) => ["userId", channel.user],
    owner: (channel) => ["ownerId", channel.owner],
    server: (channel) => ["serverId", channel.server],
    permissions: (channel) => ["permissions", BigInt(channel.permissions!)],
    default_permissions: (channel) => [
      "defaultPermissions",
      {
        a: BigInt(channel.default_permissions?.a ?? 0),
        d: BigInt(channel.default_permissions?.d ?? 0),
      },
    ],
    role_permissions: (channel) => [
      "rolePermissions",
      Object.fromEntries(
        Object.entries(channel.role_permissions ?? {}).map(([k, v]) => [
          k,
          {
            a: BigInt(v.a),
            d: BigInt(v.d),
          },
        ]),
      ),
    ],
    nsfw: (channel) => ["nsfw", channel.nsfw || false],
    last_message_id: (channel) => ["lastMessageId", channel.last_message_id!],
    slowmode: (channel) => ["slowmode", channel.slowmode ?? 0],
    voice: (channel) => [
      "voice",
      !!channel.voice ||
      channel.channel_type === "DirectMessage" ||
      channel.channel_type === "Group"
        ? {
            maxUsers: channel.voice?.max_users || undefined,
          }
        : undefined,
    ],
  },
  postInitialHydration: (hydrated) => {
    hydrated.typingIds ||= new ReactiveSet();
    hydrated.recipientIds ||= new ReactiveSet();
  },
};
