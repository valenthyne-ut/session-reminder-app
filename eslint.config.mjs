// @ts-check
import eslint from "@eslint/js";
import tslint from "typescript-eslint";
import globals from "globals";

export default tslint.config(
	eslint.configs.recommended,
	...tslint.configs.recommendedTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname,
			},
			globals: {
				...globals.es2021,
				...globals.node
			}
		}
	},
	{
		rules: {
			"indent": [
				"error",
				"tab"
			],
			"linebreak-style": [
				"error",
				"unix"
			],
			"quotes": [
				"warn",
				"double"
			],
			"semi": [
				"error",
				"always"
			]
		}
	},
	{
		files: [ "**/*.js", "**/*.mjs" ],
		extends: [ tslint.configs.disableTypeChecked ]
	}
);