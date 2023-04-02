import { IPointX, } from "./axisX";
import { IPointY, } from "./axisY";
import { ILine, ILineTheme, } from "./line";
import { ICap, ICapTheme, ICapData, } from "./cap";

export interface IChartLineStyle {
    width: number;
    color: string | Array<string>;
    dotted: boolean;
    stepped: boolean;
    fill: Array<string> | string;
}

export interface ILineChartClass {
    pointsX: Array<IPointX>;
    pointsY: Array<IPointY>;
    line: ILine;
    cap: ICap;
    sortValues: "more-less" | "less-more";
    caps: Array<ICapData>;
    themeForLine: ILineTheme;
    themeForCaps: ICapTheme;

    draw(): ILineChartClass;
}