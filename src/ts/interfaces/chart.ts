import { TCapType, TEmptyObject, TTypeChart, } from "../types/index";

import { IStroke, ISize, IGaps, IPadding, IPos, IBounds, } from "./global";
import { IChartLineStyle, } from "./lineChart";
import { IFontWithText, } from "./text";
import { IData, } from "./data";
import { IAxisYClass, IAxisY, } from "./axisY";
import { IAxisXClass, } from "./axisX";
import { ILegendData, } from "./legend";

export interface IChartCapStyle {
    size: number;
    color: string | Array<string>;
    stroke: IStroke;
    format: TCapType;
}

export interface IChartStyle {
    lineStyle: IChartLineStyle;
    capStyle: IChartCapStyle;
    themeStrokeColorForCap: string;
}

export interface IChartTitle {
    font: IFontWithText;
    gaps: IGaps;
}

export interface ITitleTheme {
    color: string;
}

export interface IChartTitleData extends IChartTitle, ISize, IPos { }

export interface IChartTitleWithSizeAndPos extends IPos, ISize, IChartTitle { }

export interface IChartClass {
    readonly padding: IPadding | TEmptyObject | number;
    readonly data: IData;
    readonly ctx: CanvasRenderingContext2D;
    readonly width: number;
    readonly height: number;
    readonly title: IChartTitle | TEmptyObject;
    readonly type: TTypeChart;
    readonly defaultPadding: number;
    readonly hideGroups: Array<string>;
    readonly theme: ITitleTheme | TEmptyObject;
    titleData: IChartTitleData;

    getBounds(): IBounds;
    drawTitle(): IChartClass;
    getGapsForYPoints(axisY: IAxisYClass, axisX: IAxisXClass, chartTitle: IChartTitle, legend: ILegendData): IGaps;
    getGapsForXPoints(axisY: IAxisYClass, axisX: IAxisXClass, chart: IChartClass, legend: ILegendData): IGaps;
    getGapsForLegend(axisY: IAxisY | TEmptyObject, chartTitle: IChartTitleWithSizeAndPos): IGaps;
}