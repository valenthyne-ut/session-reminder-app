import { yellow } from "chalk";
import { TextChannel } from "discord.js";
import { SessionReminder, SessionStarting } from "../userinterface/Reminders/Embeds";
import { formatUnwrappedError, unwrapError } from "../util/Errors";
import { ServerReminderConfig, Session, Unit } from "./Database/Models";
import { ExtendedClient } from "./ExtendedClient";
import { Logger } from "./Logger";

const POLLING_INTERVAL = 1000 * 30;

export class SessionPoller {
	private client: ExtendedClient;
	private logger: Logger;

	public serverSessionMap: Map<string, Array<Session>>; 

	constructor(client: ExtendedClient) {
		this.client = client;
		this.logger = new Logger("SessionPoller");
		this.serverSessionMap = new Map();

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
		for(const serverId of this.serverSessionMap.keys()) {
			await this.sendReminders(serverId);
		}
	}

	public updateMap(sessions: Array<Session>) {
		const newMap: typeof this.serverSessionMap = new Map();

		for(const session of sessions) {
			const { serverId: server_id } = session;
			const serverSessions = newMap.get(server_id);
	
			if(serverSessions) {
				serverSessions.push(session);
				newMap.set(server_id, serverSessions);
			} else {
				newMap.set(server_id, [session]);
			}
		}

		this.serverSessionMap = newMap;
	}

	public async sendReminders(serverId: string) {
		const serverConfigs = await ServerReminderConfig.findAll();
		const serverConfig = serverConfigs.find(info => info.serverId == serverId);;
		if(!serverConfig) { return; }

		const sessions = this.serverSessionMap.get(serverId);
		if(!sessions || sessions.length === 0) { return; }

		const units = await Unit.findAll({ where: { serverId: serverId } });
		let selectedUnit: { name: string, length: number } | undefined; 

		if(!units || units.length === 0) {
			selectedUnit = { name: "second", length: 1 };
		} else {
			const randomUnit = units[Math.floor(Math.random() * units.length)];
			selectedUnit = { name: randomUnit.name, length: randomUnit.length };
		}

		const curTime = new Date().getTime() / 1000;
		const sessionsInTimeFrame = sessions.filter(session => session.dateTime.getTime() / 1000 - curTime < 28800);

		const server = this.client.guilds.cache.get(serverConfig.serverId);
		if(!server) { return; }

		const reminderChannel = server.channels.cache.get(serverConfig.channelId) as TextChannel | undefined;
		if(!reminderChannel) { return; }

		for(const session of sessionsInTimeFrame) {
			const { dateTime, reminderStage } = session;
			const sessionDateTime = dateTime.getTime() / 1000;
			const timeDifference = sessionDateTime - curTime;
			try {
				switch(reminderStage) {
				case 0: {
					await reminderChannel.send({ 
						content: `<@&${serverConfig.roleId}>`,
						embeds: [ SessionReminder(0, selectedUnit, timeDifference, sessionDateTime) ] 
					});
					await session.update({ reminderStage: 1 });
					break; }
				case 1: {
					if(timeDifference < 600) {
						await reminderChannel.send({ 
							content: `<@&${serverConfig.roleId}>`,
							embeds: [ SessionReminder(1, selectedUnit, timeDifference, sessionDateTime) ] 
						});
						await session.update({ reminderStage: 2 });
						
						setTimeout(() => {
							void (async () => {
								await session.destroy();
								await reminderChannel.send({ 
									content: `<@&${serverConfig.roleId}>`, 
									embeds: [ SessionStarting() ] 
								});
							})();
						}, timeDifference * 1000);
					}
					break; }
				}
			} catch(error) {
				this.logger.error(`Failed to update reminder at stage ${yellow(reminderStage)}.`);
				this.logger.error(formatUnwrappedError(unwrapError(error)));
			}
		}
	}
}