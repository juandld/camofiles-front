<script>
	import { onMount } from "svelte";
	export let popupMessage;

	onMount(() => {
		// Scroll the popup into view when it mounts
		if (popupMessage) {
			// Scroll the element into view
			scrollContainer();
		}
	});

	function scrollContainer() {
		// Use this component's top-level element for scrolling
		const element = document.getElementById("popup-container");
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}

</script>

<div class="card p-4 variant-filled-error popup" id="popup-container">
	<p>{popupMessage}</p>
</div>