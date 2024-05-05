import { ChannelType, SlashCommandSubcommandBuilder } from "discord.js";
import { GuildChatInputCommandInteraction } from "../../types/ExtendedTypes";
import { ServerReminderConfig } from "../../classes/Database/Models";
import { SetConfigError, SetConfigSuccess } from "../../userinterface/Reminders/Embeds";

export const data = new SlashCommandSubcommandBuilder()
	.setName("set-config")
	.setDescription("Set the configuration for this guild's reminders.")
	.addChannelOption(option =>
		option
			.setName("channel")
			.setDescription("The channel to send reminders to.")
			.setRequired(true)
			.addChannelTypes(ChannelType.GuildText))
	.addRoleOption(option =>
		option
			.setName("role")
			.setDescription("The role to notify when a reminder is sent.")
			.setRequired(true));

export async function execute(interaction: GuildChatInputCommandInteraction) {
	await interaction.deferReply({ ephemeral: true });

	const channel = interaction.options.getChannel("channel", true, [ ChannelType.GuildText ]);
	const role = interaction.options.getRole("role", true);
	
	try {
		let config = await ServerReminderConfig.findOne({ where: { serverId: interaction.guildId } });

		if(config) {
			await config.update({
				channelId: channel.id,
				roleId: role.id
			});
		} else {
			config = await ServerReminderConfig.create({
				serverId: interaction.guildId,
				channelId: channel.id,
				roleId: role.id
			});
		}

		await interaction.editReply({ embeds: [ SetConfigSuccess(config.channelId, config.roleId) ] });
	} catch(error) { 
		await interaction.editReply({ embeds: [ SetConfigError() ] });
	}
}