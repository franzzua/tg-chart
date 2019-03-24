import {Chart} from "../../model/chart";
import {html} from "../../base/html";
import {IHandler} from "../../base/component";
import {IEvents} from "./tg-chart-component";

export function getSwitchers(chart: Chart, events: IHandler<IEvents>) {
    return html(chart, 'switchers')`
        <div class="checkers">
        ${chart.lines.map(line => html(line, 'check')`
            <label class="checker" onchange="${events.switch(e => e.target['data'])}">
        <input type="checkbox" data="${line}" checked="${line.enabled}" style="${{'border-color': line.color}}"/>
        <span>${line.name}</span>                
        </div>
            `)}        
        </div>
    `;
}