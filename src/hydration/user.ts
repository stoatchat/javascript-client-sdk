import type {
  User as APIUser,
  BotInformation,
  RelationshipStatus,
  UserStatus,
} from "stoat-api";

import type { Client } from "../Client.js";
import { File } from "../classes/File.js";

import type { Hydrate } from "./index.js";

export type HydratedUser = {
  id: string;
  username: string;
  discriminator: string;
  displayName?: string;
  relationship: RelationshipStatus;
  relations: null;

  online: boolean;
  privileged: boolean;

  badges: UserBadges;
  flags: UserFlags;

  avatar?: File;
  pronouns?: string;
  status?: UserStatus;
  bot?: BotInformation;
};

export const userHydration: Hydrate<APIUser, HydratedUser> = {
  functions: {
    _id: (user) => ["id", user._id],
    username: (user) => ["username", user.username],
    discriminator: (user) => ["discriminator", user.discriminator],
    display_name: (user) => ["displayName", user.display_name!],
    relationship: (user) => ["relationship", user.relationship!],
    relations: () => ["relations", null],

    online: (user) => ["online", user.online!],
    privileged: (user) => ["privileged", user.privileged],

    badges: (user) => ["badges", user.badges!],
    flags: (user) => ["flags", user.flags!],

    avatar: (user, ctx) => ["avatar", new File(ctx as Client, user.avatar!)],
    pronouns: (user) => ["pronouns", user.pronouns],
    status: (user) => ["status", user.status!],
    bot: (user) => ["bot", user.bot!],
  },
  postHydration: () => ({
    relationship: "None",
  }),
};

/**
 * Badges available to users
 */
export enum UserBadges {
  Developer = 1,
  Translator = 2,
  Supporter = 4,
  ResponsibleDisclosure = 8,
  Founder = 16,
  PlatformModeration = 32,
  ActiveSupporter = 64,
  Paw = 128,
  EarlyAdopter = 256,
  ReservedRelevantJokeBadge1 = 512,
  ReservedRelevantJokeBadge2 = 1024,
}

/**
 * Flags attributed to users
 */
export enum UserFlags {
  Suspended = 1,
  Deleted = 2,
  Banned = 4,
}
