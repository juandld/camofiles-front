<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	
	onMount(() => {
		if (browser) {
            // Check if the user is logged in
            fetch('/api/auth/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'check',
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        return;
                    }

                    goto('/dashboard');
                })
                .catch(() => {
                    // Do nothing
                });
        }
	});
	
</script>

<main class="p-10">
	<slot />
</main>