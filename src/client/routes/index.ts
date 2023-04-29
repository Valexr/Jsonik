import { derived, type Readable } from 'svelte/store';
import { pattern } from 'svelte-pathfinder';

export interface Page {
    match: string,
    component: () => Promise<typeof import("./data/page.svelte")>,
    props: {
        title: string,
        icon?: string,
        menu?: string
    }
}

export const routes: Page[] = [
    {
        match: '/',
        component: () => import('./auth/page.svelte'),
        props: { title: 'Auth', icon: 'key' },
    },
    {
        match: '/data/:file?',
        component: () => import('./data/page.svelte'),
        props: { title: 'Data', icon: 'database', menu: '/data' },
    },
    {
        match: '/files/:folder?',
        component: () => import('./files/page.svelte'),
        props: { title: 'Files', icon: 'hard-drive', menu: '/files' },
    },
    {
        match: '/users/:role?',
        component: () => import('./users/page.svelte'),
        props: { title: 'Users', icon: 'users', menu: '/users' },
    },
    {
        match: '/logs',
        component: () => import('./logs/page.svelte'),
        props: { title: 'Logs', icon: 'time', menu: '/logs' },
    },
    {
        match: '/settings',
        component: () => import('./settings/page.svelte'),
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
