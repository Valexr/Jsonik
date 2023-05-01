export type Schema = {
    id: number,
    type: string,
    name: string,
    opts: Record<string, string | number | boolean>,
    valid?: boolean,
    required?: boolean
    prevName?: string,
} & Record<string, any>;

export const SCHEMAS: Partial<Schema>[] = [
    {
        type: 'text',
        icon: 'type',
        opts: {
            minlength: 0,
            maxlength: 0,
            pattern: 'e.g. ^\\w+$',
        }
    },
    {
        type: 'textarea',
        icon: 'edit',
        opts: {
            minlength: 0,
            maxlength: 0,
        }
    },
    {
        type: 'number',
        icon: 'hash',
        opts: {
            min: 0,
            max: 0,
        }
    },
    {
        type: 'checkbox',
        icon: 'check-square',
        opts: {}
    },
    {
        type: 'email',
        icon: 'at-sign',
        opts: {
            pattern: 'e.g. ^.*\\.com$',
            placeholder: 'e@mail.com'
        }
    },
    {
        type: 'url',
        icon: 'link',
        opts: {
            pattern: 'e.g. ^https.*\\.com$',
            placeholder: 'https://domain.zone'
        }
    },
    {
        type: 'tel',
        icon: 'phone',
        opts: {
            pattern: 'e.g. ^\\d.*$',
            placeholder: '+0-000-000-00-00'
        }
    },
    {
        type: 'select',
        icon: 'list',
        opts: {
            options: 'opt0, opt1, opt2...',
            size: 1
        }
    },
    {
        type: 'date',
        icon: 'calendar',
        opts: {
            min: 0,
            max: 0
        }
    },
    {
        type: 'time',
        icon: 'clock',
        opts: {
            min: 0,
            max: 0
        }
    },
    {
        type: 'file',
        icon: 'image',
        opts: {
            maxFiles: 0,
            maxSize: 0,
            accept: 'e.g. .pdf, image/*, text/plain'
        }
    },
    {
        type: 'json',
        icon: 'code',
        opts: {}
    },
    {
        type: 'markdown',
        icon: 'file-text',
        opts: {}
    },
]