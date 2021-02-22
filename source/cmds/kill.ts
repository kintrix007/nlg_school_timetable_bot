import * as Utilz from "../classes/utilz";
import * as types from "../classes/types";
import { MessageEmbed } from "discord.js";

const permanentArgs = ["perm", "permanent"];

const cmd: types.Command = {
    func: cmdKill,
    name: "kill",
    aliases: [ "shutdown" ],
    examples: [ "", ...permanentArgs ],
    group: "owner",
    ownerCommand: true
};

function cmdKill({ msg, args }: types.CombinedData) {
    const isPermanent = permanentArgs.includes(args[0]);
    
    const embed = new MessageEmbed()
        .setColor(0x00bb00)
        .setTitle(isPermanent ? "Shutting down... (shutdown)" : "Shutting down... (restart)");
    
    msg.channel.send(embed).then(sentMsg => {
        console.log("-- stopping bot... --");
        if (isPermanent) {
            process.exit(-1);
        } else {
            process.exit(0);
        }
    }).catch(console.error);
}

module.exports = cmd;
