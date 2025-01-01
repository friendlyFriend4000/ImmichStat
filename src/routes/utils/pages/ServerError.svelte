<script lang="ts">
    import { Button } from 'flowbite-svelte';

    export let title = '500 Internal error';
    export let btnTitle = 'Back to Overview';
    export let btnHref = '/';
    export let btnIssue = 'Report issue';
    export let btnIssueRef = 'https://github.com/friendlyFriend4000/ImmichStat/issues';
</script>

<main class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 pt-8 mx-auto min-h-screen">
        <div class="text-center max-w-4xl">
            <h1 class="mb-6 text-2xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
                {title}
            </h1>
            <div class="flex flex-col gap-4 items-center">
                <Button href={btnHref} class="w-full max-w-xs">
                    <svg
                        class="-ml-1 mr-2 h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                        />
                    </svg>
                    {btnTitle}
                </Button>

                <Button href={btnIssueRef} class="w-full max-w-xs">
                    {btnIssue}
                </Button>
            </div>
        </div>
    </div>
</main>