<script lang="ts">
  import { onMount } from 'svelte';
  import { Card } from 'flowbite-svelte';

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
    serverAbout = await response.json(); // Assign directly
  } catch (err) {
    error = `Failed to fetch server info: ${err.message}`;
  } finally {
    isLoading = false;
  }
};

  onMount(fetchServerInfo);
</script>

<div class="max-w-2xl mx-auto p-4 space-y-2">
<style>
  a {
    color: #3b82f6;
  }
  a:hover {
    color: #4F46E5; /* Indigo color, change as needed */
  }
</style>

  {#if isLoading}
    <Card>
      <h1>Loading...</h1>
    </Card>
  {:else if error}
    <Card>
      <p class="text-red-500">{error}</p>
    </Card>
  {:else if serverAbout != null}
    <Card>
      <h1>Build: {serverAbout.build}</h1>
    </Card>
    <Card>
      <a href="{serverAbout.buildImageUrl}">Build Image URL</a>
    </Card>
    <Card>
      <a href="{serverAbout.buildUrl}">Build URL</a>
    </Card>
    <Card>
      <h1>FFmpeg: {serverAbout.ffmpeg}</h1>
    </Card>
    <Card>
      <h1>Libvips: {serverAbout.libvips}</h1>
    </Card>
    <Card>
      <h1>Licensed: {serverAbout.licensed ? 'Yes' : 'No'}</h1>
    </Card>
    <Card>
      <h1>Node.js: {serverAbout.nodejs}</h1>
    </Card>
    <Card>
      <h1>Repository: {serverAbout.repository}</h1>
    </Card>
    <Card>
      <h1>Source Commit: {serverAbout.sourceCommit}</h1>
    </Card>
    <Card>
      <a href="{serverAbout.sourceUrl}">Source URL</a>
    </Card>
  {/if}
</div>
