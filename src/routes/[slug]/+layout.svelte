<script lang="ts">
	// No client-side authentication check is needed.
	// The server hook (`src/hooks.server.ts`) validates the session on every request,
	// which is more secure and reliable.
</script>

<main class="p-10">
	<slot />
</main>
