import { Client, Collection } from "discord.js";
import { EventEmitter } from "events";

import HandlerOptions from "../structures/HandlerOptions";

import EventManager from "../managers/EventManager";
import CommandManager from "../managers/CommandManager";

export default class Handler extends EventEmitter {
    private client: Client;
    private options?: HandlerOptions;

    private eventManager: EventManager;
    private commandManager: CommandManager;

    public constructor(client: Client, options?: HandlerOptions) {
        super();

        this.eventManager = new EventManager();
        this.commandManager = new CommandManager();

        if (!client) {
            throw new Error("Parameter client is missing.");
        };

        this.client = client;
        this.options = options;

        if (options?.eventsPath) {
            this.eventManager.load(this.client, this.options?.eventsPath ?? "__NoDirectory__");
        };

        if (options?.commandsPath) {
            this.commandManager.loadGlobal(this.client, this.options?.commandsPath);
            this.commandManager.handle(this.client, this);
        };
    };

    get commands() {
        return this.commandManager._commands;
    }
};