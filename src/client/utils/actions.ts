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
    const handleClick = (event: MouseEvent) => {
        const { target, defaultPrevented } = event
        if (node && !node.contains(target as Node) && !defaultPrevented && handler) {
            event.stopImmediatePropagation()
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
    node.oninput = (e: Event) => {
        node.style.height = 'auto'
        node.style.height = `${node.scrollHeight + 3}px`
    }
}

function getFocusable(node: HTMLElement): Array<any> {
    return Array.from(node.querySelectorAll(
        `:is(a, button, input, textarea, select, details):not(:disabled),
         [tabindex]:not([tabindex="-1"])`
    ))
}

function focusTrap(node: HTMLElement) {
    const focusable = getFocusable(node)
    node.onkeydown = (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            let index = focusable.indexOf(document.activeElement);
            if (index === -1 && e.shiftKey) index = 0;
            index += focusable.length + (e.shiftKey ? -1 : 1);
            index %= focusable.length;
            focusable[index].focus();
        }
    }
}

function keyEscape(node: HTMLElement, cb: () => void) {
    node.onkeydown = (e) => {
        if (e.key === "Escape") {
            cb();
        }
    };
}

function selectable(node: HTMLElement) {
    let x1 = 0,
        y1 = 0,
        x2 = 0,
        y2 = 0;

    const div = document.createElement("div");
    // const items = node.childNodes;
    // items.forEach((child) => {
    //     child.onpointerover = () => (child.style.borderColor = "red");
    //     child.onpointerleave = () => (child.style.borderColor = "");
    // });
    div.style.cssText = `
    border: 1px solid red;
    background: rgba(255, 0, 0, 0.25);
    position: absolute;
    z-index: 1;
    `
    function reCalc() {
        const x3 = Math.min(x1, x2);
        const x4 = Math.max(x1, x2);
        const y3 = Math.min(y1, y2);
        const y4 = Math.max(y1, y2);
        div.style.left = x3 + "px";
        div.style.top = y3 + "px";
        div.style.width = x4 - x3 + "px";
        div.style.height = y4 - y3 + "px";
    }
    node.onpointerdown = (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        x1 = e.pageX;
        y1 = e.pageY
        reCalc()
        node.onpointermove = move;
        div.hidden = false;
        node.append(div);

    };
    let selected: EventTarget[] = []
    function move(e: PointerEvent) {
        const { target, currentTarget } = e
        const matched = e.composedPath().find(t => t.id)
        if (matched) {
            if (selected.includes(matched)) {
                selected = selected.filter(s => s !== matched)
            } else selected.push(matched)
        }
        console.log(selected, { target, currentTarget })
        e.preventDefault();
        e.stopPropagation();
        x2 = e.pageX;
        y2 = e.pageY;
        reCalc();
    }
    window.onpointerup = (e) => {
        e.preventDefault();
        div.style.left = "";
        div.style.top = "";
        div.style.width = "";
        div.style.height = "";
        div.hidden = true;
        node.onpointermove = null;
        div.remove()
    };
    node.onpointerleave = (e) => e.preventDefault()
}

export { clickout, validation, sticked, clickOutside, expand, focusTrap, keyEscape, selectable }