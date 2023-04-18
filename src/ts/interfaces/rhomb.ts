import { TEmptyObject, } from "../types/index";
import { IStroke, } from "./global";

export interface IRhombClass {
    readonly width: number;
    readonly height: number;
    readonly startY: number;
    readonly endY: number;
    readonly stroke?: IStroke | TEmptyObject;

    draw(): void;
}