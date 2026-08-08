import type { SessionInfo as APISession } from "stoat-api";

import type { Hydrate } from "./index.js";

export type HydratedSession = {
  id: string;
  name: string;
};

export const sessionHydration: Hydrate<APISession, HydratedSession> = {
  functions: {
    _id: (server) => ["id", server._id],
    name: (server) => ["name", server.name],
  },
  postHydration: () => ({}),
};
