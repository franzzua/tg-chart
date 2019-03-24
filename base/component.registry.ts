import {Component} from "./component";

class ComponentRegistry {
    private cache: Map<HTMLElement, Component> = new Map();
    private registrations: Map<string, IComponentRegistration> = new Map<string, IComponentRegistration>();

    public Register(name, def: IComponentRegistration) {
        def.target.template = def.template;
        if (def.style) {
            const style = document.createElement('style');
            style.innerText = def.style;
            style.setAttribute('title', name);
            document.head.appendChild(style);
        }
        customElements.define(name, def.target);
        // this.registrations.set(name, def);
        // this.createAllNodes(name, def);
    }

    private createAllNodes(name, def: IComponentRegistration) {
        Array.from(document.querySelectorAll(name))
            .filter(dom => !this.cache.has(dom))
            .forEach(dom => {
                const instance: Component = new def.target(dom);
                this.cache.set(dom, instance);
                // @ts-ignore
                // @ts-ignore
                instance.connected(def.template);
            });
    }

    public UpdateDOM() {
        // [...this.registrations.entries()].forEach(([name, constructor]) => {
        //     this.createAllNodes(name, constructor);
        // })
    }

    protected render(){

    }
}
export type IComponentRegistration = {
    target: any,
    style: string,
    template: (render, state: any, events?) => any
}

export const Registry = new ComponentRegistry();
//
// document.addEventListener('DOMContentLoaded', e => Registry.UpdateDOM());
// Registry.UpdateDOM();