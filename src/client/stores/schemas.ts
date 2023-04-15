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
        opts: {
            minlength: 0,
            maxlength: 0,
            pattern: 'e.g. ^\\w+$',
        }
    },
    {
        type: 'textarea',
        opts: {
            minlength: 0,
            maxlength: 0,
        }
    },
    {
        type: 'number',
        opts: {
            min: 0,
            max: 0,
        }
    },
    {
        type: 'checkbox',
        opts: {}
    },
    {
        type: 'email',
        opts: {
            pattern: 'e.g. ^.*\\.com$',
            placeholder: 'e@mail.com'
        }
    },
    {
        type: 'url',
        opts: {
            pattern: 'e.g. ^https.*\\.com$',
            placeholder: 'https://domain.zone'
        }
    },
    {
        type: 'tel',
        opts: {
            pattern: 'e.g. ^\\d.*$',
            placeholder: '+0-000-000-00-00'
        }
    },
    {
        type: 'select',
        opts: {
            options: 'opt0, opt1, opt2...',
            size: 1
        }
    },
    {
        type: 'date',
        opts: {
            min: 0,
            max: 0
        }
    },
    {
        type: 'time',
        opts: {
            min: 0,
            max: 0
        }
    },
    {
        type: 'file',
        opts: {
            maxFiles: 0,
            maxSize: 0,
            accept: 'e.g. .pdf, image/*, text/plain'
        }
    },
    {
        type: 'json',
        opts: {}
    },
    {
        type: 'markdown',
        opts: {}
    },
]