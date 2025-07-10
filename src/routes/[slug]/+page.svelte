<script lang="ts">
	export let data;
</script>

<div class="container p-4 mx-auto">
	<header class="mb-8">
		<h1 class="text-4xl font-bold">{data.profile.fullName}</h1>
		<p class="text-xl text-gray-500">@{data.profile.username}</p>
	</header>

	<section>
		<h2 class="text-2xl font-semibold mb-4">Public Camofiles</h2>
		{#if data.publicCamofiles.length > 0}
			<ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each data.publicCamofiles as file}
					<li class="card variant-ghost-surface p-4">
						<h3 class="text-lg font-bold">{file.title}</h3>
						<p>{file.content}</p>
					</li>
				{/each}
			</ul>
		{:else}
			<p>This user has no public camofiles.</p>
		{/if}
	</section>

	{#if data.isOwner}
		<section class="mt-8">
			<h2 class="text-2xl font-semibold mb-4">Private Camofiles</h2>
			{#if data.privateCamofiles.length > 0}
				<ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each data.privateCamofiles as file}
						<li class="card variant-ghost-surface p-4">
							<h3 class="text-lg font-bold">{file.title}</h3>
							<p>{file.content}</p>
						</li>
					{/each}
				</ul>
			{:else}
				<p>You have no private camofiles.</p>
			{/if}
		</section>
	{/if}
</div>
