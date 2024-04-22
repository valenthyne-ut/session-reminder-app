import chalk, { ChalkFunction } from "chalk";

enum Prefixes {
	INFO = "INFO",
	WARNING = "WARNING",
	ERROR = "ERROR",
	FATAL = "FATAL"
}

export class Logger {
	private caller: string;

	private static maxPrefixLength: number = (() => {
		let longestPrefixLength = 0;

		(Object.entries(Prefixes)).forEach(prefix => {
			const prefixString = prefix[0];
			if(prefixString.length > longestPrefixLength) { longestPrefixLength = prefixString.length; }
		});

		return longestPrefixLength;
	})();

	constructor(caller?: string) {
		this.caller = caller || "unknown";
	}

	private template(templateColor: ChalkFunction, prefix: string, ...text: unknown[]): string {
		const curDateTime = new Date().toISOString().replace(/[TZ]/g, " ").trimEnd();

		return [
			chalk.bgBlack(curDateTime),
			templateColor(prefix.padStart(Logger.maxPrefixLength, " ")),
			`- [ ${chalk.cyanBright(this.caller.padStart(20))} ] -`,
			text.join(" ")
		].join(" ");
	}

	info(...text: unknown[]) {
		console.log(this.template(chalk.green, Prefixes.INFO, ...text));
	}

	warning(...text: unknown[]) {
		console.log(this.template(chalk.yellow, Prefixes.WARNING, ...text));
	}

	error(...text: unknown[]) {
		console.log(this.template(chalk.red, Prefixes.ERROR, ...text));
	}

	fatal(...text: unknown[]) {
		console.log(this.template(chalk.red, Prefixes.FATAL, ...text));
	}
}

export const logger = new Logger("Client");