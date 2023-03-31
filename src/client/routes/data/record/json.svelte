<script lang="ts" context="module">
    import Code from "$client/components/Code.svelte";
    import Icon from "$client/components/Icon.svelte";
</script>

<script lang="ts">
    export let name: string;
    export let required: boolean;
    export let opts: any;
    export let value: any;

    let output = value || "";
</script>

<label>
    <textarea class="hidden" {name} {required} value={output} />
    <small><Icon icon="json" color="gray" /> {name}</small>
    <Code invalid={required && !output} input={value} bind:output />
</label>
