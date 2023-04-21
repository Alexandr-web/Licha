import { IElementClass, } from "./element";
import { IStroke, } from "./global";

export interface IRectClass extends IElementClass {
    readonly width: number;
    readonly height: number;
    readonly startY: number;
    readonly endY: number;
    readonly stroke?: IStroke | object;

    draw(): void;
}