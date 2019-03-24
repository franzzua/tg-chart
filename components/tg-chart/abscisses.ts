import {Chart} from "../../model/chart";
import {getDateFormat} from "./format.date";
import {svg} from "../../base/html";
import * as debounce from "lodash.debounce";
import {TransformMatrix} from "../../matrix/transform.matrix";

let counter = 12;
export const getStart = debounce(() => {
    return counter++;
}, 50);

export function getStayAbscisess(chart: Chart, rect: ClientRect, isMoving) {
    const format = getDateFormat(chart, chart.left, chart.right);
    const moveStart = chart.moveStart;
    if (!isMoving) {
        chart.moveStart = {left: chart.left, right: chart.right};
    }
    const abscisses = new Array(6).fill(0)
        .map((_, i) => (i + .5) / 6)
        // .map(x => chart.left * (1 - x) + chart.right * x)
        .map(x => chart.getDate(chart.left * (1 - x) + chart.right * x));
    console.log(chart.moveStart, moveStart);
    const transform = new TransformMatrix()
        .Translate(-chart[chart.last || 'left'] / (chart.right - chart.left)*rect.width, 0)
        .Scale(1 / (chart.right - chart.left)  * (moveStart.right - moveStart.left), 1)
        .Translate(moveStart[chart.last || 'left'] / (moveStart.right - moveStart.left)*rect.width, 0);
    const getX = date => ((+date - +chart.x[0]) / chart.duration - moveStart.left) / (moveStart.right - moveStart.left);
    return svg(chart, 'absc.stay')`
    <g class="${isMoving ? 'hidden' : 'hidden fadeIn animated'}">
    ${abscisses.map((val, i) => (svg(chart, `abs.val.${i}.stay`)`
        <g transform="${transform.getTranslation(getX(val)*rect.width, 0)}">
            <text y="${rect.width * .7}">${format(val)}</text>
        </g>
    `))}
    </g>
    `;
}

export function getMoveAbscisess(chart: Chart, rect: ClientRect, isMoving) {
    const format = getDateFormat(chart, chart.left, chart.right);
    const shift = Math.floor((chart.moveStart.left - chart.left) / (chart.right - chart.left) * 6);
    const count = Math.floor((chart.right - chart.left) / (chart.moveStart.right - chart.moveStart.left) * 6) + 4;
    console.log(shift, count);
    const moveAbscisses = new Array(count + shift).fill(0)
        .map((_, i) => (i - shift - 1 + .5) / 6)
        // .map(x => chart.left * (1 - x) + chart.right * x)
        .map(x => ({
            x: x,
            date: chart.getDate(chart.moveStart.left * (1 - x) + chart.moveStart.right * x)
        }));
    const getX = date => (+date - +chart.x[0]) / chart.duration / (chart.right - chart.left) * rect.width;
    const transform = chart.getTransform(rect.width, rect.width * .7);
    return svg(chart, 'absc.move')`
    <g transform="${transform.xScaled}" class="${!isMoving ? 'hidden' : ''}">
    ${moveAbscisses.map((val, i) => svg(chart, `abs.val.${val.x}.move`)`
        <g >
            <text  transform="${`translate(${getX(val.date)},0)`}" y="${rect.width * .7}">${format(val.date)}</text>
        </g>
    `)}
    </g>
    `;
}

export function getAbscisses(chart: Chart, rect: ClientRect, isMoving: boolean) {
    if (!chart.moveStart)
        chart.moveStart = {left: chart.left, right: chart.right};
    return svg(chart, 'abscisses_all')`
        <g abscisses>
            ${getStayAbscisess(chart, rect, isMoving)}
            ${getMoveAbscisess(chart, rect, isMoving)}
        </g>
    `;
}