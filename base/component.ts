import {bind} from "./html";

export abstract class Component<TState = any, TEvents = any> extends HTMLElement {
    private static template;

    protected state: TState;

    protected connectedCallback() {
        const key = `render.${this.constructor.name}`;
        const renderFn = () => (this.constructor as typeof Component).template(bind(this), this.state, this.eventsProxy);
        this.render = () => requestAnimationFrame(renderFn);
        renderFn();
    }

    protected disconnected() {
    }

    protected render: () => void;

    protected events: Partial<TEvents>;

    private eventsProxy = new Proxy((event: keyof TEvents, args: any[]) => {
        if (!Array.isArray(args)) args = [args];
        if (event in this.events) {
            (this.events[event] as any)(...args);
        }
    }, {
        get(target, key: keyof TEvents, receiver) {
            return (mapping?: (e: Event) => any[] | void) => {
                return event => {
                    event.preventDefault();
                    target(key, mapping ? mapping(event) || [] : [event]);
                    return false;
                }
            };
        }
    })
}

export type IHandler<TEvents> = {
    [key in keyof TEvents]: <TEvent extends Event = Event>(mapping?: (e: TEvent) => any[] | void | any) => Function;
}
