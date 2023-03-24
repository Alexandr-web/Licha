import "../interfaces/index";

export type TAxisPoints = {
    pointsY: Array<IPointY>,
    pointsX: Array<IPointX>,
};

export type TThemes = {
    dark: Array<ITheme>,
    light: Array<ITheme>,
}

export type TTextData = {
    size: number,
    str: string,
    text: string,
}

export type TGridFormat = "vertical" | "horizontal" | "default";