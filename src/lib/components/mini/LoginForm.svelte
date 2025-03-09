<script lang="ts">
    import { goto } from '$app/navigation';
    import AuthPopup from '$lib/components/mini/AuthPopup.svelte';
    import { userState } from '$lib/stores/state.svelte';

    let popupMessage = '';
    let email = '';
    let password = '';
    let error = false;

    const submit = async () => {
        if (email === '' || password === '') {
            error = true;
            popupMessage = 'Please enter an email and password';
            return;
        }

        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: 'login',
                    content: { email, password }
                })
            });

            const result = await response.json();
        
            if (!response.ok) {
                throw new Error(result.error || 'Login failed');
            }

            if (result.username && result.jwt) {
                // set user session store state
                userState.sessionId = result.sessionId;
                userState.jwt = result.jwt;
                // Redirect to user profile
                goto(`/${result.username}`);
            } else {
                throw new Error('Username not found');
            }
        } catch (error) {
            if (error instanceof Error) {
                switch (error.message) {
                    case 'Invalid email address':
                        popupMessage = 'Invalid email address';
                        break;
                    case 'User not found':
                        popupMessage = 'User not found';
                        break;
                    case 'Check your password':
                        popupMessage = 'Check your password';
                        break;
                    default:                        
                        popupMessage = error.message;
                }
            }
        }
    };
</script>

<div class="card variant-ghost-surface p-4 flex justify-center items-center flex-col h-full">
    <h2 class="h2">Login</h2>
    {#if popupMessage}
        <AuthPopup {popupMessage} />
    {/if}
    <div class="m-2">
        <button class="btn variant-filled-secondary">Google</button>
        <button class="btn variant-filled-secondary">GitHub</button>
    </div>
    <h3>or</h3>
    <form class="grid grid-cols-1 gap-2">
        <label class="label">
            <span>Email</span>
            <input class="input" type="email" id="email" bind:value={email} />
        </label>
        <label class="label">
            <span>Password</span>
            <input class="input" type="password" id="password" bind:value={password} />
        </label>
        <button
            class="btn variant-filled-primary"
            on:click|preventDefault={submit}>Submit</button
        >
    </form>
</div>