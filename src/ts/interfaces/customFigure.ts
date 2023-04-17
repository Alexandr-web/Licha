import { ILineTo, } from "./line";

export interface ICustomFigureClass {
    readonly lineTo: Array<ILineTo>;
    readonly startY?: number;
    readonly endY?: number;

    draw(): void;
}