<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';

	export let description: string = '';
	export let title: string = '';
</script>

<MetaTags
	{title}
	{description}
	openGraph={{
		type: 'website',
		title: `${title}`,
		description: `${description}`,
		images: [],
		siteName: 'ImmichStat'
	}}
/>
