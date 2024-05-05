export class ItemsPerPageZeroOrNegativeError extends Error {
	constructor() {
		super("itemsPerPage may not be 0 or a negative number.");
	}
}