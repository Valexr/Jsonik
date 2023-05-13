<script context="module" lang="ts">
    import { tweened } from "svelte/motion";
    import { linear } from "svelte/easing";
    import type { Tweened } from "svelte/motion";

    import { toast } from "./toast";
    import type { ToastItem } from "./toast";

    import Icon from "$client/components/Icon.svelte";

    interface Options {
        delay?: number;
        duration?: number;
        easing?: (t: number) => number;
        interpolate?: (a: number, b: number) => (t: number) => number;
    }

    export type { ToastItem };
</script>

<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let toastItem: ToastItem = {};
    export let id = toastItem.id || 0;
    export let type = toastItem.type || "initial";
    export let timeout = toastItem.timeout || 0;
    export let closable = toastItem.closable ?? true;
    export let reverse = toastItem.reverse || false;
    export let visible = true;
    export let draggable = false;

    let init = reverse ? 1 : 0;
    let next = reverse ? 0 : 1;
    let start = Date.now();
    let remaining = timeout;
    let options: Options = { duration: remaining };

    const defaults: Options = { delay: 0, duration: 0, easing: linear };
    const progress: Tweened<number> = tweened(init, { ...defaults });

    $: timeout && progress.set(next, options).then(autoclose);

    const autoclose = () => timeout && $progress % 1 === 0 && close();

    const close = () => {
        dispatch("close", id);
        toast.close(id);
        visible = false;
    };

    const pause = () => {
        remaining -= Date.now() - start;
        next = $progress;
        options = { duration: 0 };
    };
    const resume = () => {
        start = Date.now();
        next = reverse ? 0 : 1;
        options = { duration: remaining };
    };

    function pausable(node: HTMLElement, paused: boolean) {
        if (paused) {
            node.onpointerenter = pause;
            node.onpointerleave = resume;
        }
        return {
            destroy() {
                node.onpointerenter = null;
                node.onpointerleave = null;
            },
        };
    }
</script>

<article
    class="toast {type || ''}"
    use:pausable={timeout > 0}
    on:dragstart
    on:dragend
    style="--progress: {$progress}"
    {draggable}
>
    <slot>
        <!-- {#if toastItem.icon}<i class="icon icon-{toastItem.icon}" />{/if} -->
        <samp>{toastItem.msg}</samp>
    </slot>

    {#if closable}
        <button id="close" class="box link" on:click={close}>
            <Icon />
        </button>
    {/if}
</article>
