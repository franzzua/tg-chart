import {Component, IHandler} from "../base/component";
import {svg} from "../base/html";
import Voronoi from "voronoi/rhill-voronoi-core.js"
import {component} from "../base/decorator";

const moveHandler = (e: MouseEvent) => {
    if (!e.which)
        return [];
    return [e.target['data'], {
        x: e.layerX,
        y: e.layerY
    }];
};

const template = (render, state: IState, events: IHandler<IEvents>) => render`
    <svg width="100%" height="100%" viewBox="0 0 600 252">
        <g stroke="white" fill="red" stroke-width="3" 
        onclick="${events.add<MouseEvent>(e => ({x: e.pageX, y: e.pageY}))}">
        ${state.cells.map(cell => svg(`cell.${cell.site.id}`)`
            <path d="${cellToPath(cell)}" fill="${cell.site.color}"/>
        `)}
        </g>
        <g >
        ${state.cells.map(cell => svg(`site.${cell.site.id}`)`
            <g transform="${`translate(${cell.site.x},${cell.site.y})`}">
                <circle r="3" fill="black"/>
                <circle r="15" fill="transparent" hover cursor="pointer" data="${cell.site.id}" 
                onclick="${events.delete<MouseEvent>(e => e.target['data'])}"
                onmousemove="${events.move<MouseEvent>(moveHandler)}"/>
            </g>
        `)}
        </g>
        <g stroke="white" stroke-width="0">
        ${state.edges.map(edge => svg({})`
            <path d="${"M" + edgeToPath(edge)}"/>
        `)}
        </g>
    </svg>
`;

@component({
    name: 'tg-voronoi',
    style: 'path {transition: .5s ease-out; } [hover]:hover{fill: rgba(170,10,20,.3); cursor: move;}',
    template: template
})
export class TgVoronoi extends Component<IState, IEvents> {
    private voronoi = new Voronoi();

    private pointToColor(point: IPoint) {
        const hue = (point.x - this.bbox.xl) / (this.bbox.xr - this.bbox.xl) * 120 + 100;
        const light = (this.bbox.yb - point.y) / (this.bbox.yb - this.bbox.yt) * 40 + 50;
        return `hsl(${hue},40%,${light}%)`;
    }

    private points = JSON.parse(localStorage.points || 'null') || [
        {x: 20, y: 30},
        {x: 120, y: 130},
        {x: 420, y: 130},
        {x: 460, y: 30},
        {x: 520, y: 230},
        {x: 180, y: 250},
        {x: 300, y: 90}
    ];

    private bbox = {xl: 0, xr: 600, yt: 0, yb: 252};

    private diagram;

    private updateDiagram() {
        localStorage.setItem('points', JSON.stringify(this.points));
        this.diagram = this.voronoi.compute(this.points.map((point, i) => ({
            ...point,
            id: i,
            color: this.pointToColor(point)
        })), this.bbox);
    }

    protected get state() {
        this.updateDiagram();
        return this.diagram;
    }

    private viewToInner(p: IPoint) {
        const rect = this.getBoundingClientRect();
        return {
            x: (p.x - rect.left) / rect.width * (this.bbox.xr - this.bbox.xl),
            y: (p.y - rect.top) / rect.height * (this.bbox.yb - this.bbox.yt)
        }
    }

    protected events = {
        delete: (pointId: number) => {
            this.points.splice(pointId, 1);
        },
        move: (pointId: number, p: IPoint) => {
            if (!pointId && !p) return;
            this.points[pointId] = this.viewToInner(p);
        },
        add: (p: IPoint) => {
            this.points.push(this.viewToInner(p));
        }
    }
}


function pointToPath(p: IPoint) {
    return `${p.x} ${p.y}`;
}

function edgeToPath(p: IEdge, site?: ISite) {
    if (p.lSite == site)
        return pointToPath(p.va) + ' L ' + pointToPath(p.vb);
    return pointToPath(p.vb) + ' L ' + pointToPath(p.va);
}

function cellToPath(cell: ICell) {
    return 'M' + cell.halfedges.map((e, i) => {
        return edgeToPath(e.edge, cell.site);
    }).join(' L ') + 'Z';
}

interface IEvents {
    add(p: IPoint);

    delete(pointId: number);

    move(pointId: number, p: IPoint);
}

interface IPoint {
    x: number;
    y: number
}


interface IEdge {
    lSite: ISite;
    rSite: ISite;
    va: IPoint;
    vb: IPoint
}

type ISite = IPoint & { color: string; id: number; };

interface ICell {
    site: ISite;
    halfedges: { edge: IEdge }[];
}

interface IState {
    edges: IEdge[]
    cells: ICell[];
}