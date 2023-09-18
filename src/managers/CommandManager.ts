import { ContextMenuCommandBuilder, SlashCommandBuilder, Collection, Client } from "discord.js";

import Handler from "../handler/Handler";
import RocketCommand from "../structures/RocketCommand";

import fs from "fs";

export default class CommandManager {
    private commands: Collection<string, RocketCommand | any> = new Collection();

    private extract(module: any) {
        if (module.default) return module.default;
        else return module;
    }

    public async loadGlobal(client: Client, commandsPath?: string) {
        if (commandsPath === "." || !commandsPath) return;

        const folders = fs.readdirSync(commandsPath);

        for (const folder of folders) {
            const files = fs.readdirSync(`${commandsPath}/${folder}`).filter((x) =>
                x.endsWith(".js") || x.endsWith(".cjs") || x.endsWith(".mjs") || x.endsWith(".ts")
            );

            for (const file of files) {
                const modulePath = `${commandsPath}/${folder}/${file}`;
                const commandModule = this.extract(await import(modulePath));

                if (!commandModule || (!("data" in commandModule) || !("run" in commandModule))) {
                    throw new Error(`Command at ${modulePath} does not export a required "data" or "run" function.`);
                }

                const data = (commandModule.data instanceof SlashCommandBuilder || commandModule.data instanceof ContextMenuCommandBuilder)
                    ? commandModule.data.toJSON()
                    : commandModule.data;

                try {
                    this.commands.set(data.name, { module: commandModule, category: folder });
                } catch (error) {
                    throw error;
                };
            };
        };

        client.application?.commands?.set([...this.commands.values()]).catch(() => {
            throw new Error("Failed setting client.application.commands");
        });

        return this.commands;
    };

    public handle(client: Client, handler: Handler) {
        client.on("interactionCreate", (interaction) => {
            if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
                const { module: command } = this.commands?.get(interaction.commandName);

                try {
                    command.run(interaction);
                    handler.emit("commandRan", command);
                } catch (error) {
                    handler.emit("error", error);
                    throw error;
                };
            };
        });
    };

    get _commands() {
        return this.commands;
    };
};