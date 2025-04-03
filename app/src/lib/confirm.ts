import { writable } from 'svelte/store';

// externalized from 'Confirm.svelte' because eslint didn't like these functions to be in the same file.

export const alertTitle = writable('');
export const alertMessage = writable('');

export const open = writable(false);
export const options = writable<[string, boolean][]>([]);

export const result = writable<boolean | undefined>();

/**
 * Opens an alert dialog with a title and message.
 *
 * @param title
 * @param message
 * @param dialogOptions The buttons of the dialog. The format is [buttonText, isPositiveAction].
 */
export const fancyConfirm = (
	title: string,
	message: string,
	dialogOptions: [string, boolean][] = [
		['Cancel', false],
		['Continue', true],
	],
): Promise<boolean> =>
	new Promise<boolean>((resolve) => {
		alertTitle.set(title);
		alertMessage.set(message);
		open.set(true);
		options.set(dialogOptions);

		const unsub = result.subscribe((r) => {
			if (r !== undefined) {
				open.set(false);
				result.set(undefined);

				unsub();
				resolve(r);
			}
		});
	});

export const closeConfirmationDialog = (): void => {
	open.set(false);
};
