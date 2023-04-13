import { IFont, } from "./text";
import { ISize, IPos, IBounds, IGaps, } from "./global";
import { ILine, ILineTheme, } from "./line";
import { IData, } from "./data";
import { TEmptyObject, } from "../types/index";

export interface ILegendTheme {
    color: string;
}

export interface ICircleLegend {
    radius: number,
}

export interface ILegendGaps {
    circle: IGaps | TEmptyObject;
    group: IGaps | TEmptyObject;
    legend: IGaps | TEmptyObject;
}

export interface ILegendEvents {
    onClick?: () => any;
}

export interface ILegend {
    circle: ICircleLegend;
    font: IFont;
    gaps: ILegendGaps;
    maxCount?: number;
    events?: ILegendEvents | TEmptyObject;
}

export interface IColumnLegend {
    group: string;
    color: Array<string> | string;
}

export interface IItemLegend extends ISize, IPos, IColumnLegend { }

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

    draw(gaps: IGaps): ILegendClass;
}

export interface ILegendData extends ILegend, ILegendClass { }