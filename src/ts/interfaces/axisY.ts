import { IPos, ISize, IGapsForYTitle, IGapsForYPoints, } from "./global";
import { IFontWithText, } from "./text";
import { IPoint, IAxis, IAxisClass, } from "./axis";
import { IData, } from "./data";

export interface IAxisYTitle {
    font: IFontWithText;
    gapRight: number;
}

export interface IAxisYTitleData extends IAxisYTitle, IPos, ISize { }

export interface IPointY extends IPoint { }

export interface IAxisY extends IAxis {
    step?: number;
    editValue?: (value: number) => string;
    title?: IAxisYTitle;
}

export interface IAxisYClass extends IAxisClass {
    step?: number;
    editValue?: (value: number) => string | number;
    data: IData;
    sortValues?: "more-less" | "less-more";
    titleData?: IAxisYTitleData;

    drawTitle(gaps: IGapsForYTitle): IAxisYClass;
    drawPoints(gaps: IGapsForYPoints): IAxisYClass;
    getMaxTextWidthAtYAxis(): number;
}