import {Line} from "../../model/line";
import {svg} from "../../base/html";
import {Chart} from "../../model/chart";
import {animateAddRemove, animateFadeOut} from "./animate-add-remove";
import {getAbscisses} from "./abscisses";

function pathRender(d, disabled, line: Line, i) {
    const result = svg(line, `path.${i}`)`
        <path disabled="${disabled}" hidden="${!line.enabled}" stroke="${line.color}" fill="none"/>
    ` as SVGPathElement;
    result.setAttribute('d', d);
    return result;
}

export function lineRender(chart: Chart, line: Line, rect: ClientRect) {
    return line.paths.map((path, i) => pathRender(path.path, (path.left > chart.right) || (chart.left > path.right), line, i));
}


export function getPlot(chart: Chart, rect: ClientRect, isMoving) {
    const {min, max} = chart.getMinMax();
    const ordinates = new Array(6).fill(0)
        .map((_, i) => (i / 6))
        .map(y => ({
            y: (1 - y) * rect.width * .7,
            value: min + (max - min) * y
        }));
    const transform = chart.getTransform(rect.width, rect.width * .7);
    return svg(chart, 'plot')`

        <g plot transform="${transform.total}">
             ${chart.lines.map(line => lineRender(chart, line, rect))}
        </g>
        <g ordinates>
            <g transform="${transform.yScale.Apply(transform.y)}">
              ${animateAddRemove(
        svg(chart, 'ordinates')`
                    <g>
                        ${ordinates.map((val, i) => animateFadeOut(svg(chart, `ord.${i}`)`
                        <g d transform="${transform.yScale.Apply(transform.y).Inverse().Translate(0, val.y)}" class="animated">
                            <line x1="0" x2="${rect.width}"/>
                            <text x="2">${val.value}</text>
                        </g>
                        `))}
                    </g>
                `)}
            </g>
        </g>
       ${getAbscisses(chart, rect, isMoving)}
`;
}