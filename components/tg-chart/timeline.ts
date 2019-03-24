import {IHandler} from "../../base/component";
import {IEvents} from "./tg-chart-component";
import {html} from "../../base/html";
import {canvas} from "./canvas";

export function getTimeline(chart, rect, events: IHandler<IEvents>) {
    const mouseDownHandler = events.down((e: MouseEvent & { target: Element }) => {
        return {[e.target.getAttribute('dir')]: e.pageX}
    });
    const touchstartHandler = events.down((e: TouchEvent & { target: Element }) => {
        return {[e.target.getAttribute('dir')]: e.touches[0].pageX}
    });
    const touchMoveHandler = events.move((e: TouchEvent & { target: Element }) => {
        return e.touches[0].pageX;
    });
    const mouseMoveHandler = events.move((e: MouseEvent & { target: Element }) => {
        return e.pageX;
    });
    return html(chart)`
        <div timeline  style="${{height: rect.width * .1 + 'px'}}"
            onmousedown="${mouseDownHandler}"
            ontouchstart="${touchstartHandler}" 
            onmouseup="${events.up()}" 
            onmouseleave="${events.up()}" 
            ontouchmove="${touchMoveHandler}"
            onmousemove="${mouseMoveHandler}">
            ${chart.lines.map(line => canvas(chart, line, rect))} 
            <div blur style="${{width: chart.left * 99 + '%', left: 0}}"/>   
              <div blur style="${{left: chart.right * 99 + 1 + '%', right: '0'}}"/>     
              <div dir="center" style="${{
        left: chart.left * 99 + .5 + '%',
        width: (chart.right - chart.left) * 99 + '%'
    }}"/>    
            <div dir style="${{left: chart.left * 99 + '%'}}"/>   
            <div dir="left" style="${{left: chart.left * 99 - .5 + '%'}}"/>   
            <div dir style="${{left: chart.right * 99 + '%'}}"/>     
            <div dir="right" style="${{left: chart.right * 99 - .5 + '%'}}"/>     
        </div>
    `
}