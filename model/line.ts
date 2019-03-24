import {Chart} from "./chart";

export class Line {
    path: string;
    paths: { path: string; left; right; }[];
    enabled: boolean = true;

    public getPaths(left, right) {
        return this.paths;
    }

    constructor(private chart: Chart,
                public values: number[],
                public  name,
                public color) {
    }

    public initPaths() {
        this.paths = new Array(this.chart.partsCount).fill(0).map((_, i) => ({
            path: 'M' + this.values
                .slice(i * this.chart.partSize, (i + 1) * this.chart.partSize + 1)
                .map((value, j) => ({
                    x: (+this.chart.x[j + i * this.chart.partSize] - +this.chart.x[0]) / this.chart.duration,
                    y: -value,//this.chart.convertY(value)
                }))
                .map((p,) => `${p.x} ${p.y}`).join(' L '),
            left: (+this.chart.x[i] - +this.chart.x[0]) / this.chart.duration,
            right: (+this.chart.x[Math.min((i + 1) * this.chart.partSize + 1, this.chart.x.length - 1)] - +this.chart.x[0]) / this.chart.duration,
        }));
    }

    public initPath() {
        this.path = 'M' + this.values
            .map((value, i) => ({
                x: (+this.chart.x[i] - +this.chart.x[0]) / this.chart.duration,
                y: -value,//this.chart.convertY(value)
            }))
            .map(p => `${p.x} ${p.y}`).join(' L ');
    }

    getValues(left = 0, right = 1) {
        const from = +this.chart.x[0] + this.chart.duration * left;
        const to = +this.chart.x[0] + this.chart.duration * right;
        const {min, max} = this.chart.getMinMax(left, right);
        return this.values
            .map((value, i) => ({
                x: (+this.chart.x[i] - from) / (to - from),
                y: (max - value) / (max - min)
            }))
    }

    private counter = 0;

    public getPath(width, height, left = 0, right = 1) {
        // const profileKey = `path.${this.name}.${this.counter++}`;
        // console.time(profileKey);
        const values = this.getValues(left, right);
        const path = 'M' + values
            .filter(p => (p.x >= -1) && (p.x <= 2))
            .map(p => `${Math.round(p.x * width)} ${Math.round(p.y * height)}`).join(' L ');
        // console.timeEnd(profileKey);
        return {
            path,
        }
    }

    get hover() {
        const {min, max} = this.chart.getMinMax();
        const value = this.hoverValue;
        return (max - value) / (max - min);
    }

    get hoverValue() {
        const {leftI, rightI, alpha} = this.chart.hoverAlpha;
        return this.values[leftI] * (1 - alpha) + this.values[rightI] * alpha;
    }
}