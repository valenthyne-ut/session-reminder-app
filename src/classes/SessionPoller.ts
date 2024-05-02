import { TextChannel } from "discord.js";
import { GuildReminderChannel, Session } from "./Database/Models";
import { ExtendedClient } from "./ExtendedClient";

const POLLING_INTERVAL = 1000 * 30;

export class SessionPoller {
	private client: ExtendedClient;
	public sessionServerMap: Map<string, Array<Session>>; 

	constructor(client: ExtendedClient) {
		this.client = client;
		this.sessionServerMap = new Map();

		void this.poll();
		setInterval(() => {
			void (async () => {
				await this.poll();
			})();
		}, POLLING_INTERVAL);
	}

	public async poll() {
		const sessions = await Session.findAll();
		if(sessions.length == 0) { return; };

		this.updateMap(sessions);
		
		const guildReminderChannels = await GuildReminderChannel.findAll();

		for(const serverId of this.sessionServerMap.keys()) {
			const guildReminderChannel = guildReminderChannels.find(channel => channel.server_id === serverId);

			const sessions = this.sessionServerMap.get(serverId);
			if(!sessions || sessions.length == 0) { continue; }
			if(!guildReminderChannel) { continue; }

			const earliestTime = Math.min(...sessions.map(session => session.date_time.getTime())) / 1000;
			if((earliestTime - new Date().getTime() / 1000) < 86400) {
				const nextSession = sessions.find(session => session.date_time.getTime() / 1000 == earliestTime)!;
				if(!nextSession.reminder_sent) {
					const guild = this.client.guilds.cache.get(guildReminderChannel.server_id);
					if(!guild) { continue; }

					const reminderChannel = guild.channels.cache.get(guildReminderChannel.channel_id) as TextChannel | undefined;
					if(!reminderChannel) { continue; }

					await reminderChannel.send(`Next session is <t:${earliestTime}:R>.`);
					await nextSession.update({ reminder_sent: true });
				}
			}			
		}
	}

	public updateMap(sessions: Array<Session>) {
		const newMap: typeof this.sessionServerMap = new Map();

		for(const session of sessions) {
			const { server_id } = session;
			const serverSessions = newMap.get(server_id);
	
			if(serverSessions) {
				serverSessions.push(session);
				newMap.set(server_id, serverSessions);
			} else {
				newMap.set(server_id, [session]);
			}
		}

		this.sessionServerMap = newMap;
	}
}