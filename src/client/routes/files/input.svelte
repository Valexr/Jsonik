<script lang="ts" context="module">
    import { fragment } from "svelte-pathfinder";
    import Form from "$client/components/Form.svelte";
</script>

<script lang="ts">
    export let value = "";
    export let onclose: (() => void) | undefined = undefined;

    function close(node: HTMLInputElement, onclose?: () => void) {
        function update(onclose?: () => void) {
            node.onblur = () => (onclose ? onclose() : fragment.set(""));
            node.onkeydown = (e) => {
                if (e.key === "Escape") {
                    e.preventDefault();
                    e.stopPropagation();
                    onclose ? onclose() : fragment.set("");
                }
            };
        }
        update(onclose);
        return {
            update,
        };
    }
</script>

<Form on:submit>
    <fieldset>
        <label>
            <!-- svelte-ignore a11y-autofocus -->
            <input
                name="value"
                autofocus={true}
                {value}
                pattern="^[\w,\-]+"
                {...$$restProps}
                use:close={onclose}
            />
        </label>
    </fieldset>
</Form>

<style>
    label {
        margin: 0;
    }
</style>
