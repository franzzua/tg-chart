const ResizeObserverName = 'ResizeObserver';


export class ResizeObserver {
    static constr: Promise<any>;
    private instance: Promise<any>;

    constructor(handler) {
        this.instance = ResizeObserver.constr.then(constr => new constr(handler));
    }

    public observe(el: Element) {
        this.instance.then(inst => inst.observe(el));
    }

}

if (!(ResizeObserverName in window)) {
    ResizeObserver.constr = fetch('https://cdn.jsdelivr.net/npm/resize-observer-polyfill@1.5.1/dist/ResizeObserver.min.js')
        .then(s => s.text())
        .then(src => {
            const script = document.createElement('script');
            script.textContent = src;
            document.head.appendChild(script);
            return window[ResizeObserverName];
        })
        .then(e => window[ResizeObserverName])
} else {
    ResizeObserver.constr = Promise.resolve(window[ResizeObserverName])
}