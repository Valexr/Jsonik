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
        name: 'text',
        opts: {
            minlength: 0,
            maxlength: 0,
            pattern: 'e.g. ^\\w+$',
        }
    },
    {
        type: 'textarea',
        name: 'textarea',
        opts: {
            minlength: 0,
            maxlength: 0,
        }
    },
    {
        type: 'number',
        name: 'number',
        opts: {
            min: 0,
            max: 0,
        }
    },
    {
        type: 'checkbox',
        name: 'checkbox',
        opts: {}
    },
    {
        type: 'email',
        name: 'email',
        opts: {
            pattern: 'e.g. ^.*\\.com$',
            placeholder: 'e@mail.com'
        }
    },
    {
        type: 'url',
        name: 'url',
        opts: {
            pattern: 'e.g. ^https.*\\.com$',
            placeholder: 'https://domain.zone'
        }
    },
    {
        type: 'tel',
        name: 'tel',
        opts: {
            pattern: 'e.g. ^\\d.*$',
            placeholder: '+0-000-000-00-00'
        }
    },
    {
        type: 'select',
        name: 'select',
        opts: {
            options: 'opt0, opt1, opt2...',
            size: 1
        }
    },
    {
        type: 'date',
        name: 'date',
        opts: {
            min: 0,
            max: 0
        }
    },
    {
        type: 'time',
        name: 'time',
        opts: {
            min: 0,
            max: 0
        }
    },
    {
        type: 'file',
        name: 'file',
        opts: {
            maxFiles: 0,
            maxSize: 0,
            accept: 'e.g. .pdf, image/*, text/plain'
        }
    },
    {
        type: 'json',
        name: 'json',
        opts: {}
    },
    {
        type: 'markdown',
        name: 'markdown',
        opts: {}
    },
]