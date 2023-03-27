import { IStroke, IPos, } from "./global";

export interface ICapTheme {
    color?: Array<string>;
    strokeColor?: Array<string>;
}

export interface ICap {
    format?: "square" | "circle";
    color?: string;
    size?: number;
    stroke?: IStroke;
}

export interface ICapData extends IPos {
    group: string;
    value: number;
    name: string | number;
    format: "square" | "circle";
    size: number;
    stroke: {
        width?: number,
        color?: string,
    };
}

export interface ICapClass {
    format: "square" | "circle";
    size: number;
    stroke?: IStroke;
    startY?: number;
    endY?: number;

    draw(): void;
}