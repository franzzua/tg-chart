import {Chart} from "../../model/chart";

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDate(date: Date) {
    return `${weekDays[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
}

export function getDateFormat(chart: Chart, left, right) {
    const from = chart.getDate(left);
    const to = chart.getDate(right);
    const duration = +to - +from;
    if (duration < 1000)
        return date => +date;
    if (duration < 1000 * 60)
        return date => Math.floor(+date / 1000);
    if (duration < 1000 * 60 * 60)
        return (date: Date) => date.toTimeString();
    if (duration < 1000 * 60 * 60 * 24)
        return (date: Date) => date.toDateString() + ` ${date.getHours()}:${date.getMinutes()}`;
    if (duration < 1000 * 60 * 60 * 24 * 7)
        return (date: Date) => `${weekDays[date.getDay()]}  ${date.getHours()}h`;
    return (date: Date) => `${months[date.getMonth()]} ${date.getDate()}`;
}