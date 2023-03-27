export interface IGapsForLegend {
    top: number;
    left: number;
}

export interface IPadding {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}

export interface IPos {
    x: number;
    y: number;
}

export interface ISize {
    width: number;
    height: number;
}

export interface IBounds {
    width: number | null;
    height: number | null;
    horizontal: {
        start: number,
        end: number,
    };
    vertical: {
        start: number,
        end: number,
    };
}

export interface IStroke {
    width?: number;
    color?: string;
}

export interface IGapsForYPoints {
    left: number;
    top: number;
    bottom: number;
}

export interface IGapsForXPoints {
    left: number;
    right: number;
    bottom: number;
}

export interface IGapsForYTitle {
    top: number;
    bottom: number;
}

export interface IGapsForXTitle {
    left: number;
}