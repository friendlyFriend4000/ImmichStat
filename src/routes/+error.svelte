<script lang="ts">
	import '../app.pcss';
	import { page } from '$app/stores';
	import NotFound from './utils/pages/NotFound.svelte';
	import Maintenance from './utils/pages/Maintenance.svelte';
	import ServerError from './utils/pages/ServerError.svelte';

	const pages = {
		// 400: Maintenance,
		404: NotFound,
		500: ServerError
	} as const;

	type ErrorCode = keyof typeof pages;

	const status = +$page.status;
	const index = Object.keys(pages)
		.map((x) => +x)
		.reduce((p, c) => (p < status ? c : p)) as ErrorCode;
	const component = pages[index];

	import MetaTag from './utils/MetaTag.svelte';

	const path: string = `/errors/${index}`;
	const description: string = `${index} desc`;
	const title: string = `Error ${index}`;
	const subtitle: string = `${index} subtitle`;
</script>

<MetaTag {path} {description} {title} />

<svelte:component this={component} />
