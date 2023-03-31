<script lang="ts" context="module">
    import Code from "$client/components/Code.svelte";
    import Icon from "$client/components/Icon.svelte";
</script>

<script lang="ts">
    export let type: string;
    export let name: string;
    export let required: boolean;
    export let opts: any;
    export let value: any;

    let output = value || "";

    const code = JSON.stringify({ type, name, opts, value }, null, 2);
</script>

<label>
    <textarea class="hidden" {name} {required} value={output} />
    <small><Icon icon="markdown" color="gray" /> {name}</small>
    <Code invalid={required && !output} input={code} bind:output />
</label>
