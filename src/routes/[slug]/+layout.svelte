<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { userState } from '$lib/stores/state.svelte';

    let isLoggedIn = false;    

    const checkAuthStatus = async () => {        
        try {
            const response = await fetch("/api/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: "check",
                    content: { sessionId: userState.sessionId, jwt: userState.jwt },
                }),
            });
            
            if (!response.ok) {
                goto('/');
                return;
            }

            const result = await response.json();            
            isLoggedIn = result.success;
        } catch (error) {
            console.error('Error checking auth status:', error);
            isLoggedIn = false;
        }
    };

    onMount(() => {        
        checkAuthStatus();
    });
</script>

<main class="p-10">
    <slot />
</main>