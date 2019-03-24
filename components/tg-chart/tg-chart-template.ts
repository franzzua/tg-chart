import {IHandler} from "../../base/component";
import {IEvents, IState} from "./tg-chart-component";
import {getAbscisses} from "./absciss";
import {getHover, getHoverTable} from "./hover";
import {getOrdinates} from "./ordinate";
import {getPlot} from "./plot";
import {getTimeline} from "./timeline";
import {getSwitchers} from "./switchers";

export const template = (render, state: IState, events: IHandler<IEvents>) => {
    if (!state || !state.chart)
        return render`no-data!`;
    return render`
        <div class="${state.theme}">
        <header>${state.chart.lines.map(line => line.name).join(' & ')}</header>
        <svg class="plot" 
             onmousemove="${events.hover()}"
             onmouseleave="${events.hover(e => null)}"
             style="${{height: state.rect.width * .7 + 40 + 'px'}}">
            ${getPlot(state.chart, state.rect, state.isMoving)}
            ${' ' || getAbscisses(state.chart, state.rect)}
            ${' ' || getOrdinates(state.chart, state.rect)}
            ${getHover(state.chart, state.rect)}
            </g>
        </svg>
         ${getHoverTable(state.chart, state.rect)}
         ${getTimeline(state.chart, state.rect, events)}
        ${getSwitchers(state.chart, events)}
        <button class="theme-button" onclick="${events.switchTheme()}">Switch to ${state.theme == 'dark' ? 'Day' : 'Night'} Mode</button>
        </div>  
    `;
};