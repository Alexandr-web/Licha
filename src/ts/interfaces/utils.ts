import { TEmptyObject, } from "../types/index";

import { ICanvasTheme, } from "./canvas";
import { ITitleTheme, } from "./chart";
import { ILegendTheme, } from "./legend";
import { IAxisTheme, } from "./axis";
import { IGridTheme, } from "./grid";
import { ILineTheme, } from "./line";
import { ICapTheme, } from "./cap";
import { IBlockInfoTheme, } from "./blockInfo";

export interface ITheme {
    readonly canvas: ICanvasTheme;
    readonly title: ITitleTheme;
    readonly legend: ILegendTheme;
    readonly axis?: IAxisTheme;
    readonly grid?: IGridTheme,
    readonly line?: ILineTheme;
    readonly cap?: ICapTheme;
    readonly blockInfo: IBlockInfoTheme;
}

export interface IColors {
    [key: string]: (opacity?: number) => string;
}

export interface IThemes {
    readonly dark: Array<ITheme>;
    readonly light: Array<ITheme>;
}

export interface IUtilsClass {
    readonly themes: IThemes;
    readonly colors: IColors;

    getTheme(num: number, type: string): ITheme | TEmptyObject;
    getColor(name: string, opacity: number): string;
}