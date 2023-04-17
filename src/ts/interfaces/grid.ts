import { ILine, } from "./line";
import { IPointY, } from "./axisY";
import { IPointX, } from "./axisX";
import { TAxisXPlace, TEmptyObject, } from "../types/index";

export interface IGridTheme {
    readonly color: string;
}

export interface ILineGrid extends Omit<ILine, "fill" & "stepped"> {
    readonly stretch?: boolean;
}

export interface IGrid {
    readonly background?: string | Array<string>;
    readonly format?: "vertical" | "horizontal" | "default";
    readonly line?: ILineGrid;
}

export interface IGridClass {
    readonly maxPointYWidth: number;
    readonly names: Array<string | number>;
    readonly ctx: CanvasRenderingContext2D;
    readonly pointsY: Array<IPointY>;
    readonly pointsX: Array<IPointX>;
    readonly showPointsX: boolean;
    readonly showPointsY: boolean;
    readonly line?: ILineGrid | TEmptyObject;
    readonly format?: "vertical" | "horizontal" | "default";
    readonly theme: IGridTheme | TEmptyObject;
    readonly background?: string | Array<string>;
    readonly distanceBetweenLineAndPoint: number;
    readonly rotateAxisX: boolean;
    readonly placeAxisX: TAxisXPlace;

    init(): IGridClass;
}