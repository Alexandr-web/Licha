import { TEmptyObject, } from "../types/index";

import { IPointY, IAxisYTitle, } from "./axisY";
import { IPointX, IAxisXTitle, } from "./axisX";
import { IPos, ISize, IBounds, } from "./global";
import { IFont, } from "./text";
import { IData, } from "./data";

export interface IAxisPoints {
    pointsY: Array<IPointY>;
    pointsX: Array<IPointX>;
}

export interface IAxisThemePoint {
    color: string;
}

export interface IPoint extends IPos, ISize {
    onScreen: boolean;
    value: number;
}

export interface IAxisThemeTitle {
    color: string;
}

export interface IAxisTheme {
    title: IAxisThemeTitle;
    point: IAxisThemePoint;
}

export interface IFontAxis extends IFont {
    showText?: boolean;
}

export interface IAxesData {
    values: Array<number>;
    names: Array<string | number>;
}

export interface IAxis {
    font: IFontAxis;
    sort?: "more-less" | "less-more";
}

export interface IAxisClass {
    ctx: CanvasRenderingContext2D;
    title: IAxisYTitle | IAxisXTitle | TEmptyObject;
    font: IFontAxis | TEmptyObject;
    bounds: IBounds | TEmptyObject;
    points: Array<IPointX | IPointY>;
    sortNames: "more-less" | "less-more";
    uniqueNames: Array<string | number>;
    uniqueValues: Array<number>;
    readonly gapTopAxisX: number;
    readonly gapRightAxisY: number;
    themeForPoint: IAxisThemePoint | TEmptyObject;
    themeForTitle: IAxisThemeTitle | TEmptyObject;

    getAxesData(data: IData): IAxesData;
}