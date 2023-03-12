import { derived, type Readable } from 'svelte/store';
import { pattern } from 'svelte-pathfinder';

export interface Page {
    match: string,
    component: () => Promise<typeof import("./data.svelte")>,
    props: {
        title: string,
        icon?: string,
        menu?: string
    }
}

export const routes: Page[] = [
    {
        match: '/',
        component: () => import('./data.svelte'),
        props: { title: 'Data', icon: 'database', menu: '/' },
    },
    {
        match: '/files/:folder?',
        component: () => import('./files.svelte'),
        props: { title: 'Files', icon: 'hard-drive', menu: '/files' },
    },
    {
        match: '/users',
        component: () => import('./users.svelte'),
        props: { title: 'Users', icon: 'users', menu: '/users' },
    },
    {
        match: '/logs',
        component: () => import('./logs.svelte'),
        props: { title: 'Logs', icon: 'clock', menu: '/logs' },
    },
    {
        match: '/settings',
        component: () => import('./settings.svelte'),
        props: { title: 'Settings', icon: 'settings', menu: '/settings' },
    },
    {
        match: '*',
        component: () => import('./404.svelte'),
        props: { title: '404', icon: 'alert-triangle' },
    }
];

export const page: Readable<Page> = derived(pattern, ($pattern, set) => {
    const route = routes.find(({ match }) => $pattern(match))
    set(route as Page)
});
