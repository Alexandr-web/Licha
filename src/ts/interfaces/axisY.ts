import { IPos, ISize, IGaps, } from "./global";
import { IFontWithText, } from "./text";
import { IPoint, IAxis, IAxisClass, } from "./axis";
import { IData, } from "./data";
import { TSort, } from "../types/index";

export interface IAxisYTitle {
    font: IFontWithText;
    gaps: IGaps;
}

export interface IAxisYTitleData extends IAxisYTitle, IPos, ISize { }

export interface IPointY extends IPoint { }

export interface IAxisY extends IAxis {
    readonly step?: number;
    readonly editValue?: (value: number) => string;
    readonly title?: IAxisYTitle;
}

export interface IAxisYClass extends IAxisClass {
    readonly step?: number;
    readonly editValue?: (value: number) => string | number;
    readonly data: IData;
    readonly sortValues?: TSort;
    titleData?: IAxisYTitleData;

    drawTitle(): IAxisYClass;
    drawPoints(gaps: IGaps): IAxisYClass;
    getMaxTextWidthAtYAxis(): number;
}