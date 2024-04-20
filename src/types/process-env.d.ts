export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			[key: string]: string | undefined;
			TOKEN: string;
			COMMANDS_PATH: string | undefined;
			EVENTS_PATH: string | undefined;
		}
	}
}