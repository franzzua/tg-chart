import {Chart} from "../../model/chart";
import {getDateFormat} from "./format.date";
import {svg} from "../../base/html";
import * as throttle from "lodash.throttle";
import {TransformMatrix} from "../../matrix/transform.matrix";

export function getStayAbscisess(chart: Chart, rect: ClientRect, isMoving) {
    const format = getDateFormat(chart, chart.left, chart.right);
    if (!isMoving) {
        chart.moveStart = {left: chart.left, right: chart.right};
    }
    const abscisses = new Array(6).fill(0)
        .map((_, i) => (i + .5) / 6)
        // .map(x => chart.left * (1 - x) + chart.right * x)
        .map(x => chart.getDate(chart.left * (1 - x) + chart.right * x));
    const transform = isMoving ? new TransformMatrix()
        .Translate(-chart[chart.last || 'left'] / (chart.right - chart.left) * rect.width, 0)
        .Scale(1 / (chart.right - chart.left) * (chart.moveStart.right - chart.moveStart.left), 1)
        .Translate(chart.moveStart[chart.last || 'left'] / (chart.moveStart.right - chart.moveStart.left) * rect.width, 0) : new TransformMatrix();
    const getX = date => ((+date - +chart.x[0]) / chart.duration - chart.moveStart.left) / (chart.moveStart.right - chart.moveStart.left);
    return svg(chart, 'absc.stay')`
        <g class="${isMoving ? 'hidden' : 'fadeIn'}">
        ${abscisses.map((val, i) => (svg(chart, `abs.val.${i}.stay`)`
            <g d transform="${transform.getTranslation(0, 0)}">
                <text x="${getX(val) * rect.width}" y="${rect.width * .7}">${format(val)}</text>
            </g>
        `))}
        </g>
        `;
}

export function getMoveAbscisess(chart: Chart, rect: ClientRect, isMoving) {
    const format = getDateFormat(chart, chart.left, chart.right);
    const left = Math.floor((chart.left - chart.moveStart.left) / (chart.right - chart.left) * 6);
    const moveAbscisses = new Array(18).fill(0)
        .map((_, i) => (i + left + .5) / 6)
        // .map(x => chart.left * (1 - x) + chart.right * x)
        .map(x => ({
            x: x,
            date: chart.getDate(chart.moveStart.left * (1 - x) + chart.moveStart.right * x)
        }));
    const moveStart = chart.moveStart;
    const transform = new TransformMatrix()
        .Translate(-chart[chart.last || 'left'] / (chart.right - chart.left) * rect.width, 0)
        .Scale(1 / (chart.right - chart.left) * (moveStart.right - moveStart.left), 1)
        .Translate(moveStart[chart.last || 'left']/ (moveStart.right - moveStart.left) * rect.width, 0);
    const getX = date => ((+date - +chart.x[0]) / chart.duration - moveStart.left) / (moveStart.right - moveStart.left);
    // const transform = TransformMatrix.Translate(-chart.left * rect.width / (chart.right - chart.left), 0);
    return svg(chart, 'absc.move')`
    <g class="${!isMoving ? 'fadeOut' : ''}">
    ${moveAbscisses.map((val, i) => svg(chart, `abs.val.${val.x}.move`)`
        <g transform="${transform.getTranslation(0, 0)}">
            <text x="${getX(val.date) * rect.width}"  y="${rect.width * .7}">${format(val.date)}</text>
        </g>
    `)}
    </g>
    `;
}

let counter = 0;
const throttleCounter = throttle(() => counter++, 100, {leading: true, trailing: true});

export function getAbscisses(chart: Chart, rect: ClientRect, isMoving: boolean) {
    // const count = throttleCounter();
    // const moving = isMoving && (count == chart['lastCounter']);
    // chart['lastCounter'] = count;
    if (!chart.moveStart)
        chart.moveStart = {left: chart.left, right: chart.right};
    return svg(chart, 'abscisses_all')`
        <g abscisses>
            ${getStayAbscisess(chart, rect, isMoving)}
            ${getMoveAbscisess(chart, rect, isMoving)}
        </g>
    `;
}