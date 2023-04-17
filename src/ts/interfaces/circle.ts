import { IStroke, } from "./global";

export interface ICircleClass {
    readonly radius: number;
    readonly stroke?: IStroke;
    readonly startY?: number;
    readonly endY?: number;

    draw(): void;
}