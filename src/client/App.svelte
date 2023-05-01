<script lang="ts" context="module">
    import Header from "$client/views/Header.svelte";
    import Main from "$client/views/Main.svelte";
    import Footer from "$client/views/Footer.svelte";
    import Router from "$client/components/Router.svelte";
    import Toaster from "$client/components/Toaster/Toaster.svelte";
    import LBModal from "$client/components/LightBox/Modal.svelte";
    import type { Name, Repository } from "$types/client";
</script>

<script lang="ts">
    export let name: Name;
    export let repository: Repository;
</script>

<Header {repository} />
<Main>
    <Router {name} />
</Main>
<Footer />
<LBModal />
<Toaster />

<style>
    @import "app.css";
</style>
