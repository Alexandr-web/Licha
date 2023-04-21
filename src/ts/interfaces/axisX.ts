import { IPos, ISize, IGaps, } from "./global";
import { IFontWithText, } from "./text";
import { IPoint, IAxis, IAxisClass, } from "./axis";
import { ILineTheme, ILine, } from "./line";
import { IData, } from "./data";
import { TAxisXPlace, } from "../types/index";

export interface IAxisXTitle {
    font: IFontWithText;
    gaps: IGaps;
}

export interface IAxisXTitleData extends IAxisXTitle, IPos, ISize { }

export interface IPointX extends IPoint {
    name: number | string;
    color: string | Array<string>;
    group: string;
}

export interface IAxisX extends IAxis {
    readonly editName?: (name: number | string) => string;
    readonly ignoreNames?: ((name: number | string, index: number) => boolean) | Array<string | number>;
    readonly title?: IAxisXTitle;
    readonly rotate?: boolean;
    readonly place?: TAxisXPlace;
}

export interface IAxisXClass extends IAxisClass {
    readonly themeForLine: ILineTheme;
    readonly ignoreNames?: Array<string | number> | ((name: string | number, index: number) => boolean);
    readonly data: IData;
    readonly editName?: (name: string | number) => string;
    readonly line: ILine;
    readonly rotate?: boolean;
    readonly place?: TAxisXPlace;
    titleData: IAxisXTitleData;

    getIgnoreNames(): Array<string | number>;
    drawTitle(): IAxisXClass;
    drawPoints(gaps: IGaps): IAxisXClass;
    getCorrectName(name: string | number): string | number;
    getMaxWidthTextPoint(): number;
    getMaxHeightTextPoint(): number;
}