import {Chart} from "../../model/chart";
import {svg} from "../../base/html";
import {getDateFormat} from "./format.date";
import {animateAddRemove} from "./animate-add-remove";

function getAbsciss(chart: Chart, rect: ClientRect, x: number, {left, right}, format) {

    const date = chart.getDate(left * (1 - x) + right * x);
    const position = chart.getX(date) * rect.width;
    const result = svg(chart, `absc.${x}`)`
        <text key="${x}" transform="${`translate(${position}, 0)`}">${format(date)}</text>
` as SVGTextElement;
    result['onadd'] = () => {
        const position = chart.getX(date) * rect.width;
        result.setAttribute('transform', `translate(${position}, 0)`);
        result.classList.add('new');
        result.classList.remove('delete');
    };
    result['ondelete'] = () => {
        const position = chart.getX(date) * rect.width;
        result.setAttribute('transform',`translate(${position}, 0)`);
        result.classList.remove('new');
        result.classList.add('delete');
        setTimeout(() => {
            const position = chart.getX(date) * rect.width;
            result.setAttribute('transform',`translate(${position}, 0)`);
        }, 100);
    };
    return result;
}

export function getAbscisses(chart: Chart, rect: ClientRect) {
    const leftright = {left: chart.left, right: chart.right};
    const format = getDateFormat(chart, leftright.left, leftright.right);
    const abscisses = new Array(18).fill(0).map((_, i) => getAbsciss(chart, rect, (i - 6 + .5) / 6, chart['leftright'] || leftright, format));
    chart['leftright'] = leftright;
    return (svg(chart, 'abscisses')`
        <g transform="${`translate(${chart.left},${rect.width * .7})`}">
            <g abscisses>${abscisses}</g>
        </g>
    `);
}