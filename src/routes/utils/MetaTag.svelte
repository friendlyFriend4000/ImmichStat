<script lang="ts">
  import { MetaTags } from 'svelte-meta-tags';

  export let path: string = '';
  export let description: string = '';
  export let title: string = '';
  export let subtitle: string = '';

</script>

<MetaTags
{title}
{description}
openGraph={{
  type: 'website',
  title: `${title}`,
  description: `${description}`,
  images: [

  ],
  siteName: 'ImmichStat',
}}

/>
