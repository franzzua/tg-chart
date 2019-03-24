import {Chart} from "../../model/chart";
import {animateAddRemove} from "./animate-add-remove";
import {svg} from "../../base/html";

function getOrdinate(chart: Chart, value, height: number, {min, max}) {
    const position = (max - value) / (max - min) * height;
    const result = svg(chart, `ord.${value}`)`
        <g ordinate transform="${`translate(0, ${position})`}" value="${value}">
            <line stroke-width=".3" x1="0" x2="100%"/>
            <text x="5" y="-.5em">${value}</text>
        </g>
    `;
    result['ondelete'] = () => {
        result.setAttribute('transform', `translate(0, ${chart.convertY(value) * height})`);
        result.classList.remove('new');
        result.classList.add('delete');
        // setTimeout(() => result.remove(), 1000);
    };
    result['onadd'] = () => {
        result.setAttribute('transform', `translate(0, ${chart.convertY(value) * height})`);
        result.classList.add('new');
        result.classList.remove('delete');
        // result.classList.add('new');
    };
    return result;
}

export function getOrdinates(chart: Chart, rect: ClientRect) {
    const height = rect.width * .7;
    const {min, max} = chart.getMinMax();
    const ordinates = new Array(6).fill(0).map((_, i) => min + (max - min) * i / 6);
    const items = [
        ...ordinates
            .map((value) => getOrdinate(chart, value, height, chart['minmax'] || {min, max})),
    ];
    chart['minmax'] = {min, max};
    return animateAddRemove(svg(chart, 'ordinates')`<g>${items}</g>`);
}