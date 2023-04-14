import { IStroke, IPos, } from "./global";
import { TCapType, } from "../types/index";

export interface ICapTheme {
    color?: Array<string>;
    strokeColor?: Array<string>;
}

export interface ICap {
    format?: TCapType;
    color?: string | Array<string>;
    size?: number;
    stroke?: IStroke;
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
    format: TCapType;
    size: number;
    stroke?: IStroke;
    startY?: number;
    endY?: number;

    draw(): void;
}