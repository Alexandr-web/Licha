import { IDefaultParams, } from "../interfaces/global";

const defaultParams: IDefaultParams = {
    titleFont: {
        size: 18,
        weight: 600,
    },
    textFont: {
        size: 16,
        weight: 400,
    },
    gapTopAxisX: 10,
    axisX: {
        sort: "less-more",
        place: "bottom",
    },
    axisY: {
        sort: "less-more",
        place: "left",
    },
    grid: { format: "default", },
    legend: { place: "center", },
    fontFamily: "Arial",
    typeChart: "line",
    chartTitle: { place: "center", },
};

export default defaultParams;