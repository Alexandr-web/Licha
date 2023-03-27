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
    canvas: ICanvasTheme;
    title: ITitleTheme;
    legend: ILegendTheme;
    axis?: IAxisTheme;
    grid?: IGridTheme,
    line?: ILineTheme;
    cap?: ICapTheme;
    blockInfo: IBlockInfoTheme;
}

export interface IColors {
    [key: string]: (opacity?: number) => string;
}

export interface IThemes {
    dark: Array<ITheme>;
    light: Array<ITheme>;
}

export interface IUtilsClass {
    themes: IThemes;
    colors: IColors;

    getTheme(num: number, type: string): ITheme | TEmptyObject;
    getColor(name: string, opacity: number): string;
}