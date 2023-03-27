import { IStroke, } from "./global";

export interface ICircleClass {
    radius: number;
    stroke?: IStroke;
    startY?: number;
    endY?: number;

    draw(): void;
}