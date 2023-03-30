import { ISize, } from "./global";

export interface IDefaultStylesForCanvasElement {
    display: "block";
    boxSizing: "border-box";
}

export interface ICanvasTheme {
    background: string;
}

export interface ICanvasClass {
    selector: string;
    background: string;
    ctx: CanvasRenderingContext2D;
    canvasElement: HTMLCanvasElement;
    theme: ICanvasTheme;

    getSizes(): ISize;
    init(): ICanvasClass;
}