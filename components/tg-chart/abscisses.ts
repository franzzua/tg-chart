import {Chart} from "../../model/chart";
import {getDateFormat} from "./format.date";
import {svg} from "../../base/html";

export function getStayAbscisess(chart: Chart, rect: ClientRect, isMoving, transforms, getX) {
    const format = getDateFormat(chart, chart.left, chart.right);
    return new Array(6).fill(0)
        .map((_, i) => (i + .5) / 6)
        .map((x, i) => svg(chart, `abs.val.${i}.stay`)`
            <text x="${x * rect.width}"
            y="${rect.width * .7}" 
            class="${isMoving ? 'hidden' : 'fadeIn'}">${format(chart.getDate(x))}</text>
    `);
}

export function getMoveAbscisess(chart: Chart, rect: ClientRect, isMoving, transforms, getX) {
    const format = getDateFormat(chart, chart.left, chart.right);
    const left = Math.floor((chart.left - chart.moveStart.left) / (chart.moveStart.right - chart.moveStart.left) * 6);
    // const right = Math.ceil((chart.right - chart.moveStart.left) / (chart.moveStart.right - chart.moveStart.left) * 6);
    // const size = Math.round((right - left) / 6);
    // console.log(left, right, size);
    const dateToX = date => {
        const x = chart.getX(date);
        return (x - chart.moveStart.left) / (chart.moveStart.right - chart.moveStart.left);
    };
    return new Array(8).fill(0)
        .map((_, i) => (i + left - 1 + .5) / 6)
        .map(x => chart.getDate(chart.moveStart.left * (1 - x) + chart.moveStart.right * x))
        .map(date => ({date, x: chart.getX(date)}))
        .map(({date, x}, i) => svg(chart, `abs.val.${i}.move`)`
            <text delay="${!isMoving}" transform="${transforms.absciss.getTranslation(x * rect.width, 0)}"
             y="${rect.width * .7}" val="${x}"
            class="${!isMoving ? 'fadeOut' : ''}">${format(date)}</text>
        `);
}


export function getAbscisses(chart: Chart, rect: ClientRect, isMoving: boolean, transform) {
    // const count = throttleCounter();
    // const moving = isMoving && (count == chart['lastCounter']);
    // chart['lastCounter'] = count;
    if (!isMoving) {
        chart.moveStart = {left: chart.left, right: chart.right};
    }
    transform = chart.getTransform(rect.width, rect.height);
    const moveStart = chart.moveStart;
    const getX = date => chart.last == "right"
        ? rect.width - ((moveStart.right - (+date - +chart.x[0]) / chart.duration)) / (moveStart.right - moveStart.left) * rect.width
        : (((+date - +chart.x[0]) / chart.duration) - moveStart.left) / (moveStart.right - moveStart.left) * rect.width;
    return svg(chart, 'abscisses_all')`
        <g abscisses transform="${transform.xScaled}">
            ${getMoveAbscisess(chart, rect, isMoving, transform, getX)}
         </g>
        <g abscisses >
       ${getStayAbscisess(chart, rect, isMoving, transform, getX)}
         </g>
    `;
}