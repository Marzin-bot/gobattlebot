const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const {restrict_text} = require("../utils.js");
const {dungeon_list} = require("../dungeon_list.json");

const dungeon_command = new SlashCommandBuilder();
dungeon_command.setName("dungeon");
dungeon_command.setDescription("Command relating to dungeons and other maps in the game.");
dungeon_command.addSubcommand((subcommand) => {
    subcommand.setName("info");
	subcommand.setDescription("Obtain the characteristics of a dungeon.");
    subcommand.addNumberOption((option) => {
        option.setName("dungeon_id");
        option.setDescription("The dungeon identifier.");
        option.setMinValue(1);
        option.setRequired(true);

        return option;
    });

    return subcommand;
});
dungeon_command.addSubcommand((subcommand) => {
    subcommand.setName("list");
	subcommand.setDescription("Get the list of all dungeons in the game with their respective ID.");

    return subcommand;
});

async function get_dungeon(interaction, client){
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand){
        case "info":
            await get_info(interaction, client);
            break;
        case "list":
            await get_list(interaction, client);
            break;
        default:
            await interaction.reply(`Invalid subcommand.\nContact ${client.application.owner} to resolve this issue.`);
    }
}

async function get_info(interaction, client){
    await interaction.reply("This subcommand is in development and cannot be used at this time.");
}

async function get_list(interaction, client){
    await interaction.deferReply();

    const embed = new EmbedBuilder();
    embed.setTitle("🏰 Dungeon List 🏰");

    let description = "Note that this list is not updated in real time like other lists. This is a pre-list awaiting the GoBattle.io API update.\n";

    embed.setDescription(description, {split: false});

    for (const dungeon_data of dungeon_list){
        description += `* ${restrict_text(dungeon_data.name || "*Unknow?*", 45)}#${dungeon_data.id}: \`${dungeon_data.min_level || "Unknow?"} 💪\`\n`;
    }

    embed.setDescription(description, {split: false});

    embed.addFields(
        {name: "> 🔢 __Number of dungeons__", value: `> ${dungeon_list.length}`, inline: true},
        {name: "> __Min level__", value: "> 💪", inline: true}
    );

    embed.setTimestamp();

    await interaction.editReply({
        embeds: [embed], 
    });
}

exports.get_dungeon = get_dungeon;
exports.dungeon_command = dungeon_command;
