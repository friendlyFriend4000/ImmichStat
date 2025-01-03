<script lang="ts">
	import { onMount } from 'svelte';
  import { Card } from 'flowbite-svelte';
	import AboutCard from './AboutCard.svelte';


	interface ServerAbout {
		build: string;
		buildImage: string;
		buildImageUrl: string;
		buildUrl: string;
		exiftool: string;
		ffmpeg: string;
		imagemagick: string;
		libvips: string;
		licensed: boolean;
		nodejs: string;
		repository: string;
		repositoryUrl: string;
		sourceCommit: string;
		sourceRef: string;
		sourceUrl: string;
		thirdPartyBugFeatureUrl: string;
		thirdPartyDocumentationUrl: string;
		thirdPartySourceUrl: string;
		thirdPartySupportUrl: string;
		version: string;
		versionUrl: string;
	}

	let serverAbout: ServerAbout | null = null;
	let error: string | null = null;
	let isLoading = true;

	const fetchServerInfo = async () => {
		try {
			const response = await fetch('/api/server/about');
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data: ServerAbout = await response.json();
			serverAbout = data;
		} catch (err) {
			error = `Failed to fetch server info: ${err.message}`;
		} finally {
			isLoading = false;
		}
	};

	onMount(fetchServerInfo);
</script>

<div class="max-w-2xl mx-auto p-4 space-y-2">
<!--TODO immichstat icon is affected by this color change-->

	<style>
	a{
		color: #3b82f6;
	}
  a:hover {
    color: #4F46E5; /* Indigo color, change as needed */
  }
</style>

<!--	BUILDNUMBER-->
<Card>
	{#if isLoading}
		<h1>Loading...</h1>
	{:else if error}
		<p class="text-red-500">{error}</p>
	{:else if serverAbout != null}
		<h1>build: {serverAbout.build}</h1>
	{/if}
</Card>

<!--BUILD IMAGE URL-->
	<Card>
	{#if isLoading}
		<h1>Loading...</h1>
	{:else if error}
		<p class="text-red-500">{error}</p>
	{:else if serverAbout != null}
		<a href="{serverAbout.buildImageUrl }">build Image Url</a>
	{/if}
</Card>

		<Card>
	{#if isLoading}
		<h1>Loading...</h1>
	{:else if error}
		<p class="text-red-500">{error}</p>
	{:else if serverAbout != null}
		<a href="{serverAbout.buildUrl}"> buildUrl</a>
	{/if}
</Card>

<Card>
	{#if isLoading}
		<h1>Loading...</h1>
	{:else if error}
		<p class="text-red-500">{error}</p>
	{:else if serverAbout != null}
		<h1>ffmpeg: {serverAbout.ffmpeg }</h1>
	{/if}
</Card>

	<Card>
	{#if isLoading}
		<h1>Loading...</h1>
	{:else if error}
		<p class="text-red-500">{error}</p>
	{:else if serverAbout != null}
		<h1>libvips: {serverAbout.libvips  }</h1>
	{/if}
</Card>


		<Card>
	{#if isLoading}
		<h1>Loading...</h1>
	{:else if error}
		<p class="text-red-500">{error}</p>
	{:else if serverAbout != null}
		<h1>licensed: {serverAbout.licensed   }</h1>
	{/if}
</Card>

		<Card>
	{#if isLoading}
		<h1>Loading...</h1>
	{:else if error}
		<p class="text-red-500">{error}</p>
	{:else if serverAbout != null}
		<h1>nodejs: {serverAbout.nodejs   }</h1>
	{/if}
</Card>

		<Card>
	{#if isLoading}
		<h1>Loading...</h1>
	{:else if error}
		<p class="text-red-500">{error}</p>
	{:else if serverAbout != null}
		<h1>repository: {serverAbout.repository   }</h1>
	{/if}
</Card>

		<Card>
	{#if isLoading}
		<h1>Loading...</h1>
	{:else if error}
		<p class="text-red-500">{error}</p>
	{:else if serverAbout != null}
		<h1>sourceCommit: {serverAbout.sourceCommit   }</h1>
	{/if}
</Card>



		<Card>
	{#if isLoading}
		<h1>Loading...</h1>
	{:else if error}
		<p class="text-red-500">{error}</p>
	{:else if serverAbout != null}
		<a href="{serverAbout.sourceUrl  }">sourceUrl </a>
	{/if}
</Card>





</div>


