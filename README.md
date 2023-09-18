# rocket-djs

## About
rocket-djs is a Discord.js bot handler designed to simplify handling both slash commands and events.

## Installation
Using npm
```shell
npm install rocket-djs
```
Using Yarn
```shell
yarn add rocket-djs
```
Using pnpm
```shell
pnpm add rocket-djs
```


## Examples
```js
// CommonJS
const { Handler } = require("rocket-djs");
const { Client } = require("discord.js");
const path = require("path");

// ESM and TypeScript
import { Handler } from "rocket-djs";
import { Client } from "discord.js";
import path from "path";

const client = new Client(); // add your client options

new Rocket(client, {
    // The path library is recommended to ensure no importing issues.
    
    eventsPath: path.join(__dirname, "events"),
    commandsPath: path.join(__dirname, "commands"),
});

// Replace TOKEN with your bot's token.
client.login(TOKEN)
```

### Example Command
```js
// commands/Misc/ping.js

// export or export default for ESM
// module.exports for CommonJS

// Using SlashCommandBuilder or ContextMenuCommandBuilder
export const data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!");

// Or with JSON:
export const data = {
    name: "ping",
    description: "Replies with Pong!",
    // read more below:
    // https://discord.com/developers/docs/interactions/application-commands#app-mount
};

// The main run function.
export function run(interaction) {
    interaction.reply("Pong!!!");
};
```

### Example Event
```js
// export for ESM
// module.exports for CommonJS

// You can also use export default if you prefer.
export const name = "ready"; // The event name - client.on(name)
export function run(client) {
    // The main run function.
    // Arguments in run are the same as doing client.on(name, ...args)
    console.log(`Logged in as ${client.user.tag}!`);
};
```