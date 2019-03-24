import {Registry} from "./component.registry";
import {strict} from "assert";

const camelToName = camel => camel.replace(/[A-Z]/g, char => `-${char.toLowerCase()}`).substr(1);
export const component = (info: IComponentInfo) => {
    return target => Registry.Register(info.name || camelToName(target.name), {
        target: target,
        style: info.style,
        template: info.template
    });
};
export type IComponentInfo = {
    name?: string | any,
    style?: string,
    template: (render, state: any, events?) => any
}


export const attr: any = (target: any, key, descriptor: PropertyDescriptor) => {
    target.constructor['attrs'] = [
        ...(target.constructor['attrs'] || []),
        key
    ];
    Object.defineProperty(target, 'initAttrs', {
        value: (dom) => {
            console.log(dom[key]);
            Object.defineProperty(dom, key, {
                get() {
                    return this.component[key] || null;
                },
                set(value) {
                    this.component[key] = value;
                }
            });
        }
    });
};