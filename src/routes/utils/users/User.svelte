<script lang="ts">
	import { Toggle, Card } from 'flowbite-svelte';
	import { userSettings } from '$lib/stores';
	import MetaTag from '../../utils/MetaTag.svelte';
	import { onMount } from 'svelte';

	// Simplified toggle function using store update
	const toggleSetting = (key: keyof typeof $userSettings) => {
		userSettings.update((settings) => ({
			...settings,
			[key]: !settings[key]
		}));
	};

	const description: string = 'extensive tracking of your Immich instance';
	const title: string = 'Users';

	export let username: string = 'username';

	interface ServerInfo {}

	let serverInfo: ServerInfo | null = null;
	let error: string | null = null;

	const fetchServerInfo = async () => {
		try {
			const response = await fetch('/api/users');
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			serverInfo = data;
			console.log(serverInfo);
		} catch (err) {
			error = `Failed to fetch server info: ${err.message}`;
			console.error(error);
		}
	};
	onMount(fetchServerInfo);
</script>

<div>
	<Card>
		<h3>{username}</h3>
	</Card>
</div>

<MetaTag {description} {title} />
