import { IFont, } from "./text";
import { ISize, IPos, IBounds, IGapsForLegend, } from "./global";
import { ILine, ILineTheme, } from "./line";
import { IData, } from "./data";
import { TEmptyObject, } from "../types/index";

export interface ILegendTheme {
    color: string;
}

export interface ILegendGapsCircle {
    right: number;
}

export interface ILegendGapsGroup {
    right: number;
    bottom: number;
}

export interface ILegendGapsLegend {
    bottom: number;
}

export interface ILegendGaps {
    circle: ILegendGapsCircle;
    group: ILegendGapsGroup;
    legend: ILegendGapsLegend;
}

export interface ICircleLegend {
    radius: number,
}

export interface ILegend {
    circle: ICircleLegend;
    font: IFont;
    gaps: ILegendGaps;
    maxCount?: number;
}

export interface IColumnLegend {
    group: string;
    color: Array<string> | string;
}

export interface IItemLegend extends ISize, IPos, IColumnLegend { }

export interface IGapsForTextLegend extends IGapsForLegend {
    top: number;
}

export interface ILegendClass {
    hideGroups: Array<string>;
    showLegend: boolean;
    line: ILine;
    font: IFont;
    data: IData;
    ctx: CanvasRenderingContext2D;
    bounds: IBounds;
    circle: ICircleLegend;
    maxCount?: number;
    legendGaps: ILegendGaps | TEmptyObject;
    totalHeight: number;
    themeForText: ILegendTheme | TEmptyObject;
    themeForCircle: ILineTheme | TEmptyObject;
    items: Array<IItemLegend>;

    draw(gaps: IGapsForLegend): ILegendClass;
}

export interface ILegendData extends ILegend, ILegendClass { }