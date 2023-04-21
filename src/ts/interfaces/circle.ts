import { IElementClass, } from "./element";
import { IStroke, } from "./global";

export interface ICircleClass extends IElementClass {
    readonly radius: number;
    readonly stroke?: IStroke;
    readonly startY?: number;
    readonly endY?: number;

    draw(): void;
}