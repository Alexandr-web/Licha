import { IStroke, IPos, } from "./global";
import { TCapType, } from "../types/index";

export interface ICapTheme {
    readonly color?: Array<string>;
    readonly strokeColor?: Array<string>;
}

export interface ICap {
    readonly format?: TCapType;
    readonly color?: string | Array<string>;
    readonly size?: number;
    readonly stroke?: IStroke;
}

export interface ICapCoordinates {
    startY: number;
    endY: number;
    x: number;
    y: number;
}

export interface ICapData extends IPos {
    group: string;
    value: number;
    name: string | number;
    format: TCapType;
    size: number;
    color: string | Array<string>;
    stroke: {
        width?: number,
        color?: string,
    };
}

export interface ICapClass {
    readonly format: TCapType;
    readonly size: number;
    readonly stroke?: IStroke;
    readonly startY?: number;
    readonly endY?: number;

    draw(): void;
}