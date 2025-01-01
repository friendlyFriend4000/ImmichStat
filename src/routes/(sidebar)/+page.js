import * as dashboard from './overview/+page';

/** @type {import('./overview/$types').PageLoad} */
export function load(request) {
	return dashboard.load(request);
}
