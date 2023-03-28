<script lang="ts" context="module">
    import { fly } from "svelte/transition";
    import { fragment } from "svelte-pathfinder";
    import {
        clickout,
        clickOutside,
        keyEscape,
    } from "$client/utils/actions.js";
    import Form from "$client/components/Form.svelte";
</script>

<script lang="ts">
    export let id = "";
    export let open = false;
    export let top = false;
    export let right = false;
    export let bottom = false;
    export let left = false;
    export let valid = false;

    let aside: HTMLElement;

    const X = left ? -1 : right ? 1 : 0;
    const Y = top ? -1 : bottom ? 1 : 0;

    const close = () => fragment.set("");

    function action(aside: HTMLElement) {
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
        use:action
    >
        <Form bind:valid on:submit on:reset on:input>
            <header>
                <slot name="header" />
                <button id="close" class="action" on:click={close}>
                    <i class="icon icon-svg icon-x" />
                </button>
            </header>
            <article class="scroll">
                <slot />
            </article>
            <!-- svelte-ignore a11y-autofocus -->
            <footer>
                <slot name="footer">
                    <nav class="cols col-fit justify-end">
                        <button type="reset" class="link">Cancel</button>
                        <button
                            type="submit"
                            class="success"
                            disabled={!valid}
                            autofocus={valid}
                        >
                            Confirm
                        </button>
                    </nav>
                </slot>
            </footer>
        </Form>
    </aside>
{/if}
