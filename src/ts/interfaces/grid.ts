import { ILine, } from "./line";
import { IPointY, } from "./axisY";
import { IPointX, } from "./axisX";
import { TAxisXPlace, TEmptyObject, } from "../types/index";

export interface IGridTheme {
    color: string;
}

export interface ILineGrid extends Omit<ILine, "fill" & "stepped"> {
    stretch?: boolean;
}

export interface IGrid {
    background?: string | Array<string>;
    format?: "vertical" | "horizontal" | "default";
    line?: ILineGrid;
}

export interface IGridClass {
    maxPointYWidth: number;
    names: Array<string | number>;
    ctx: CanvasRenderingContext2D;
    pointsY: Array<IPointY>;
    pointsX: Array<IPointX>;
    showPointsX: boolean;
    showPointsY: boolean;
    line?: ILineGrid | TEmptyObject;
    format?: "vertical" | "horizontal" | "default";
    theme: IGridTheme | TEmptyObject;
    background?: string | Array<string>;
    distanceBetweenLineAndPoint: number;
    rotateAxisX: boolean;
    placeAxisX: TAxisXPlace;

    init(): IGridClass;
}