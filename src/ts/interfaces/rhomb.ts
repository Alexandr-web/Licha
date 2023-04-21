import { TEmptyObject, } from "../types/index";
import { IElementClass, } from "./element";
import { IStroke, } from "./global";

export interface IRhombClass extends IElementClass {
    readonly width: number;
    readonly height: number;
    readonly startY: number;
    readonly endY: number;
    readonly stroke?: IStroke | TEmptyObject;

    draw(): void;
}