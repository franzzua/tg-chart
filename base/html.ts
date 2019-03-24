// import {Component} from "./component";
// import {wire} from "hyperhtml";
//
// function render(to: Element, data) {
//     if (Array.isArray(data)) {
//         data.forEach(item => render(to, item));
//     }
//     if (data instanceof Element) {
//         to.appendChild(data);
//     }
//     if (typeof data == "string" || typeof data == "number") {
//         to.textContent = data.toString();
//     }
// }
//
// function bindAttr(element: Element & { component?: Component }, key: string, value: any) {
//     if (value === undefined) {
//         element.removeAttribute(key);
//     } else if (typeof value === "string" || typeof value == "number") {
//         element.setAttribute(key, value.toString());
//     } else if (typeof value === "function") {
//         element.addEventListener(key.substr(2), value);
//     } else if (element.component) {
//         element.component[key] = value
//     } else {
//         (element.data || (element.data = {}))[key] = value;
//     }
// }
//
// export const htmlOrSvg = (svg?) => (fragments: TemplateStringsArray, ...data: any[]) => {
//     const regex = /@@@(\d+)@@@/;
//     const result = fragments.reduce((result, fragment, i) => result + `@@@${i - 1}@@@` + fragment);
//     const template = svg ?
//         document.createElementNS("http://www.w3.org/2000/svg", 'svg') :
//         document.createElement('div');
//     template.innerHTML = result;
//     const fragment = template;
//     const allElements: Node[] = [
//         fragment,
//         ...(Array.from(fragment.querySelectorAll('*')))
//     ];
//     allElements.forEach((element: Node) => {
//         if (element instanceof Element) {
//             const attrs = Array.from(element.attributes);
//             attrs.forEach(attr => {
//                 if (!regex.test(attr.value))
//                     return;
//                 const [_, d] = attr.value.match(regex);
//                 bindAttr(element, attr.name, data[+d]);
//             });
//         }
//         const nodes = Array.from(element.childNodes);
//         const textNodes = nodes
//             .filter(node => node.nodeType == 3)
//             .filter(node => node.textContent.trim());
//
//         textNodes.forEach(text => {
//             if (!regex.test(text.textContent))
//                 return;
//             const [_, d] = text.textContent.match(regex);
//             text.remove();
//             render(element, data[+d]);
//         })
//     });
//     return Array.from(fragment.children);
// };
export type RenderFunction = (fragments: TemplateStringsArray, ...data: any[]) => Element ;

import {bind, wire} from "hyperhtml";
// const wire = () => '';

const wireMap = new Map<any, any>();
export const myWire = (obj, type) => {
    if (typeof obj === "object") {
        return wire(obj, type);
    }
    if (!wireMap.has(obj)) {
        wireMap.set(obj, {});
    }
    return wire(wireMap.get(obj), type);
};

export const html: (o: any, type?) => RenderFunction = (obj, key = '') => myWire(obj, key);
export const svg: (o: any, type?) => RenderFunction = (obj, key = '') => myWire(obj, `svg:${key}`);
export {
    bind
}