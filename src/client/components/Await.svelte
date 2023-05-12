<script lang="ts" context="module">
    import { createEventDispatcher } from "svelte";
    import { toast } from "$client/components/Toaster";
</script>

<script lang="ts">
    export let promise: Promise<any> | null;
    export let result: any = null;
    export let error: any = "";
    export let success = "";
    export let notify = false;
    export let hidden = false;
    export let sm = false;

    const dispatch = createEventDispatcher();

    $: if (promise) {
        dispatch("await", promise);
        promise
            .then((res) => {
                promise = null;
                result = res ?? true;
                dispatch("success", result);

                if (success && notify)
                    toast.success({ msg: success, timeout: 3000 });
            })
            .catch((e) => {
                // console.error(e);
                promise = null;
                error = error || e.reason || e.message || e;
                dispatch("error", error);

                if (notify) toast.error({ msg: error, timeout: 3000 });
            });
    }
</script>

{#if !hidden}
    {#if promise}
        <slot name="await">
            <p aria-busy="true" class:lg={!sm} />
        </slot>
    {:else if result}
        <slot {result} />
    {:else}
        <slot name="catch" {error}>
            {#if error}
                <samp class="error">{error}</samp>
            {/if}
        </slot>
    {/if}
{/if}
