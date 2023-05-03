import { IAxisX, IAxisXClass, } from "./axisX";
import { IAxisYClass, } from "./axisY";
import { IChartClass, IChartTitle, IChartTitleData, } from "./chart";
import { IData, } from "./data";
import { IGaps, } from "./global";
import { ILegendClass, ILegendData, } from "./legend";

export interface IGapsClass {
    readonly data: IData;
    readonly fontFamily: string;
    readonly ctx: CanvasRenderingContext2D;

    getGapsForYPoints(axisY: IAxisYClass, axisX: IAxisXClass, chartTitle: IChartTitle, legend: ILegendData): IGaps;
    getGapsForXPoints(axisY: IAxisYClass, axisX: IAxisXClass, chart: IChartClass, legend: ILegendData): IGaps;
    getGapsForLegend(chartTitle: IChartTitleData): IGaps;
    getGapsForAxisYTitle(chartTitle: IChartTitleData, legend: ILegendClass, axisX: IAxisX, names: Array<string | number>): IGaps;
}