import {Chart} from "../../model/chart";
import {Line} from "../../model/line";
import {html} from "../../base/html";

export function canvas(chart: Chart, line: Line, rect: ClientRect) {
    const canvas = html(chart.id, `canvas.${line.name}`)`<canvas hidden="${!line.enabled}"/>` as HTMLCanvasElement;
    if (canvas.width != Math.floor(rect.width) || canvas.height != Math.floor(rect.width / 10)) {
        canvas.width = rect.width;
        canvas.height = rect.width / 10;
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        const path2d = new Path2D(line.getPath(canvas.width, canvas.height).path);
        context.strokeStyle = line.color;
        context.stroke(path2d);
    }
    return canvas;
}