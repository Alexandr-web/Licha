import { IPos, } from "./global";

export interface ILineTo extends IPos { }

export interface ILineTheme {
    color?: Array<string>;
    fill?: Array<string[]>;
}

export interface ILine {
    fill?: Array<string> | string;
    stepped?: boolean;
    color?: string;
    dotted?: boolean;
    width?: number;
}

export interface ILinePos {
    moveTo: IPos;
    lineTo: Array<IPos>;
}

export interface ILineClass {
    lineTo: Array<ILineTo>;
    width?: number;
    dotted?: boolean;

    draw(): void;
}