import { ContextMenuCommandBuilder, SlashCommandBuilder } from "discord.js"

type RocketCommand = {
    data: SlashCommandBuilder | ContextMenuCommandBuilder | Object;
    run: Function,

    category?: String;
    options?: {
        dev: Boolean;
    }
}

export default RocketCommand;