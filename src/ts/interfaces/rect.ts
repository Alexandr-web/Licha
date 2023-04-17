import { IStroke, } from "./global";

export interface IRectClass {
    readonly width: number;
    readonly height: number;
    readonly startY: number;
    readonly endY: number;
    readonly stroke?: IStroke | object;

    draw(): void;
}