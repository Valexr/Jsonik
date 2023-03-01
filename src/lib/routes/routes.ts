import { derived, type Readable } from 'svelte/store';
import { pattern } from 'svelte-pathfinder';

export interface Page {
    match: string,
    component: () => Promise<typeof import("./home.svelte")>
    props: {
        title: string
    }
}

export const routes = [
    {
        match: '/',
        component: () => import('./home.svelte'),
        props: { title: 'Home' },
    },
    {
        match: '/logs',
        component: () => import('./logs.svelte'),
        props: { title: 'Logs' },
    },
    {
        match: '/settings',
        component: () => import('./settings.svelte'),
        props: { title: 'Settings' },
    }
];

export const page: Readable<Page> = derived(pattern, ($pattern, set) => {
    const route = routes.find(({ match }) => $pattern(match))
    set(route as Page)
});
