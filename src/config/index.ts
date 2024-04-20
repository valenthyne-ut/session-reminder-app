import "dotenv/config";
import { MissingConfigPropertyError } from "../classes/Errors/Config";

function getEnvVariable(key: string, required: boolean = false): string | undefined {
	const value = process.env[key];
	if(required && value === undefined) { throw new MissingConfigPropertyError(key); }
	return value;
}

export default {
	TOKEN: getEnvVariable("TOKEN", true)
};