<script lang="ts" context="module">
    import { createEventDispatcher } from "svelte";
    import { focusTrap, keyEscape } from "$client/utils/actions";
    import Icon from "./Icon.svelte";
    import Form from "./Form.svelte";
    export type DialogSize = "sm" | "md" | "lg" | "fs" | "";
    export type DialogFrom =
        | "center"
        | "top"
        | "bottom"
        | "left"
        | "right"
        | "";
</script>

<script lang="ts">
    export let open = false;
    export let valid = false;
    export let info = false;
    export let img = false;
    export let size: DialogSize = "";
    export let from: DialogFrom = "";

    const dispatch = createEventDispatcher();

    function action(dialog: HTMLDialogElement, opened: boolean) {
        const form = dialog.firstChild as HTMLFormElement;

        focusTrap(dialog);
        // keyEscape(dialog, dialog.close);
        window.onkeydown = (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                dialog.close();
            }
        };

        form.onsubmit = () => dialog.close();
        form.onreset = () => dialog.close();

        dialog.onclick = (e) => {
            e.stopPropagation();
            const { nodeName } = e.target as HTMLDialogElement;
            if (nodeName === "DIALOG") {
                dialog.close();
            }
        };

        dialog.onclose = () => {
            // document.documentElement.style.overflow = "";
            dispatch("close");
        };

        function update(opened: boolean) {
            valid = form.checkValidity();
            if (opened) {
                dialog.showModal();
                dispatch("open");
                // document.documentElement.style.overflow = "hidden";
            } else {
                dialog.close();
            }
        }
        function destroy() {
            valid = form.checkValidity();
        }

        update(opened);

        return { update, destroy };
    }
</script>

<dialog
    use:action={open}
    on:close|preventDefault
    class={`${size} ${from}`}
    class:img
>
    <Form method="dialog" bind:valid on:submit on:reset on:change on:input>
        <header class="cols" class:justify-end={!$$slots.header}>
            <slot name="header" />
            {#if !img}
                <button type="reset" id="close" class="action link">
                    <Icon />
                </button>
            {/if}
        </header>
        <article class="scroll">
            <slot />
        </article>
        {#if !info}
            <footer>
                <slot name="footer">
                    <menu class="cols col-fit justify-end">
                        <button type="reset" class="link">Cancel</button>
                        <button type="submit" class="success" disabled={!valid}>
                            Confirm
                        </button>
                    </menu>
                </slot>
            </footer>
        {/if}
    </Form>
</dialog>
