import { ISize, } from "./global";

export interface ISpecialFontData {
    str: string;
    color?: string;
    text: string;
    size?: number;
    weight?: number;
}

export interface ITextClass {
    readonly font: ISpecialFontData;

    getSizes(str: string): ISize;
    draw(): void;
}

export interface IFont {
    size?: number;
    color?: string;
    weight?: number;
}

export interface IFontWithText extends IFont {
    text: string;
}