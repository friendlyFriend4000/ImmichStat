<script lang="ts">
	import type { AboutResponseDto, ServerFeaturesResponseDto, ServerConfigResponseDto, ServerVersionHistoryResponseDto } from '@immich/sdk';

	export let aboutInfo: AboutResponseDto | null | undefined;
	export let serverFeatures: ServerFeaturesResponseDto | null | undefined;
	export let serverConfig: ServerConfigResponseDto | null | undefined;
	export let versionHistory: ServerVersionHistoryResponseDto[] | null | undefined;

	const fields = [
		{ key: 'version', label: 'Version' },
		{ key: 'build', label: 'Build' },
		{ key: 'buildImage', label: 'Build Image' },
		{ key: 'exiftool', label: 'ExifTool' },
		{ key: 'ffmpeg', label: 'FFmpeg' },
		{ key: 'imagemagick', label: 'ImageMagick' },
		{ key: 'libvips', label: 'libvips' },
		{ key: 'nodejs', label: 'Node.js' },
		{ key: 'repository', label: 'Repository' },
		{ key: 'sourceCommit', label: 'Commit' },
		{ key: 'sourceRef', label: 'Ref' },
		{ key: 'licensed', label: 'Licensed', type: 'boolean' }
	] as const;

	const links = [
		{ key: 'versionUrl', label: 'Version Info' },
		{ key: 'buildUrl', label: 'Build URL' },
		{ key: 'buildImageUrl', label: 'Build Image URL' },
		{ key: 'repositoryUrl', label: 'Repository URL' },
		{ key: 'sourceUrl', label: 'Source URL' },
		{ key: 'thirdPartyBugFeatureUrl', label: 'Third-party Bugs' },
		{ key: 'thirdPartyDocumentationUrl', label: 'Third-party Docs' },
		{ key: 'thirdPartySourceUrl', label: 'Third-party Source' },
		{ key: 'thirdPartySupportUrl', label: 'Third-party Support' }
	] as const;

	const configFields = [
		{ key: 'externalDomain', label: 'External Domain' },
		{ key: 'isInitialized', label: 'Initialized', type: 'boolean' },
		{ key: 'isOnboarded', label: 'Onboarded', type: 'boolean' },
		{ key: 'loginPageMessage', label: 'Login Message' },
		{ key: 'maintenanceMode', label: 'Maintenance Mode', type: 'boolean' },
		{ key: 'oauthButtonText', label: 'OAuth Button' },
		{ key: 'publicUsers', label: 'Public Users', type: 'boolean' },
		{ key: 'trashDays', label: 'Trash Days' },
		{ key: 'userDeleteDelay', label: 'User Delete Delay' }
	] as const;

	const configLinks = [
		{ key: 'mapDarkStyleUrl', label: 'Map Dark Style' },
		{ key: 'mapLightStyleUrl', label: 'Map Light Style' }
	] as const;

	const featureFields = [
		{ key: 'configFile', label: 'Config File' },
		{ key: 'duplicateDetection', label: 'Duplicate Detection' },
		{ key: 'email', label: 'Email' },
		{ key: 'facialRecognition', label: 'Facial Recognition' },
		{ key: 'importFaces', label: 'Import Faces' },
		{ key: 'map', label: 'Map' },
		{ key: 'oauth', label: 'OAuth' },
		{ key: 'oauthAutoLaunch', label: 'OAuth Auto-launch' },
		{ key: 'ocr', label: 'OCR' },
		{ key: 'passwordLogin', label: 'Password Login' },
		{ key: 'reverseGeocoding', label: 'Reverse Geocoding' },
		{ key: 'search', label: 'Search' },
		{ key: 'sidecar', label: 'Sidecar' },
		{ key: 'smartSearch', label: 'Smart Search' },
		{ key: 'trash', label: 'Trash' }
	] as const;
</script>

{#if aboutInfo}
	<div class="card bg-base-200 shadow-xl p-4 mt-8">
		<h2 class="text-sm font-bold opacity-70 mb-4 uppercase tracking-wider text-center">System Information</h2>

		<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 text-[10px]">
			{#each fields as field}
				{#if aboutInfo[field.key] !== undefined && aboutInfo[field.key] !== null}
					<div class="flex flex-col">
						<span class="opacity-50 font-semibold">{field.label}</span>
						<span class="truncate">
							{#if field.type === 'boolean'}
								{aboutInfo[field.key] ? 'Yes' : 'No'}
							{:else}
								{aboutInfo[field.key]}
							{/if}
						</span>
					</div>
				{/if}
			{/each}
		</div>

		{#if serverFeatures}
			<div class="divider my-2 opacity-10"></div>
			<h3 class="text-[11px] font-bold opacity-50 mb-3 uppercase tracking-wider text-center">Features</h3>
			<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 text-[10px]">
				{#each featureFields as feature}
					{#if serverFeatures[feature.key] !== undefined && serverFeatures[feature.key] !== null}
						<div class="flex flex-col">
							<span class="opacity-50 font-semibold">{feature.label}</span>
							<span class="truncate">
								{serverFeatures[feature.key] ? 'Enabled' : 'Disabled'}
							</span>
						</div>
					{/if}
				{/each}
			</div>
		{/if}

		<div class="divider my-2 opacity-10"></div>

		{#if serverConfig}
			<div class="divider my-2 opacity-10"></div>
			<h3 class="text-[11px] font-bold opacity-50 mb-3 uppercase tracking-wider text-center">Server Configuration</h3>
			<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 text-[10px]">
				{#each configFields as config}
					{#if serverConfig[config.key] !== undefined && serverConfig[config.key] !== null}
						<div class="flex flex-col">
							<span class="opacity-50 font-semibold">{config.label}</span>
							<span class="truncate">
								{#if config.type === 'boolean'}
									{serverConfig[config.key] ? 'Yes' : 'No'}
								{:else}
									{serverConfig[config.key]}
								{/if}
							</span>
						</div>
					{/if}
				{/each}
			</div>
		{/if}

		{#if versionHistory && versionHistory.length > 0}
			<div class="divider my-2 opacity-10"></div>
			<h3 class="text-[11px] font-bold opacity-50 mb-3 uppercase tracking-wider text-center">Version History</h3>
			<div class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px]">
				{#each versionHistory as history}
					<div class="flex flex-col items-center">
						<span class="opacity-50 font-semibold">{new Date(history.createdAt).toLocaleDateString()}</span>
						<span class="font-mono">{history.version}</span>
					</div>
				{/each}
			</div>
		{/if}

		<div class="divider my-2 opacity-10"></div>

		<div class="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] opacity-60">
			{#each links as link}
				{#if aboutInfo[link.key]}
					<a
						href={aboutInfo[link.key]}
						target="_blank"
						rel="noopener noreferrer"
						class="hover:text-primary transition-colors underline decoration-dotted"
					>
						{link.label}
					</a>
				{/if}
			{/each}
			{#if serverConfig}
				{#each configLinks as link}
					{#if serverConfig[link.key]}
						<a
							href={serverConfig[link.key]}
							target="_blank"
							rel="noopener noreferrer"
							class="hover:text-primary transition-colors underline decoration-dotted"
						>
							{link.label}
						</a>
					{/if}
				{/each}
			{/if}
		</div>
	</div>
{/if}
