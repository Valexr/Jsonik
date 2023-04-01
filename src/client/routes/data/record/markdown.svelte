<script lang="ts" context="module">
    import Code from "$client/components/Code.svelte";
    import Icon from "$client/components/Icon.svelte";
</script>

<script lang="ts">
    export let name: string;
    export let required: boolean;
    export let value: any;
    // export let opts: any;

    let output = value || "";

    const code = JSON.stringify({ name, value }, null, 2);
</script>

<label>
    <textarea class="hidden" {name} {required} value={output} />
    <small><Icon icon="markdown" color="gray" /> {name}</small>
    <Code invalid={required && !output} input={code} bind:output />
</label>
