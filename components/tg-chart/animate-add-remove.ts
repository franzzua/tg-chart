export function animateAddRemove(result) {
    result.insertBefore = <T extends Node>(item: T, ref: Node) => {
        (item['onadd'])();
        if (item.parentNode !== result)
            Element.prototype.insertBefore.call(result, item, ref);
        return item;
    };
    result.removeChild = <T extends Node>(item: T) => {
        (item['ondelete'])();
        return item;
    };
    return result;
}

export function animateFadeOut(item: Element) {
    if (item instanceof SVGElement || item instanceof HTMLElement) {
        item['onadd'] = () => {
            item.style.fill = 'white';
            // item.classList.add('fadeIn');
            // item.classList.remove('fadeOut');
        };
        item['ondelete'] = () => {
            item.style.fill = 'red';
            // item.classList.add('fadeOut');
            // item.classList.remove('fadeIn');
        }
    }
    return item;
}