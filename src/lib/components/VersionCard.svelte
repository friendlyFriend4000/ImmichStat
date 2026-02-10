<script lang="ts">
	interface Version {
		major: number;
		minor: number;
		patch: number;
	}

	let {
		version,
		updateAvailable,
		availableVersion = null
	} = $props<{
		version: Version;
		updateAvailable: boolean;
		availableVersion?: string | null;
	}>();
</script>

<div class="flex items-center justify-between rounded-lg bg-white p-6 shadow dark:bg-gray-800">
	<div>
		<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Server Version</p>
		<p class="text-3xl font-bold text-gray-900 dark:text-white sm:text-3xl">
			{version.major}.{version.minor}.{version.patch}
		</p>
	</div>
	{#if updateAvailable}
		<a
			href="https://github.com/immich-app/immich/releases"
			target="_blank"
			rel="noopener noreferrer"
			class="flex flex-col items-center rounded bg-green-500 px-4 py-2 text-center font-bold text-white no-underline hover:bg-green-600"
		>
			<span class="text-xs font-normal">
				{availableVersion ? `v${availableVersion.replace(/^v/, '')}` : 'Update Available'}
			</span>
			<span class="text-xs font-normal">view changelog</span>
		</a>
	{:else}
		<span class="px-4 py-2 font-medium text-gray-500 dark:text-gray-400"> Up to date </span>
	{/if}
</div>
