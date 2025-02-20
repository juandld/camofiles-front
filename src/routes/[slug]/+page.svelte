<script lang="ts">
    import { goto } from "$app/navigation";

    export let data: {
        userID: string;
        userDetails: {
            email: string;
            username: string;
            fullName: string;
        }
        posts: { 
            title: string 
            updatedAt: string
        }[];
    };

    const newChamofile = async () => {
        try {
            const response = await fetch("/api/camofiles/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: "create",
                    content: {
                        userID: data.userID,
                        title: "New Chamofile",
                        content: "Initial content"
                    },
                }),
            });

            const result = await response.json();

            if (result.error) {
                console.error("Error creating Chamofile:", result.error);
                return;
            }

            const newChamofileID = result.chamofileID;
            await goto(`/work/${newChamofileID}`);
        } catch (error) {
            console.error("Error creating Chamofile:", error);
        }
    };
</script>

{#if data}
    <div class="card">
        <p>{data.userDetails.email}</p>
        <p>{data.userDetails.username}</p>
        <p>{data.userDetails.fullName}</p>
    </div>
    <br>

    {#if data.posts}
        <button class="btn variant-filled" on:click={newChamofile}>New Chamofile</button>

        <h2>{data.userDetails.username}'s Chamofiles</h2>
        <div>
            {#each data.posts as post}
                <a href="#">
                    <div class="card variant-ghost-surface w-1/2">
                        <h3 class="h3">{post.title}</h3>
                        <p>Last updated: {post.updatedAt}</p>
                    </div>
                </a>
            {/each}
        </div>
    {:else} 
        <div class="flex flex-col">
            <h2 class="h2">This user has no posts</h2>
            <button class="btn variant-filled" on:click={newChamofile}>Write a new post</button>
        </div>
    {/if}
{:else}
    <div class="placeholder" />
{/if}