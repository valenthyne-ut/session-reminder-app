import { GuildReminderChannel, Session } from "./Database/Models";

const POLLING_INTERVAL = 1000 * 30;

export class SessionPoller {
	public sessionServerMap: Map<string, Array<Session>>; 

	constructor() {
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

		await this.updateMap(sessions);
	}

	public async updateMap(sessions: Array<Session>) {
		const newMap: typeof this.sessionServerMap = new Map();
		const serverReminderChannels = await GuildReminderChannel.findAll();

		for(const session of sessions) {
			const { server_id } = session;
			const serverSessions = newMap.get(server_id);
			const hasReminderChannel = serverReminderChannels.find(channel => channel.server_id === server_id) !== undefined;
			
			if(hasReminderChannel) {
				if(serverSessions) {
					serverSessions.push(session);
					newMap.set(server_id, serverSessions);
				} else {
					newMap.set(server_id, [session]);
				}
			}
		}

		this.sessionServerMap = newMap;
	}
}