import {Chart, IChart} from "./chart";
import {data} from "./chart_data";

class AppModel {
    Charts: Chart[];

    constructor(data: IChart[]) {
        this.Charts = data.map(d => new Chart(d));
    }
}

export const App = new AppModel(data);