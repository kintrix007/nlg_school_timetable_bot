import * as Utilz from "../classes/utilz";
import * as types from "../classes/types";
import { MessageEmbed } from "discord.js";

const PREFS_FILE = "prefixes.json";
const MAX_PREFIX_LENGTH = 4;

const description = "Átállítja a *prefix*et, amit a bot használ.\n" +
    "Az alapértelmezett a `!`, álállítás után azzal fognak működni a parancsok.\n" +
    "Alternatív módon, a bot pingelésével is használhatóak a parancsok.";

const cmd: types.Command = {
    func: cmdPrefix,
    commandName: "prefix",
    adminCommand: true,
    usage: "prefix [új prefix]",
    description: description,
    examples: [ "", "!!", "." ],
    aliases: [ "elotag", "hivoszo" ]
};

export interface PrefixData {
    [guildID: string]: string;
}

function cmdPrefix({ data, msg, args }: types.CombinedData) {
    const newPrefix = args[0];

    if (!newPrefix) {
        const currentPrefix = Utilz.getPrefix(data, msg.guild!);
        const embed = new MessageEmbed()
            .setColor(0x00bb00)
            .setDescription(`Jelenleg a(z) \`${currentPrefix ?? data.defaultPrefix}\` van kiválasztva mint prefix.`);
        msg.channel.send(embed);
        return;
    }

    if (newPrefix.length > MAX_PREFIX_LENGTH) {
        const embed = new MessageEmbed()
            .setColor(0xbb0000)
            .setDescription(`A *prefix* hossza ne legyen nagyobb, mint \`${MAX_PREFIX_LENGTH}\`! \`"${newPrefix}"(${newPrefix.length})\``);
        msg.channel.send(embed);
        return;
    }

    const prefixes: PrefixData = Utilz.loadPrefs(PREFS_FILE);
    prefixes[msg.guild!.id] = newPrefix;
    Utilz.savePrefs(PREFS_FILE, prefixes);

    const currentPrefix = Utilz.getPrefix(data, msg.guild!);

    const embed = new MessageEmbed()
        .setColor(0x00bb00)
        .setTitle(`Mostantól \`${currentPrefix}\` a prefix!`)
        .setDescription(`A prefix sikeresen átállítva.\nsegítségért: \`${currentPrefix}help\``);
    msg.channel.send(embed);
    console.log(`${msg.author.username}#${msg.author.discriminator} changed the prefix to ${currentPrefix}`);
}

module.exports = cmd;
