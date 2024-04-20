export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			[key: string]: string | undefined;
			TOKEN: string;
			PUSH_COMMANDS: string;
		}
	}
}