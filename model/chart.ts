import {Line} from "./line";
import {TransformMatrix} from "../matrix/transform.matrix";

export interface IChart {
    columns: [[string, ...number[]]];
    types: { [key: string]: 'x' | 'line' };
    names: { [key: string]: 'string' };
    colors: { [key: string]: 'string' };
}

export class Chart {
    private static Id = 0;
    public id = Chart.Id++;
    hover: number;
    last: 'left' | 'right';
    moveStart: { left: number; right: number };

    constructor(data: IChart) {
        const xKey = Object.entries(data.types).find(([key, value]) => value == 'x')[0];
        const [_, ...x] = data.columns.find(([c]) => c == xKey);
        this.x = x.map(d => new Date(d));
        this.duration = +this.x[this.x.length - 1] - +this.x[0];
        this.lines = Object.entries(data.types)
            .filter(([key, value]) => value !== 'x')
            .map(([key, value]) => {
                if (value !== 'line')
                    throw new Error('supports only lines');
                const name = data.names[key];
                const color = data.colors[key];
                const [_, ...values] = data.columns.find(([cKey]) => cKey == key);
                return new Line(this, values, name, color);
            });
        const to = new Date(Math.max(...this.x.map(d => +d)));
        const from = new Date(+to - 7 * 24 * 3600 * 1000);
        this.left = (+from - +this.x[0]) / (+this.x[this.x.length - 1] - +this.x[0]);
        this.right = (+to - +this.x[0]) / (+this.x[this.x.length - 1] - +this.x[0]);
        this.partsCount = Math.ceil(this.x.length / this.partSize);
        this.lines.forEach(line => line.initPath());
        this.lines.forEach(line => line.initPaths());
    }

    x: Date[];
    duration: number;
    partsCount: number;
    partSize: number = 50;
    lines: Line[];

    // public getX(i) {
    //     return (+this.x[i] - +this.from) / (+this.to - +this.from);
    // }
    //
    public getMinMax(left = this.left, right = this.right) {
        let min = Number.POSITIVE_INFINITY, max = Number.NEGATIVE_INFINITY;
        const iFrom = Math.floor(left * (this.x.length - 1));
        const iTo = Math.ceil(right * (this.x.length - 1));
        this.lines
            .filter(line => line.enabled)
            .forEach(line => {
                for (let i = iFrom; i <= iTo; i++) {
                    if (i >= this.x.length || i < 0) continue;
                    if (line.values[i] < min) min = line.values[i];
                    if (line.values[i] > max) max = line.values[i];
                }
            });
        return {min: Math.ceil(Math.min(min, 0) / 5) * 6, max: Math.floor(max / 5) * 6};
    }

    public getOrdinates() {
        const {min, max} = this.getMinMax();
        return new Array(6).fill(0).map((_, i) => ({value: min + (max - min) * i / 5, i}));
    }

    //
    // private get iFrom() {
    //     return this.x.filter(d => d < this.from).length;
    // }
    //
    // private get iTo() {
    //     return this.x.filter(d => d < this.to).length;
    // }

    public left = .9;
    public right = 1;

    get hoverAlpha() {
        const left = (this.hover * (this.right - this.left) + this.left) * (this.x.length - 1);
        const leftI = Math.floor(left);
        const rightI = Math.ceil(left);
        const alpha = left % 1;
        return {leftI, rightI, alpha};
    }

    get hoveDate() {
        const {leftI, rightI, alpha} = this.hoverAlpha;
        return new Date(+this.x[leftI] * (1 - alpha) + +this.x[rightI] * alpha);
    }

    get viewBox() {
        return `0 0 300 300`;
    }

    //
    // public from: Date;
    // public to: Date;

    convertY(value: any) {
        const {min, max} = this.getMinMax();
        return (max - value) / (max - min)
    }


    public getScale(width, height) {
        const {min, max} = this.getMinMax(this.left, this.right);
        const from = +this.x[0] + this.duration * this.left;
        const to = +this.x[0] + this.duration * this.right;
        return Math.max(width * this.duration / (to - from), height / (max - min));
    }

    public getTransform(width, height) {
        const {min, max} = this.getMinMax(this.left, this.right);
        const from = +this.x[0] + this.duration * this.left;
        const to = +this.x[0] + this.duration * this.right;
        return {
            total: new TransformMatrix()
                .Scale(width / (this.right - this.left), height / (max - min))
                .Translate(-this.left, max),
            x: TransformMatrix.Translate(-this.left, 0),
            y: TransformMatrix.Translate(0, max),
            yScaled: TransformMatrix.Translate(0, max * height / (max - min)),
            xScaled: TransformMatrix.Translate(-this.left * width / (this.right - this.left), 0),
            xScaledM: TransformMatrix.Translate(-this.left * width / (this.right - this.left), 0),
            xScale: TransformMatrix
            // .Translate(this.last == 'left' ? width : 0, 0)
                .Scale(width / (this.right - this.left), 1),
            // .Translate(this.last == 'left' ? -width : 0, 0),
            yScale:
                new TransformMatrix()
                    .Scale(1, height / (max - min))
        }
        // return {
        //     x: `translate(${-this.left}, 0)`,
        //     y: `translate(0, ${max})`,
        //     scale: `scale(${width / (this.right - this.left)}, ${height / (max - min)})`,
        //     scaleBack: `scale(${(this.right - this.left) / width}, ${(max - min) / height })`,
        // };
    }

    getDate(x) {
        return new Date(+this.x[0] + x * this.duration);
    }

    getX(date: Date, left = this.left, right = this.right) {
        return (((+date - +this.x[0]) / this.duration) - left) / (right - left);
    }
}