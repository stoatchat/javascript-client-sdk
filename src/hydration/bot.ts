import type { Bot as APIBot } from "stoat-api";

import type { Hydrate } from "./index.js";

export type HydratedBot = {
  id: string;
  ownerId: string;
  token: string;
  public: boolean;
  analytics: boolean;
  discoverable: boolean;
  interactionsUrl?: string;
  termsOfServiceUrl?: string;
  privacyPolicyUrl?: string;
  flags: BotFlags;
};

export const botHydration: Hydrate<APIBot, HydratedBot> = {
  functions: {
    _id: (bot) => ["id", bot._id],
    owner: (bot) => ["ownerId", bot.owner],
    token: (bot) => ["token", bot.token],
    public: (bot) => ["public", bot.public],
    analytics: (bot) => ["analytics", bot.analytics!],
    discoverable: (bot) => ["discoverable", bot.discoverable!],
    interactions_url: (bot) => ["interactionsUrl", bot.interactions_url!],
    terms_of_service_url: (bot) => [
      "termsOfServiceUrl",
      bot.terms_of_service_url!,
    ],
    privacy_policy_url: (bot) => ["privacyPolicyUrl", bot.privacy_policy_url!],
    flags: (bot) => ["flags", bot.flags!],
  },
  initialHydration: () => ({}),
};

/**
 * Flags attributed to users
 */
export enum BotFlags {}
