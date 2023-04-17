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
    readonly ctx: CanvasRenderingContext2D;
    readonly title: IAxisYTitle | IAxisXTitle | TEmptyObject;
    readonly font: IFontAxis | TEmptyObject;
    readonly bounds: IBounds | TEmptyObject;
    readonly points: Array<IPointX | IPointY>;
    readonly sortNames: "more-less" | "less-more";
    readonly uniqueNames: Array<string | number>;
    readonly uniqueValues: Array<number>;
    readonly gapTopAxisX: number;
    readonly gapRightAxisY: number;
    readonly themeForPoint: IAxisThemePoint | TEmptyObject;
    readonly themeForTitle: IAxisThemeTitle | TEmptyObject;

    getAxesData(data: IData): IAxesData;
}