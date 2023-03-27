import { IStroke, } from "./global";

export interface IRectClass {
    width: number;
    height: number;
    startY: number;
    endY: number;
    stroke?: IStroke | object;

    draw(): void;
}