interface IFont {
    size: number;
    color: string;
    weight: number;
}

interface IFontWithText extends IFont {
    text: string;
}

interface IChartTitle {
    font: IFontWithText;
    gapBottom: number;
}

interface ILegendTheme {
    color: string;
}

interface ICanvasTheme {
    background: string;
}

interface ITitleTheme {
    color: string;
}

interface IAxisTheme {
    title: { color: string, };
    point: { color: string, };
}

interface IGridTheme {
    color: string;
}

interface ILineTheme {
    color?: Array<string>;
    fill?: Array<string[]>;
}

interface ICapTheme {
    color?: Array<string> | string;
    strokeColor?: Array<string> | string;
}

interface IBlockInfoTheme {
    window: { color: Array<string> | string, };
    title: { color: string, };
    group: { color: string, };
}

interface ITheme {
    canvas: ICanvasTheme;
    title: ITitleTheme;
    legend: ILegendTheme;
    axis?: IAxisTheme;
    grid?: IGridTheme,
    line?: ILineTheme;
    cap?: ICapTheme;
    blockInfo: IBlockInfoTheme;
}

interface IDataAtItemData {
    name: string | number;
    value: number;
}

interface IData {
    [key: string]: IItemData
}

interface ICap {
    format: "square" | "circle";
    color: string;
    size: number;
    stroke: {
        width: number,
        color: string,
    };
}

interface ILine {
    fill: Array<string> | string;
    stepped: boolean;
    color: string;
    dotted: boolean;
    width: number;
}

interface IItemData {
    data: Array<IDataAtItemData>;
    cap: ICap;
    line: ILine;
}

interface IFontAxis extends IFont {
    showText: boolean;
}

interface IAxisYTitle {
    font: IFontWithText;
    gapRight: number;
}

interface IAxisXTitle {
    font: IFontWithText;
    gapTop: number;
}

interface IAxis {
    font: IFontAxis;
    sort: "less-more" | "more-less";
}

interface IAxisY extends IAxis {
    step: number;
    editValue: (value: number) => string;
    title: IAxisYTitle;
}

interface IAxisX extends IAxis {
    editName: (name: number | string) => string;
    ignoreNames: ((name: number | string, index: number) => boolean) | Array<string>;
    title: IAxisXTitle;
}

interface ILineGrid extends Omit<ILine, "fill" & "stepped"> {
    stretch: boolean;
}

interface IGrid {
    background: string;
    format: "vertical" | "horizontal" | "default";
    line: ILineGrid;
}

interface ILegendGaps {
    circle: { right: number };
    group: {
        right: number,
        bottom: number,
    };
    legend: { bottom: number, };
}

interface ICircleLegend {
    radius: number,
}

interface ILegend {
    circle: ICircleLegend;
    font: IFont;
    gaps: ILegendGaps;
    maxCount: number;
}

interface IPadding {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

interface IGroupsBlockInfo {
    font: IFont;
    gaps: {
        bottom: number,
        right: number,
    };
}

interface ITitleBlockInfo {
    font: IFont;
    gaps: { bottom: number, };
}

interface IBlockInfo {
    background: string;
    groups: IGroupsBlockInfo;
    title: ITitleBlockInfo;
    padding: IPadding;
}

interface IPos {
    x: number;
    y: number;
}

interface ISize {
    width: number;
    height: number;
}

interface IPoint extends IPos, ISize {
    onScreen: boolean;
    value: number;
    group: string;
}

interface IPointY extends IPoint { }

interface IPointX extends IPoint {
    name: number | string;
    color: string;
}

interface IBounds {
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

interface IColumnLegend {
    group: string;
    color: Array<string> | string;
}

interface IColors {
    [key: string]: (opacity?: number) => string;
}

interface IItemLegend extends ISize, IColumnLegend { };