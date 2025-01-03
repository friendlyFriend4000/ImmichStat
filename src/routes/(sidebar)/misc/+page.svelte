<script lang="ts">
	import MetaTag from '../../utils/MetaTag.svelte';
	import { onMount } from 'svelte';

  import { Toggle, Card } from 'flowbite-svelte';
	import About from '../../utils/misc/About.svelte';

	const description: string = 'extensive tracking of your Immich instance';
	const title: string = 'Misc.';

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
			console.log(serverAbout.licensed);
		} catch (err) {
			error = `Failed to fetch server info: ${err.message}`;
		} finally {
			isLoading = false;
		}
	};

	onMount(fetchServerInfo);
</script>

<div class="max-w-2xl mx-auto p-4 space-y-6">



</div>

<div>
	<About />
</div>


	<MetaTag {description} {title} />