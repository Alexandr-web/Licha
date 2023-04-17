import { TEmptyObject, } from "../types/index";
import { ISize, } from "./global";

export interface IDefaultStylesForCanvasElement {
    display: "block";
    boxSizing: "border-box";
}

export interface ICanvasTheme {
    readonly background: string;
}

export interface ICanvasClass {
    readonly selector: string;
    readonly background?: string | Array<string>;
    readonly ctx: CanvasRenderingContext2D;
    readonly canvasElement: HTMLCanvasElement;
    readonly theme: ICanvasTheme | TEmptyObject;

    getSizes(): ISize;
    init(): ICanvasClass;
}