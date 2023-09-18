import { Client } from "discord.js";
import fs from "fs";

export default class LoadEvents {
    private extract(module: any) {
        if (module.default) return module.default;
        else return module;
    }

    public async load(client: Client, eventsPath: string) {
        if (eventsPath === ".") return;

        const folders = fs.readdirSync(eventsPath);

        for (const folder of folders) {
            const files = fs.readdirSync(`${eventsPath}/${folder}`).filter((x) =>
                x.endsWith(".js") || x.endsWith(".cjs") || x.endsWith(".mjs") || x.endsWith(".ts")
            );

            for (const file of files) {
                const modulePath = `${eventsPath}/${folder}/${file}`;
                const event = this.extract(await import(modulePath));

                if (!event || !("name" in event) || !("run" in event)) {
                    throw new Error(`Event at ${modulePath} does not export a required "name" or "run" function.`);
                }

                if (event.once) {
                    client.once(event.name, (...args) => event.run(...args));
                } else {
                    client.on(event.name, (...args) => event.run(...args));
                }
            }
        }
    }
}