import {Chart} from "../../model/chart";
import {html, svg} from "../../base/html";
import {formatDate} from "./format.date";

export function getHover(chart: Chart, rect: ClientRect) {
    return svg(chart, 'hover')`
        <g hover hidden="${!chart.hover}">
        <line x1="${chart.hover * rect.width}" x2="${chart.hover * rect.width}"
            y1="0" y2="${rect.width * .7}" stroke-width=".3"/>
       ${chart.lines.map(line => svg(line, 'hover')`
        <circle cx="${chart.hover * rect.width}" r="6" cy="${line.hover * rect.width * .7}" 
                stroke-width="3" stroke="${line.color}"/>
        </g>
       `)}
    `;
}

export function getHoverTable(chart: Chart, rect: ClientRect) {
    return html(chart, 'hover-table')`
        <div class="hover-table" is-visible="${!!chart.hover}" style="${{left: chart.hover * rect.width + 'px'}}">
            <header>${formatDate(chart.hoveDate)}</header>
            <div class="values">
            ${chart.lines.map(line => html(line, 'hover-table')`
                <div style="${{color: line.color}}">
                    <div>${Math.round(line.hoverValue)}</div>
                    <div>${line.name}</div>
                </div>
            `)}            
            </div>
        </div>
    `;
}