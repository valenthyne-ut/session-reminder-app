export interface UnwrappedError {
	message: string;
	stack?: string;
}

export function unwrapError(error: unknown): UnwrappedError {
	const unwrappedError: UnwrappedError = {
		message: "Unknown error occurred."
	};

	if(error instanceof Error) {
		unwrappedError.message = error.message;
		unwrappedError.stack = error.stack;
	} else if(typeof error === "string") {
		unwrappedError.message = error;
	}

	return unwrappedError;
}

export function formatUnwrappedError(error: UnwrappedError, withStack: boolean = true): string {
	return error.message + (error.stack !== undefined && withStack ? `\n${error.stack}` : "");
}