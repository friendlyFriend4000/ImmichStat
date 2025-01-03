
<script lang="ts">
import { Toggle, Card } from 'flowbite-svelte';
import { userSettings } from '$lib/stores';
import MetaTag from '../../utils/MetaTag.svelte';
import { onMount } from 'svelte';
import User from '../../utils/users/User.svelte';

interface User {
  id: string;
  name: string;
}

const description: string = 'extensive tracking of your Immich instance';
const title: string = 'Users';
let users: User[] = [];
let error: string | null = null;
let isLoading = true;

const fetchServerInfo = async () => {
  try {
    const response = await fetch('/api/users');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    users = data;
  } catch (err) {
    error = `Failed to fetch server info: ${err.message}`;
  } finally {
    isLoading = false;
  }
};

onMount(fetchServerInfo);
</script>

<div class="max-w-2xl mx-auto p-4 space-y-6">
  <h1 class="text-3xl font-bold mb-6">Settings</h1>
	{#each users as user, i}
	<Card>
  {#if isLoading}
    <p>Loading...</p>
  {:else if error}
    <p class="text-red-500">{error}</p>
  {:else if users.length > 0}
    <p>{users[users.length - 1 - i].name}</p>

  {:else}
    <p>No users found</p>
  {/if}
	</Card>
		{/each}
</div>

<div>

</div>
<MetaTag {description} {title} />