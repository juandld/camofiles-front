<script>
    /**
     * @typedef {Object} Props
     * @property {import('svelte').Snippet} [children]
     */

    /** @type {Props} */
    let { children } = $props();

</script>

<div class="flex justify-center items-center p-10">
    {@render children?.()}
</div>