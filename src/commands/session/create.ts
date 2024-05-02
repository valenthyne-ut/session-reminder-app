import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import moment from "moment";
import { GuildReminderChannel, Session } from "../../classes/Database/Models";
import { logger } from "../../classes/Logger";
import { CreateCancel, CreateError, CreateInTimeframePrompt, CreatePastError, CreateSuccess, DateTimeFormatError } from "../../userinterface/Session/Embeds";
import { formatUnwrappedError, unwrapError } from "../../util/Errors";
import { DATETIME_DISPLAY_FORMAT, DATETIME_PARSE_FORMAT } from "../session";
import { confirmPrompt } from "../../userinterface/General/PromiseFunctions";

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
	await interaction.deferReply();
	if(!interaction.guildId) { return await interaction.editReply("Cannot execute this command outside of a server."); }

	const dateTime = interaction.options.getString("date-time", true);
	const utcOffset = interaction.options.getInteger("utc-offset", true);

	const utcTime = moment.utc(dateTime, DATETIME_PARSE_FORMAT, true).subtract(utcOffset, "hours");
	if(!utcTime.isValid()) { return await interaction.editReply({ embeds: [ DateTimeFormatError(dateTime) ] }); }

	const date = utcTime.toDate();
	if(date.getTime() < new Date().getTime()) { return await interaction.editReply({ embeds: [ CreatePastError() ] }); }

	try {
		const newSessionTime = utcTime.toDate().getTime() / 1000;

		const guildSessions = await Session.findAll({ where: { server_id: interaction.guildId } });
		const hasSessionInTimeframe = guildSessions.find(session => { 
			const sessionTime = session.date_time.getTime() / 1000;
			if(sessionTime + 7200 > newSessionTime && sessionTime - 7200 < newSessionTime) { return session; }
		}) !== undefined;

		const createSession = async () => {
			const session = await Session.create({
				server_id: interaction.guildId!,
				date_time: date
			});
	
			await interaction.editReply({ embeds: [
				CreateSuccess(session.id, newSessionTime, utcTime.format(DATETIME_DISPLAY_FORMAT))
			] });
		};

		if(hasSessionInTimeframe) {
			await interaction.editReply({ embeds: [ CreateInTimeframePrompt() ] });
			const result = await confirmPrompt(interaction);
			if(result) {
				await createSession();
			} else {
				await interaction.editReply({ embeds: [ CreateCancel() ] });
			}
		} else {
			await createSession();
		}
	} catch(error) {
		await interaction.editReply({ embeds: [ CreateError() ] });
		logger.error(formatUnwrappedError(unwrapError(error)));
	}

	await GuildReminderChannel.assignGuildReminderChannel(interaction.guildId, interaction.channelId);
}
	