import { ReactiveMap } from "@solid-primitives/map";
import { ReactiveSet } from "@solid-primitives/set";
import type {
  Server as APIServer,
  Category,
  SystemMessageChannels,
} from "stoat-api";

import type { Client } from "../Client.js";
import { File } from "../classes/File.js";
import { ServerRole } from "../classes/ServerRole.js";

import type { Hydrate } from "./index.js";

export type HydratedServer = {
  id: string;
  ownerId: string;

  name: string;
  description?: string;

  icon?: File;
  banner?: File;

  channelIds: ReactiveSet<string>;
  categories?: Category[];

  systemMessages?: SystemMessageChannels;
  roles: ReactiveMap<string, ServerRole>;
  defaultPermissions: bigint;

  flags: ServerFlags;
  analytics: boolean;
  discoverable: boolean;
  nsfw: boolean;
};

export const serverHydration: Hydrate<APIServer, HydratedServer> = {
  functions: {
    _id: (server) => ["id", server._id],
    owner: (server) => ["ownerId", server.owner],
    name: (server) => ["name", server.name],
    description: (server) => ["description", server.description!],
    channels: (server) => ["channelIds", new ReactiveSet(server.channels)],
    categories: (server) => ["categories", server.categories ?? []],
    system_messages: (server) => [
      "systemMessages",
      server.system_messages ?? {},
    ],
    roles: (server, ctx) => [
      "roles",
      new ReactiveMap(
        Object.keys(server.roles!).map((id) => [
          id,
          new ServerRole(ctx as Client, server._id, id, server.roles![id]),
        ]),
      ),
    ],
    default_permissions: (server) => [
      "defaultPermissions",
      BigInt(server.default_permissions),
    ],
    icon: (server, ctx) => ["icon", new File(ctx as Client, server.icon!)],
    banner: (server, ctx) => [
      "banner",
      new File(ctx as Client, server.banner!),
    ],
    flags: (server) => ["flags", server.flags!],
    analytics: (server) => ["analytics", server.analytics || false],
    discoverable: (server) => ["discoverable", server.discoverable || false],
    nsfw: (server) => ["nsfw", server.nsfw || false],
  },
  postInitialHydration: (hydrated) => {
    hydrated.channelIds ||= new ReactiveSet();
    hydrated.roles ||= new ReactiveMap();
  },
};

/**
 * Flags attributed to servers
 */
export enum ServerFlags {
  Official = 1,
  Verified = 2,
}
