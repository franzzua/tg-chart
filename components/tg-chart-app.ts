import "./tg-chart/tg-chart-component";
import {Component} from "../base/component";
import {component} from "../base/decorator";
import {html} from "../base/html";
import {App} from "../model/app";

const chart = chart => html(chart)`
    <tg-chart chart="${chart}" class="black"/>
`;

const template = (render, state) => render`
    <!--<tg-voronoi/>-->
    ${state.map(chart)}
`;

@component({
    style: require('./tg-chart-app.style.less'),
    name: 'tg-chart-app',
    template: template
})
export class TgChartApp extends Component {

    public get state() {
        return App.Charts;
    }
}

