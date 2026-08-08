import type { Member as APIMember, MemberCompositeKey } from "stoat-api";

import type { Client } from "../Client.js";
import { File } from "../classes/File.js";

import type { Hydrate } from "./index.js";

export type HydratedServerMember = {
  id: MemberCompositeKey;
  joinedAt: Date;
  nickname?: string;
  avatar?: File;
  pronouns?: string;
  roles: string[];
  timeout?: Date;
};

export const serverMemberHydration: Hydrate<
  Omit<APIMember, "can_publish" | "can_receive">,
  HydratedServerMember
> = {
  functions: {
    _id: (member) => ["id", member._id],
    joined_at: (member) => ["joinedAt", new Date(member.joined_at)],
    nickname: (member) => ["nickname", member.nickname!],
    avatar: (member, ctx) => [
      "avatar",
      new File(ctx as Client, member.avatar!),
    ],
    pronouns: (member) => ["pronouns", member.pronouns!],
    roles: (member) => ["roles", member.roles],
    timeout: (member) => ["timeout", new Date(member.timeout!)],
  },
  initialHydration: () => ({
    roles: [],
  }),
};
