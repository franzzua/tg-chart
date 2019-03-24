import {Component} from "../../base/component";
import {attr, component} from "../../base/decorator";
import {Chart} from "../../model/chart";
import {template} from "./tg-chart-template";
import {ResizeObserver} from './resize-observer';
import {Line} from "../../model/line";


@component({
    template: template,
    style: require('./tg-chart-style.less'),
    name: 'tg-chart'
})
export class TgChartComponent extends Component<IState, IEvents> {
    private left: number = -100;
    private rect: ClientRect;
    private isDark: boolean = true;

    protected connectedCallback() {
        this.rect = this.getBoundingClientRect();
        new ResizeObserver(() => {
            this.rect = this.getBoundingClientRect();
            this.render();
        }).observe(this);
        super.connectedCallback();
    }

    protected get state(): IState {
        return {
            chart: this.chart,
            rect: this.rect,
            theme: this.isDark ? 'dark' : 'light',
            isMoving: !!this.lastDrag
        };
    };

    @attr
    chart: Chart = null;


    private lastDrag: { left?, right?, center? } = null;

    private minDiff = 0.03
    protected events = {
        switchTheme: () => {
            this.isDark = !this.isDark;
            this.render();
        },
        hover: (data: { pageX, pageY }) => {
            if (!data) {
                this.chart.hover = null;
                this.render();
                return;
            }
            const rect = this.rect;
            this.chart.hover = (data.pageX - rect.left) / rect.width;
            this.render();
        },
        move: (drag: number) => {
            if (!this.lastDrag)
                return;
            const rect = this.rect;
            if (this.lastDrag.left) {
                this.chart.left = this.chart.left + (drag - this.lastDrag.left) / rect.width;
                if (this.chart.left < 0)
                    this.chart.left = 0;
                if (this.chart.left > this.chart.right - this.minDiff)
                    this.chart.left = this.chart.right - this.minDiff;
                this.lastDrag.left = drag;
                this.chart.last = 'left'
            }
            if (this.lastDrag.right) {
                this.chart.right += (drag - this.lastDrag.right) / rect.width;
                if (this.chart.right > 1)
                    this.chart.right = 1;
                if (this.chart.right < this.chart.left + this.minDiff)
                    this.chart.right = this.chart.left + this.minDiff;
                this.lastDrag.right = drag;
                this.chart.last = 'right'
            }
            if (this.lastDrag.center) {
                let shift = (drag - this.lastDrag.center) / rect.width;
                if (this.chart.left + shift < 0) shift = -this.chart.left;
                if (this.chart.right + shift > 1) shift = 1 - this.chart.right;
                this.chart.left += shift;
                this.chart.right += shift;
                this.lastDrag.center = drag;
            }
            this.render();
        },
        down: (drag: { left, right, center }) => {
            this.lastDrag = drag;
        },
        up: () => {
            this.lastDrag = null;
            console.log('up');
            this.render();
        },
        switch: (line: Line) => {
            line.enabled = !line.enabled;
            this.render();
        }
    }
}

export interface IState {
    chart: Chart;
    rect: ClientRect;
    theme: string;
    isMoving: boolean;
}

export interface IEvents {
    move(drag: number);

    hover({pageX, pageY});

    switchTheme();

    up();

    switch(line);

    down(drag: { left, right, center });
}

//
// const remove = SVGElement.prototype.remove;
// Element.prototype.remove = function () {
//     this.setAttribute('fill', 'red');
//     console.log('remove');
//     setTimeout(() => remove.call(this), 500);
// };
// const removeChild = SVGElement.prototype.removeChild;
// Element.prototype.removeChild = function (oldChild) {
//     console.log('remove');
//     setTimeout(() => removeChild.call(this, oldChild), 500);
//     return this;
// };