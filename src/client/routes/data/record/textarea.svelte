<script lang="ts" context="module">
    import { expand } from "$client/utils/actions.js";
    import Icon from "$client/components/Icon.svelte";
</script>

<script lang="ts">
    export let name: string;
    export let required: boolean;
    export let opts: any;
    export let value: any;
</script>

<label>
    <small><Icon icon="textarea" color="gray" /> {name}</small>
    <textarea {value} {name} {required} {...opts} use:expand />
</label>
