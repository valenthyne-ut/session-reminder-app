import { ChatInputCommandInteraction } from "discord.js";

export type GuildChatInputCommandInteraction = ChatInputCommandInteraction & { guildId: string };