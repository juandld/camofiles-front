<script lang="ts">
	import AuthPopup from "$lib/components/mini/AuthPopup.svelte";
	import { goto } from "$app/navigation";

	let email = $state("");
	let username = $state("");
	let fullName = $state("");
	let password = $state("");
	let password2 = $state("");
	let popupMessage = $state("");

	const submit = async (event: Event) => {
		event.preventDefault(); // Prevent the form's default behavior

		if (password !== password2) {
			popupMessage = "Passwords do not match";
			return;
		}

		if (
			email === "" ||
			username === "" ||
			fullName === "" ||
			password === ""
		) {
			popupMessage = "Please fill in all the fields";
			return;
		}

		try {
			// Sign up with email and password auth service
			const responseAuth = await fetch("/api/auth/", {
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

			if (responseAuth) {
				console.log(responseAuth);
				//goto(username);
			}
		} catch (error) {
			if (error instanceof Error) {
				console.log(error.message);
				switch (error.message) {
					case "Firebase: Error (auth/email-already-in-use).":
						popupMessage = "Email is already in use";
						break;
					case "Firebase: Error (auth/invalid-email).":
						popupMessage = "Invalid email address";
						break;
					case "Firebase: Error (auth/weak-password).":
						popupMessage = "Password is too weak";
						break;
					case "Username already exists":
						console.log("Username already exists");
						popupMessage = "Username is already in use";
						break;
					default:
						popupMessage = error.message;
				}
			}
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
			/>
		</label>
		<button class="btn variant-filled-surface m-2" type="submit">
			Register
		</button>
	</form>
</div>
