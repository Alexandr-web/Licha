import { IPos, } from "./global";

export interface ILineTo extends IPos { }

export interface ILineTheme {
    color?: Array<string>;
    fill?: Array<string[]>;
}

export interface ILine {
    readonly fill?: Array<string> | string;
    readonly stepped?: boolean;
    readonly color?: string | Array<string>;
    readonly dotted?: boolean;
    readonly width?: number;
}

export interface ILinePos {
    moveTo: IPos;
    lineTo: Array<IPos>;
}

export interface ILineClass {
    readonly lineTo: Array<ILineTo>;
    readonly width?: number;
    readonly dotted?: boolean;

    draw(): void;
}