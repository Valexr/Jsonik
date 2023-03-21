export default function selection(container: HTMLElement, {
    target,
    disabled,
    match,
    style
}: {
    target: string;
    disabled?: boolean | string;
    match: (el: Element[]) => void
    style?: CSSStyleDeclaration["cssText"]
}) {

    const rect = document.createElement('div') as HTMLDivElement;

    rect.style.cssText = style || `
    background: #fff;
    opacity: 0.25;
    position: absolute;
  `;
    rect.hidden = true;

    const ctx = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
    };

    const state = {
        mouseDown: false,
        moving: false,
        mounted: false,
        disabled: false
    };

    let selectedElements = [] as Element[];

    function onMouseDown(e: MouseEvent) {
        if (state.disabled) return;
        if (!e.shiftKey) selectedElements = [];
        state.mouseDown = true;
        ctx.x1 = e.pageX;
        ctx.x2 = e.pageX;
        ctx.y1 = e.pageY;
        ctx.y2 = e.pageY;
        reCalc();
    };

    function onMouseMove(e: MouseEvent) {
        if (state.disabled || !state.mouseDown) return;
        if (rect.hidden && !(ctx.x1 === 0 && ctx.x2 === 0 && ctx.y1 === 0 && ctx.y2 === 0)) {
            rect.hidden = false;
        }
        if (!state.mounted) {
            container.append(rect);
        }
        ctx.x2 = e.pageX;
        ctx.y2 = e.pageY;
        reCalc();

        if (state.mouseDown && !state.moving) {
            state.moving = true;
        } else if (state.mouseDown && state.moving) {
            document.querySelectorAll(target).forEach(ele => {
                const alreadySelected = selectedElements.indexOf(ele) !== -1;
                const eleRect = ele.getBoundingClientRect();
                const isOverlapped = checkForOverlap(eleRect);

                if (isOverlapped && !alreadySelected) {
                    selectedElements.push(ele);
                    match(selectedElements)
                } else if (!isOverlapped && alreadySelected && !e.shiftKey) {
                    selectedElements = selectedElements.filter(v => v !== ele);
                    match(selectedElements)
                }
            });
        }
    };

    function onMouseUp() {
        if (!rect.hidden) rect.hidden = true;
        if (state.moving) match(selectedElements)
        cleanUp();
    };

    if (!disabled) {
        container.addEventListener('mousedown', onMouseDown);
        container.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }

    function reCalc() {
        const dim = getDimensions();
        rect.style.left = `${dim.xleft}px`;
        rect.style.top = `${dim.ybottom}px`;
        rect.style.width = `${dim.xright - dim.xleft}px`;
        rect.style.height = `${dim.ytop - dim.ybottom}px`;
    }

    function getDimensions() {
        return {
            xleft: Math.min(ctx.x1, ctx.x2),
            xright: Math.max(ctx.x1, ctx.x2),
            ybottom: Math.min(ctx.y1, ctx.y2),
            ytop: Math.max(ctx.y1, ctx.y2)
        };
    }

    function checkForOverlap(boundingRect: DOMRect) {
        const iRect = {
            top: boundingRect.top + window.scrollY,
            right: boundingRect.right + window.scrollX,
            bottom: boundingRect.bottom + window.scrollY,
            left: boundingRect.left + window.scrollX
        };
        const r = getDimensions();
        if (
            ((r.xleft >= iRect.left && r.xleft <= iRect.right) ||
                (r.xright >= iRect.left && r.xright <= iRect.right) ||
                (iRect.left >= r.xleft && iRect.left <= r.xright) ||
                (iRect.right >= r.xleft && iRect.right <= r.xright)) &&
            ((r.ytop >= iRect.bottom && r.ytop <= iRect.top) ||
                (r.ybottom >= iRect.bottom && r.ybottom <= iRect.top) ||
                (iRect.bottom >= r.ybottom && iRect.bottom <= r.ytop) ||
                (iRect.bottom >= r.ybottom && iRect.top <= r.ytop))
        )
            return true;
        return false;
    }

    function cleanUp() {
        state.mouseDown = false;
        state.moving = false;
        ctx.x1 = 0;
        ctx.y1 = 0;
        ctx.x2 = 0;
        ctx.y2 = 0;
        state.mounted = false;
        rect.remove();
    }

    function disable() {
        container?.removeEventListener('mousedown', onMouseDown);
        container?.removeEventListener('mousemove', onMouseMove);
        window?.removeEventListener('mouseup', onMouseUp);
    }

    function enable() {
        container?.addEventListener('mousedown', onMouseDown);
        container?.addEventListener('mousemove', onMouseMove);
        window?.addEventListener('mouseup', onMouseUp);
    }

    function update({ disabled }: { disabled: boolean }) {
        disabled ? disable() : enable()
    }
    function destroy() {
        disable()
        cleanUp()
    }

    return {
        update,
        destroy
    };
}