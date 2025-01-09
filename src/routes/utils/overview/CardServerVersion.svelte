<script lang="ts">
	import { Badge, Card, Indicator } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let localServerImmichVersion: string;
	let githubReleaseTag: string;
	let fetchError: string | null = null;

	onMount(async () => {
		try {
			const serverResponse = await fetch('/api/server/version');
			const serverData = await serverResponse.json();
			localServerImmichVersion = `${serverData.major}.${serverData.minor}.${serverData.patch}`;
		} catch (error) {
			console.error('Error fetching local version:', error);
			fetchError = 'Failed to fetch local version';
		}
		// TODO ADD WITH SERVER ABOUT APII THE URL TO THE CURRENT VERSION SO THE USER CAN BROWSE AND CHECK FOR BREAKING CHANGES
		try {
			const githubResponse = await fetch(
				'https://api.github.com/repos/immich-app/immich/releases/latest'
			);
			const githubData = await githubResponse.json();
			githubReleaseTag = githubData.tag_name.replace(/v/g, '');
		} catch (error) {
			console.error('Error fetching GitHub version:', error);
			fetchError = 'Failed to fetch GitHub version';
		}
	});

	$: isUpdateAvailable = () => {
		if (!localServerImmichVersion || !githubReleaseTag) return false;
		console.log('Checking versions:', {
			local: localServerImmichVersion,
			github: githubReleaseTag
		});
		return localServerImmichVersion !== githubReleaseTag;
	};
</script>

<Card horizontal class="items-center justify-between" size="xl">
	<div class="w-full">
		<p>Immich Version</p>
		<p class="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
			{#if fetchError}
				{fetchError}
			{:else if localServerImmichVersion}
				{localServerImmichVersion}
			{:else}
				Loading...
			{/if}
		</p>
	</div>
	{#if isUpdateAvailable()}
		<Badge
			color="green"
			rounded
			class="w-60 px-2.5 py-0.5"
			href="https://github.com/immich-app/immich/releases"
		>
			<Indicator color="green" size="sm" class="me-1" />
			<p>Update Available</p>
		</Badge>
	{:else if localServerImmichVersion && githubReleaseTag}
		<Badge color="dark" rounded class="w-60 px-2.5 py-0.5">
			<p>Up to date</p>
		</Badge>
	{/if}
</Card>
