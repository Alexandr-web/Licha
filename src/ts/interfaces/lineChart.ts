import { IPointX, } from "./axisX";
import { IPointY, } from "./axisY";
import { ILine, ILineTheme, } from "./line";
import { ICap, ICapTheme, ICapData, } from "./cap";
import { IChartClass, } from "./chart";
import { TSort, } from "../types/index";

export interface IChartLineStyle {
    readonly width: number;
    readonly color: string | Array<string>;
    readonly dotted: boolean;
    readonly stepped: boolean;
    readonly fill: Array<string> | string;
}

export interface ILineChartClass extends IChartClass {
    readonly pointsX: Array<IPointX>;
    readonly pointsY: Array<IPointY>;
    readonly line: ILine;
    readonly cap: ICap;
    readonly sortValues: TSort;
    readonly caps: Array<ICapData>;
    readonly themeForLine: ILineTheme;
    readonly themeForCaps: ICapTheme;

    draw(): ILineChartClass;
}