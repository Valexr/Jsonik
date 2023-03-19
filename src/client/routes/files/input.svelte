<script lang="ts" context="module">
    import { fragment } from "svelte-pathfinder";
    import Form from "$client/components/Form.svelte";
</script>

<script lang="ts">
    export let folder = "";

    function close(node: HTMLInputElement) {
        node.onblur = () => fragment.set("");
        node.onkeydown = (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                fragment.set("");
            }
        };
    }
</script>

<Form on:submit>
    <fieldset>
        <label>
            <!-- svelte-ignore a11y-autofocus -->
            <input
                name="folder"
                autofocus={true}
                value={folder}
                pattern="^[\w,-]+"
                use:close
            />
        </label>
    </fieldset>
</Form>

<style>
    label {
        margin: 0;
    }
</style>
