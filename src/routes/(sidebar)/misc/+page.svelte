<script lang="ts">
	import MetaTag from '../../utils/MetaTag.svelte';
	import { onMount } from 'svelte';

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
			serverAbout = await response.json();
		} catch (err) {
			error = `Failed to fetch server info: ${err.message}`;
		} finally {
			isLoading = false;
		}
	};

	onMount(fetchServerInfo);
</script>

<div class="mx-auto max-w-2xl space-y-6 p-4"></div>

<div>
	<About />
</div>

<MetaTag {description} {title} />
