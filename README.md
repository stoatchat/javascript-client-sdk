# revolt.js

![revolt.js](https://img.shields.io/npm/v/revolt.js)
![revolt-api](https://img.shields.io/npm/v/revolt-api?label=Revolt%20API)

**revolt.js** is a JavaScript library for interacting with the entire Revolt
API.

## Requirements

To use this module, you must be using at least:

- Node.js v22.19.0 (LTS) with ESM
- Deno v2.2 (LTS)

## Example Usage

```javascript
import { Client } from "revolt.js";

let client = new Client();

client.on(
  "ready",
  async () => console.info(`Logged in as ${client.user.username}!`),
);

client.on("messageCreate", async (message) => {
  if (message.content === "hello") {
    message.channel.sendMessage("world");
  }
});

client.loginBot("..");
```
