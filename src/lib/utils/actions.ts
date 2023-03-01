function clickout(node: EventTarget, cb: { (): (boolean | any) }) {
    window.onpointerup = (e) => {
        const target = e.target as HTMLElement
        const el = ['BUTTON', 'A'].includes(target.nodeName) ? target : node

        if (e.composedPath().includes(el)) return;

        cb instanceof Function && cb();
    };
    return {
        destroy() {
            window.onpointerup = null;
        },
    };
}

interface Validatable extends HTMLElement {
    setCustomValidity(arg: string): unknown;
    checkValidity(): boolean;
    value: string;
    valid?: boolean;
    type?: string
}

export type Validator = {
    valid?: (value: string) => void;
    replace?: (string | RegExp)[];
    match?: RegExp;
    invalid?: string;
};

function validation(node: Validatable, validator: Validator) {
    const { match, replace, valid, invalid } = validator

    validate(node.value)

    node.oninput = (e) => {
        if (replace) {
            const { value } = e.target as Validatable
            const [search, to] = replace
            node.value = value.replace(search, String(to))
        }
        validate(node.value)
    };
    node.oninvalid = (e) => {
        // console.log(e);
    };

    function check(value: string) {
        return match?.test(value) || node.checkValidity()
    }
    function validate(value: string) {
        match && node.setCustomValidity(check(value) ? '' : invalid || 'invalid')
        valid?.(check(value) ? value : '')
    }

    return {
        destroy() {
            node.value = check(node.value) ? node.value : ''
            valid?.(node.value)
        }
    }
}

function sticked(node: HTMLElement, cb?: (sticked: boolean) => void) {
    window.onscroll = () => {
        const { offsetHeight } = node.previousElementSibling as HTMLElement;
        const sticked = node.offsetTop > offsetHeight || false;

        cb ??= styling;
        cb(sticked);

        function styling(sticked: boolean) {
            const action = sticked ? "add" : "remove";
            node.classList[action]("sticked");
        }
    };
}

export { clickout, validation, sticked }