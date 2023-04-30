import { IPos, ISize, IGaps, } from "./global";
import { IFontWithText, } from "./text";
import { IPoint, IAxis, IAxisClass, } from "./axis";
import { ILineTheme, ILine, } from "./line";
import { IData, } from "./data";
import { TAxisXPlace, TEditName, TIgnoreNames, } from "../types/index";

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
    readonly editName?: TEditName;
    readonly ignoreNames?: TIgnoreNames;
    readonly title?: IAxisXTitle;
    readonly rotate?: boolean;
    readonly place?: TAxisXPlace;
}

export interface IAxisXClass extends IAxisClass {
    readonly themeForLine: ILineTheme;
    readonly ignoreNames?: TIgnoreNames;
    readonly data: IData;
    readonly editName?: TEditName;
    readonly line: ILine;
    readonly rotate?: boolean;
    readonly place?: TAxisXPlace;
    titleData: IAxisXTitleData;

    getIgnoreNames(): Array<string | number>;
    drawTitle(): IAxisXClass;
    drawPoints(gaps: IGaps): IAxisXClass;
}