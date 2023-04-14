import { TEmptyObject, } from "../types/index";

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
    format: "square" | "circle";
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
    padding: IPadding | TEmptyObject | number;
    data: IData;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    title: IChartTitle | TEmptyObject;
    type: "line";
    defaultPadding: number;
    hideGroups: Array<string>;
    theme: ITitleTheme | TEmptyObject;
    titleData: IChartTitleData;

    getBounds(): IBounds;
    drawTitle(): IChartClass;
    getGapsForYPoints(axisY: IAxisYClass, axisX: IAxisXClass, chartTitle: IChartTitle, legend: ILegendData): IGaps;
    getGapsForXPoints(axisY: IAxisYClass, axisX: IAxisXClass): IGaps;
    getGapsForLegend(axisY: IAxisY | TEmptyObject, chartTitle: IChartTitleWithSizeAndPos): IGaps;
}