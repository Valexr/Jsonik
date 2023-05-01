<script lang="ts">
    export let icon = "x";
    export let size = 16;
    export let color = "current";
</script>

<svg
    width={size}
    height={size}
    class="text-{color}"
    fill="none"
    stroke-width="2"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
>
    <use href="/sprite.svg#{icon}" />
</svg>
