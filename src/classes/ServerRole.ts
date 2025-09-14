import type { OverrideField, Role as APIRole } from "revolt-api";

import type { Client } from "../Client.ts";

import type { Server } from "./Server.ts";

/**
 * Server Role
 */
export class ServerRole {
  protected client: Client;
  protected serverId: string;

  readonly id: string;
  readonly name: string;
  readonly permissions: OverrideField;
  readonly colour?: string;
  readonly hoist: boolean;
  readonly rank: number;

  /**
   * Construct server role
   * @param client Client
   * @param serverId Server ID
   * @param id Role ID
   * @param data Role data
   */
  constructor(client: Client, serverId: string, id: string, data: APIRole) {
    this.client = client;
    this.serverId = serverId;

    this.id = id;
    this.name = data.name;
    this.permissions = data.permissions;
    this.colour = data.colour ?? undefined;
    this.hoist = data.hoist || false;
    this.rank = data.rank ?? 0;
  }

  /**
   * Write to string as a role mention
   * @returns Formatted String
   */
  toString(): string {
    return `<%${this.id}>`;
  }

  /**
   * Server attached to this role
   */
  get server(): Server | undefined {
    return this.client.servers.get(this.serverId);
  }

  /**
   * Whether this role is assigned to our server member
   */
  get assigned(): boolean {
    return this.server?.member?.roles.includes(this.id) || false;
  }

  /**
   * Delete this role
   */
  delete(): Promise<void> {
    return this.server!.deleteRole(this.id);
  }
}
