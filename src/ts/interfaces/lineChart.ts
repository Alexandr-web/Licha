import { IPointX, } from "./axisX";
import { IPointY, } from "./axisY";
import { ILine, ILineTheme, } from "./line";
import { ICap, ICapTheme, ICapData, } from "./cap";

export interface IChartLineStyle {
    readonly width: number;
    readonly color: string | Array<string>;
    readonly dotted: boolean;
    readonly stepped: boolean;
    readonly fill: Array<string> | string;
}

export interface ILineChartClass {
    readonly pointsX: Array<IPointX>;
    readonly pointsY: Array<IPointY>;
    readonly line: ILine;
    readonly cap: ICap;
    readonly sortValues: "more-less" | "less-more";
    readonly caps: Array<ICapData>;
    readonly themeForLine: ILineTheme;
    readonly themeForCaps: ICapTheme;

    draw(): ILineChartClass;
}