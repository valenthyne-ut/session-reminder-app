import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import moment from "moment";
import { DATETIME_DISPLAY_FORMAT, DATETIME_PARSE_FORMAT } from "../session";
import { CreateSuccess, DateTimeFormatError } from "../../classes/Errors/Commands/Session";
import { CreatePastError } from "../../classes/Errors/Commands/Session";
import { CreateError } from "../../classes/Errors/Commands/Session";
import { logger } from "../../classes/Logger";
import { formatUnwrappedError, unwrapError } from "../../util/Errors";
import { Session } from "../../classes/Database/Models";

export const data = new SlashCommandSubcommandBuilder()
	.setName("schedule")
	.setDescription("Schedule a new session.")
	.addStringOption(option =>
		option
			.setName("date-time")
			.setDescription("The date and time the session will start.")
			.setRequired(true))
	.addIntegerOption(option =>
		option
			.setName("utc-offset")
			.setDescription("Your current UTC offset. Range: (-12, 14)")
			.setRequired(true)
			.setMinValue(-12)
			.setMaxValue(14));

export async function execute(interaction: ChatInputCommandInteraction) {
	if(!interaction.guildId) { 	return await interaction.reply({ content: "Cannot execute this command outside of a server.", ephemeral: true }); }

	const dateTime = interaction.options.getString("date-time", true);
	const utcOffset = interaction.options.getInteger("utc-offset", true);

	const utcTime = moment.utc(dateTime, DATETIME_PARSE_FORMAT, true).subtract(utcOffset, "hours");
	if(!utcTime.isValid()) { return await interaction.reply({ embeds: [ DateTimeFormatError(dateTime) ] }); }

	const date = utcTime.toDate();
	if(date.getTime() < new Date().getTime()) { return await interaction.reply({ embeds: [ CreatePastError() ] }); }

	try {
		const session = await Session.create({
			server_id: interaction.guildId,
			date_time: date
		});

		await interaction.reply({ embeds: [
			CreateSuccess(session.id, utcTime.toDate().getTime() / 1000, utcTime.format(DATETIME_DISPLAY_FORMAT))
		] });
	} catch(error) {
		await interaction.reply({ embeds: [ CreateError() ] });
		logger.error(formatUnwrappedError(unwrapError(error)));
	}
}
	