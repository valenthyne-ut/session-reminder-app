export class ItemsPerPageLimitError extends Error {
	constructor() {
		super("itemsPerPage may not be higher than 25.");
	}
}