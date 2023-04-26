<script lang="ts" context="module">
    import { fly } from "svelte/transition";
    import { fragment } from "svelte-pathfinder";
    import {
        clickout,
        clickOutside,
        focusTrap,
        keyEscape,
    } from "$client/utils/actions.js";
    import Form from "$client/components/Form.svelte";
    import Icon from "$client/components/Icon.svelte";
</script>

<script lang="ts">
    export let id = "";
    export let open = false;
    export let top = false;
    export let right = false;
    export let bottom = false;
    export let left = false;
    export let valid = false;
    export let close = () => fragment.set("");

    let aside: HTMLElement;

    const X = left ? -1 : right ? 1 : 0;
    const Y = top ? -1 : bottom ? 1 : 0;

    function closeAction(aside: HTMLElement) {
        const form = aside.firstChild as HTMLFormElement;
        form.onsubmit = () => close();
        form.onreset = () => close();
    }
</script>

{#if open}
    <aside
        {id}
        class:top
        class:right
        class:bottom
        class:left
        class:open
        bind:this={aside}
        transition:fly={{
            x: aside.offsetWidth * X,
            y: aside.offsetHeight * Y,
            opacity: 1,
        }}
        use:clickOutside={close}
        use:keyEscape={close}
        use:closeAction
        use:focusTrap
    >
        <Form method="POST" bind:valid on:submit on:reset on:input>
            <header>
                <slot name="header" />
                <button
                    type="reset"
                    id="close"
                    class="action link"
                    on:click={close}
                >
                    <Icon />
                </button>
            </header>
            <article class="scroll">
                <slot />
            </article>
            <footer>
                <slot name="footer">
                    <nav class="cols col-fit justify-end">
                        <button type="reset" class="link">Cancel</button>
                        <button type="submit" class="success" disabled={!valid}>
                            Confirm
                        </button>
                    </nav>
                </slot>
            </footer>
        </Form>
    </aside>
{/if}
