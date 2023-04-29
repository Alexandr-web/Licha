import { IFont, } from "./text";
import { ISize, IPos, IBounds, IGaps, } from "./global";
import { ILine, ILineTheme, } from "./line";
import { IData, } from "./data";
import { TEmptyObject, TLegendPlace, } from "../types/index";

export interface ILegendTheme {
    readonly color: string;
}

export interface ICircleLegend {
    readonly radius: number,
}

export interface ILegendGaps {
    readonly circle: IGaps | TEmptyObject;
    readonly group: IGaps | TEmptyObject;
    readonly legend: IGaps | TEmptyObject;
}

export interface ILegendEvents {
    onClick?: () => any;
}

export interface ILegend {
    readonly circle: ICircleLegend;
    readonly font?: IFont;
    readonly gaps: ILegendGaps;
    readonly maxCount?: number;
    readonly events?: ILegendEvents | TEmptyObject;
    readonly place?: TLegendPlace;
}

export interface IColumnLegend {
    readonly group: string;
    readonly color: Array<string> | string;
}

export interface IItemLegend extends ISize, IPos, IColumnLegend { }

export interface ILegendClass {
    readonly showLegend: boolean;
    readonly line: ILine;
    readonly font?: IFont;
    readonly data: IData;
    readonly ctx: CanvasRenderingContext2D;
    readonly bounds: IBounds;
    readonly circle: ICircleLegend;
    readonly maxCount?: number;
    readonly legendGaps: ILegendGaps | TEmptyObject;
    readonly themeForText: ILegendTheme | TEmptyObject;
    readonly themeForCircle: ILineTheme | TEmptyObject;
    readonly fontFamily: string;
    readonly place?: TLegendPlace;
    hideGroups: Array<string>;
    height: number;
    items: Array<IItemLegend>;

    draw(gaps: IGaps): ILegendClass;
}

export interface ILegendData extends ILegend, ILegendClass { }