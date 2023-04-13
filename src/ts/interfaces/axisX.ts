import { IPos, ISize, IGaps, } from "./global";
import { IFontWithText, } from "./text";
import { IPoint, IAxis, IAxisClass, } from "./axis";
import { ILineTheme, ILine, } from "./line";
import { IData, } from "./data";

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
    editName?: (name: number | string) => string;
    ignoreNames?: ((name: number | string, index: number) => boolean) | Array<string | number>;
    title?: IAxisXTitle;
    rotate?: boolean;
}

export interface IAxisXClass extends IAxisClass {
    themeForLine: ILineTheme;
    ignoreNames?: Array<string | number> | ((name: string | number, index: number) => boolean);
    data: IData;
    editName?: (name: string | number) => string;
    line: ILine;
    titleData?: IAxisXTitleData;
    rotate?: boolean;

    getIgnoreNames(): Array<string | number>;
    drawTitle(): IAxisXClass;
    drawPoints(gaps: IGaps): IAxisXClass;
    getCorrectName(name: string | number): string | number;
    getMaxWidthTextPoint(): number;
    getMaxHeightTextPoint(): number;
}