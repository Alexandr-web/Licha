export interface IElementClass {
    readonly ctx: CanvasRenderingContext2D;
    readonly x?: number;
    readonly y?: number;
    readonly color?: string | Array<string>;
    readonly rotateDeg?: number;
    readonly opacity?: number;
}