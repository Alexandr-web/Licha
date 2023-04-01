import { ILine, } from "./line";
import { IPointY, } from "./axisY";
import { IPointX, } from "./axisX";

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
    line?: ILineGrid;
    format?: "vertical" | "horizontal" | "default";
    theme: IGridTheme;
    background?: string | Array<string>;
    distanceBetweenLineAndPoint: number;

    init(): IGridClass;
}