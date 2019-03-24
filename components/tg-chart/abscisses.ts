import {Chart} from "../../model/chart";
import {getDateFormat} from "./format.date";
import {svg} from "../../base/html";
import * as debounce from "lodash.debounce";

let counter = 12;
export const getStart = debounce(() => {
    return counter++;
}, 50);

export function getStayAbscisess(chart: Chart, rect: ClientRect) {
    const format = getDateFormat(chart, chart.left, chart.right);
    const moveStart = chart.moveStart;
    chart.moveStart = {left: chart.left, right: chart.right};
    const abscisses = new Array(6).fill(0)
        .map((_, i) => (i + .5) / 6)
        // .map(x => chart.left * (1 - x) + chart.right * x)
        .map(x => ({
            x: x * rect.width,
            date: chart.getDate(chart.left * (1 - x) + chart.right * x)
        }));
    const getX = date => (+date - +chart.x[0]) / chart.duration / (moveStart.right - moveStart.left) * rect.width;
    return abscisses.map((val, i) => (svg(chart, `abs.val.${i}.new`)`
        <text d transform="${`translate(${getX(val.date)},0)`}" y="${rect.width * .7}">${format(val.date)}</text>
    `));
}

export function getMoveAbscisess(chart: Chart, rect: ClientRect) {
    const format = getDateFormat(chart, chart.left, chart.right);
    const shift = Math.floor((chart.moveStart.left - chart.left) / (chart.right - chart.left) * 6);
    const moveAbscisses = new Array(10).fill(0)
        .map((_, i) => (i - shift - 1 + .5) / 6)
        // .map(x => chart.left * (1 - x) + chart.right * x)
        .map(x => ({
            x: x * rect.width,
            date: chart.getDate(chart.moveStart.left * (1 - x) + chart.moveStart.right * x)
        }));
    const getX = date => (+date - +chart.x[0]) / chart.duration / (chart.right - chart.left) * rect.width;
    return moveAbscisses.map((val, i) => (svg(chart, `abs.val.${i}.new`)`
        <text moving transform="${`translate(${getX(val.date)},0)`}" y="${rect.width * .7}">${format(val.date)}</text>
            `));
}

export function getAbscisses(chart: Chart, rect: ClientRect, isMoving: boolean) {
    if (!chart.moveStart)
        chart.moveStart = {left: chart.left, right: chart.right};
    // if (!isMoving) {
    const transform = chart.getTransform(rect.width, rect.width * .7);
    const result = svg(chart, 'abscisses')`
            <g abscisses>
                <g transform="${transform.xScaled}" class="${isMoving ? 'hidden animated' : 'fadeIn animated'}">
                ${getStayAbscisess(chart, rect)}
                </g>
                <g transform="${transform.xScaledM}" class="${!isMoving ? 'fadeOut animated' : 'fade2In animated'}">
                ${getMoveAbscisess(chart, rect)}
                </g>
            </g>
        `;
    if (!isMoving) {
    }
    return result;
}