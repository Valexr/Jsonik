import { listen } from './index.js';
import type { Action } from 'svelte/action';

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

const clickOutside: Action<HTMLElement, (() => void)> = (node, handler) => {
    const handleClick = (e: MouseEvent) => {
        const { target, defaultPrevented } = e
        if (node && !node.contains(target as Node) && !defaultPrevented && handler) {
            e.stopImmediatePropagation()
            handler()
        }
    };

    const unsubscribe = listen(document, 'click', handleClick as any, true);

    return {
        destroy: unsubscribe,
    }
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
    // node.oninvalid = (e) => {
    //     console.log(e);
    // };

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

function expand(node: HTMLTextAreaElement) {
    // node.style.height = `${node.scrollHeight + 24}px`
    if (node.nodeName === 'TEXTAREA')
        node.oninput = (e: Event) => {
            node.style.height = 'auto'
            node.style.height = `${node.scrollHeight + 3}px`
        }
}

function getFocusable(node: HTMLElement): Array<any> {
    return Array.from(node.querySelectorAll(
        ':is(a, button, input, textarea, select, details, summary):not(:disabled, [type=hidden], .hidden,[tabindex="-1"])'
        //  [tabindex]:not([tabindex="-1"])`
    ))
}

function focusTrap(node: HTMLElement) {
    let focusable = getFocusable(node)
    const MO = new MutationObserver((ML) => {
        focusable = getFocusable(node)
    });
    MO.observe(node, { childList: true, subtree: true, attributes: true });
    node.onkeydown = (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            let index = focusable.indexOf(document.activeElement);
            if (index === -1 && e.shiftKey) index = 0;
            index += focusable.length + (e.shiftKey ? -1 : 1);
            index %= focusable.length;
            // console.log(focusable[index])
            focusable[index].focus();
        }
    }
    return {
        destroy: () => MO.disconnect()
    }
}

function keyEscape(node: HTMLElement, cb: () => void) {
    window.onkeydown = (e) => {
        if (e.key === "Escape") {
            e.preventDefault();
            cb();
        }
    };
}

function scrollIntoView(node: HTMLElement, path: string) {
    const update = (path: string) => {
        const selectors = `a[href^="/${path}"][aria-disabled="true"]`;
        const anchor = node.querySelector(selectors);
        anchor?.scrollIntoView({ behavior: "auto", inline: "center" });
    };
    update(path);
    return {
        update,
    };
}

export { clickout, validation, sticked, clickOutside, expand, focusTrap, keyEscape, scrollIntoView }