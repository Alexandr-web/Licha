import { IElementClass, } from "./element";
import { ILineTo, } from "./line";

export interface ICustomFigureClass extends IElementClass {
    readonly lineTo: Array<ILineTo>;
    readonly startY?: number;
    readonly endY?: number;

    draw(): void;
}