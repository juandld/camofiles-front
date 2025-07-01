<script lang="ts">
	import AuthPopup from "$lib/components/mini/AuthPopup.svelte";
	import { goto } from "$app/navigation";

	let email = $state("");
	let username = $state("");
	let fullName = $state("");
	let password = $state("");
	let password2 = $state("");
	
	// For backend messages
	let popupMessage = $state("");

	// For inline validation messages
	let emailError = $state("");
	let usernameError = $state("");
	let fullNameError = $state("");
	let passwordError = $state("");
	let password2Error = $state("");

	let isLoading = $state(false);

	const validate = () => {
		// Reset previous errors
		emailError = "";
		usernameError = "";
		fullNameError = "";
		passwordError = "";
		password2Error = "";

		let validationFailed = false;

		// Field presence check
		if (!email) {
			emailError = "Please fill in your email";
			validationFailed = true;
		}
		if (!username) {
			usernameError = "Please choose a username";
			validationFailed = true;
		}
		if (!fullName) {
			fullNameError = "Please enter your full name";
			validationFailed = true;
		}
		if (!password) {
			passwordError = "Please enter a password";
			validationFailed = true;
		}
        if (!password2) {
			password2Error = "Please confirm your password";
			validationFailed = true;
		}

		// Email format validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (email && !emailRegex.test(email)) {
			emailError = "Please enter a valid email address";
			validationFailed = true;
		}

		// Username validation
		if (username && username.length < 3) {
			usernameError = "Username must be at least 3 characters long";
			validationFailed = true;
		}
		const usernameRegex = /^[a-zA-Z0-9_]+$/;
		if (username && !usernameRegex.test(username)) {
			usernameError = "Username can only contain letters, numbers, and underscores";
			validationFailed = true;
		}

		// Password validation
		if (password && password.length < 8) {
			passwordError = "Password must be at least 8 characters long";
			validationFailed = true;
		}
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
		if (password && !passwordRegex.test(password)) {
			passwordError = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
			validationFailed = true;
		}

		// Password confirmation check
		if (password !== password2) {
			password2Error = "Passwords do not match";
			validationFailed = true;
		}

		return !validationFailed;
	}

	const submit = async (event: Event) => {
		event.preventDefault();
		popupMessage = ""; // Clear previous backend messages

		if (!validate()) {
			return; // Stop if validation fails
		}

		isLoading = true;

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
				popupMessage = data.error; // Show backend error in the popup
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
	<form class="grid grid-cols-1 gap-2" onsubmit={submit} novalidate>
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
			{#if emailError}<p class="text-red-500 text-sm mt-1">{emailError}</p>{/if}
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
			{#if usernameError}<p class="text-red-500 text-sm mt-1">{usernameError}</p>{/if}
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
			{#if fullNameError}<p class="text-red-500 text-sm mt-1">{fullNameError}</p>{/if}
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
			{#if passwordError}<p class="text-red-500 text-sm mt-1">{passwordError}</p>{/if}
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
			{#if password2Error}<p class="text-red-500 text-sm mt-1">{password2Error}</p>{/if}
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
