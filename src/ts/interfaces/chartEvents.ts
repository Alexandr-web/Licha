import { TEmptyObject, TUpdate, } from "../types/index";
import { IAxisPoints, } from "./axis";
import { IAxisX, } from "./axisX";
import { IAxisY, } from "./axisY";
import { IBlockInfo, } from "./blockInfo";
import { ICanvasClass, } from "./canvas";
import { IChartClass, } from "./chart";
import { IData, } from "./data";
import { IBounds, } from "./global";
import { IItemLegend, ILegend, ILegendClass, } from "./legend";
import { ILichaClass, } from "./licha";
import { ITheme, } from "./utils";

export interface IChartEventsClass {
    readonly blockInfo?: IBlockInfo | TEmptyObject;
    readonly axisX?: IAxisX | TEmptyObject;
    readonly axisY?: IAxisY | TEmptyObject;
    readonly theme?: ITheme | TEmptyObject;
    readonly data: IData;
    readonly legend?: ILegend | TEmptyObject;
    readonly lichaContext: ILichaClass;
    readonly update: TUpdate;
    readonly fontFamily: string;
    focusPosX: number | null;

    windowResize(): void;
    mousemoveByCanvas(canvas: ICanvasClass, bounds: IBounds, { pointsX, pointsY, }, eventName: string): void;
    leavemouseFromCanvasArea(canvas: ICanvasClass): void;
    leavetouchFromCanvasArea(): void;
    clickByCanvasArea(canvas: ICanvasClass, legendItems: Array<IItemLegend>, eventName: string): void;
    init(canvas: ICanvasClass, chart: IChartClass, points: IAxisPoints, legend: ILegendClass): void;
}