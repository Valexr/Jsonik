<script lang="ts" context="module">
    import { flip } from "svelte/animate";
    import { fly } from "svelte/transition";

    import { positions } from "./positions";
    import { toast, type ToastItem } from ".";
    import Toast from ".";
</script>

<script lang="ts">
    const intros = {
        left: { x: -256 },
        right: { x: 256 },
        top: { y: -56 },
        bottom: { y: 56 },
        center: {},
    };

    const flying = (pos?: string) =>
        Object.entries(intros).find(([key]) => pos?.includes(key))?.[1];

    $: toasted = (p: string): ToastItem[] =>
        $toast
            .filter((t: ToastItem) => t.pos === p)
            .sort(
                (a: ToastItem, b: ToastItem) =>
                    (b.id as number) - (a.id as number)
            );
</script>

{#if $toast.length}
    <div class="toaster">
        {#each positions as pos}
            <ul class="toast-list pos-{pos}">
                {#each toasted(pos) as toastItem (toastItem.id)}
                    <li
                        in:fly={{ ...flying(toastItem.pos), opacity: 1 }}
                        animate:flip={{ duration: 250 }}
                    >
                        <Toast {toastItem} />
                    </li>
                {/each}
            </ul>
        {/each}
    </div>
{/if}
