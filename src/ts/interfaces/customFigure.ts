import { ILineTo, } from "./line";

export interface ICustomFigureClass {
    lineTo: Array<ILineTo>;
    startY?: number;
    endY?: number;

    draw(): void;
}