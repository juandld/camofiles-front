<script lang="ts">
	import AuthPopup from "$lib/components/mini/AuthPopup.svelte";
	import { goto } from "$app/navigation";

	let email = $state("");
	let username = $state("");
	let fullName = $state("");
	let password = $state("");
	let password2 = $state("");
	let popupMessage = $state("");
	let isLoading = $state(false);

	const submit = async (event: Event) => {
		event.preventDefault();
		popupMessage = "";
		isLoading = true;

		// Simple validation
		if (password !== password2) {
			popupMessage = "Passwords do not match";
			isLoading = false;
			return;
		}

		if (!email || !username || !fullName || !password) {
			popupMessage = "Please fill in all fields";
			isLoading = false;
			return;
		}

		// Send the registration request to the server
		try {
			const response = await fetch("/api/auth/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					type: "signup",
					content: {
						email,
						password,
						username,
						fullName,
					},
				}),
			});

			const data = await response.json();

			if (data.error) {
				popupMessage = data.error;
				isLoading = false;
				return;
			}

			await goto(`/${username}`);
		} catch (error) {
			popupMessage = "Something went wrong, please try again";
			isLoading = false;
		}
	};
</script>

{#if popupMessage}
	<AuthPopup {popupMessage} />
{/if}

<div
	class="card variant-ghost-surface w-full p-4 flex justify-center items-center flex-col"
>
	<form class="grid grid-cols-1 gap-2" onsubmit={submit}>
		<label class="label">
			<span>Email</span>
			<input
				class="input text-white"
				type="email"
				name="email"
				autocomplete="email"
				bind:value={email}
				disabled={isLoading}
			/>
		</label>
		<label class="label">
			<span>Username</span>
			<input
				class="input text-white"
				type="text"
				name="username"
				autocomplete="username"
				bind:value={username}
				disabled={isLoading}
			/>
		</label>
		<label class="label">
			<span>Name</span>
			<input
				class="input text-white"
				type="text"
				name="fullname"
				autocomplete="name"
				bind:value={fullName}
				disabled={isLoading}
			/>
		</label>
		<label class="label">
			<span>Password</span>
			<input
				class="input text-white"
				type="password"
				name="new-password"
				autocomplete="new-password"
				bind:value={password}
				disabled={isLoading}
			/>
		</label>
		<label class="label">
			<span>Confirm Password</span>
			<input
				class="input text-white"
				type="password"
				name="confirm-password"
				autocomplete="new-password"
				bind:value={password2}
				disabled={isLoading}
			/>
		</label>
		<button 
			class="btn variant-filled-surface m-2" 
			type="submit" 
			disabled={isLoading}
		>
			{isLoading ? 'Creating Account...' : 'Register'}
		</button>
	</form>
</div>