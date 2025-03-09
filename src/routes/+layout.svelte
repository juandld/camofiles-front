<script lang="ts">
    import LoginForm from '$lib/components/mini/LoginForm.svelte';
    import '../app.css';
    import { AppBar, Avatar } from '@skeletonlabs/skeleton-svelte';

    let { children } = $props();
    let showLoginForm = $state(false);

    function toggleLoginForm() {
        showLoginForm = !showLoginForm;
    }
</script>

<main class="p-10">
    {#if showLoginForm}
        <LoginForm />
    {/if}
    <AppBar headlineClasses="sm:hidden" centerClasses="hidden sm:block">
        <Avatar src="https://avatars.dicebear.com/api/avataaars/1234.svg" name="User Avatar" />
            <button type="button" class="btn preset-filled-primary-500" onclick={toggleLoginForm}>
                {showLoginForm ? 'Close Login' : 'Open Login'}
            </button>
    </AppBar>
    {@render children()}
</main>
