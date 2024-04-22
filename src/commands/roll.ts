import { AttachmentBuilder, ChatInputCommandInteraction, InteractionEditReplyOptions, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("roll")
	.setDescription("Roll x dice with y faces.")
	.addIntegerOption(option =>
		option
			.setName("dice")
			.setDescription("The number of dice to roll.")
			.setRequired(true)
			.setMinValue(1)
			.setMaxValue(10000))
	.addIntegerOption(option =>
		option
			.setName("faces")
			.setDescription("The number of faces each die has.")
			.setRequired(true)
			.setMinValue(1)
			.setMaxValue(256))
	.addBooleanOption(option =>
		option
			.setName("hide-roll")
			.setDescription("Whether to make the roll only visible to you.")
			.setRequired(false))
	.addIntegerOption(option =>
		option
			.setName("bonus")
			.setDescription("A bonus number to add to the result when it's calculated.")
			.setRequired(false)
			.setMinValue(1)
			.setMaxValue(Number.MAX_SAFE_INTEGER));

export const guilds = [];

const MESSAGE_CHARACTER_LIMIT = 2000;

function randomNumberFunction(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function execute(interaction: ChatInputCommandInteraction) {
	const rollEphemeral = interaction.options.getBoolean("hide-roll") || false;
	await interaction.deferReply({ ephemeral: rollEphemeral });

	const dice = interaction.options.getInteger("dice", true);
	const faces = interaction.options.getInteger("faces", true);
	const bonus = interaction.options.getInteger("bonus") || 0;

	const sumArray = [];

	for(let i = 0; i < dice; i++) {
		sumArray.push(randomNumberFunction(1, faces));
	}

	let sum = sumArray.reduce((accumulator, value) => accumulator += value);
	sum += bonus;

	const bonusString = bonus > 0 ? `+${bonus}` : "";
	let sumArrayString = sumArray.join("+");
	let sumString = `Result: ${sum} (${dice}d${faces}${bonusString})\n`;

	const payload: InteractionEditReplyOptions = {};

	if(sumArrayString.length + sumString.length < MESSAGE_CHARACTER_LIMIT) {
		sumString += sumArrayString;
	} else {
		sumString += "*Dice rolls have been provided in a file.*";
		sumArrayString = sumArrayString.replaceAll("+", "\n");
		const sumAttachment = new AttachmentBuilder(Buffer.from(sumArrayString, "utf-8")).setName("rolls.txt");
		payload.files = [ sumAttachment ];
	}

	payload.content = sumString;
	await interaction.editReply(payload);
}