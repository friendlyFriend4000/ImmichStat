<script lang="ts">
import { Card } from 'flowbite-svelte';

export let loadingBool: boolean;
export let error:string;
export let isUrl = false;
export let aboutItem
export let aboutSubitem

</script>




<Card>
	{#if loadingBool}
		<h1>Loading...</h1>
	{:else if error}
		<p class="text-red-500">{error}</p>
		{#if isUrl}
			{#if aboutItem != null}
				<a href="{aboutItem.aboutSubitem}">build URL</a>
			{/if}
		{:else}
			{#if aboutItem != null}
				<h1>build: {aboutItem.aboutSubitem}</h1>
			{/if}
		{/if}
	{/if}
</Card>