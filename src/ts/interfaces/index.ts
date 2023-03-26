interface IDefaultStylesForCanvasElement {
    display: "block";
    boxSizing: "border-box";
}

interface IAchartyConstructor {
    selectorCanvas: string;
    background?: string | Array<string>;
    title?: IChartTitle | object;
    theme?: ITheme | object;
    data: IData;
    axisY?: IAxisY | object;
    axisX?: IAxisX | object;
    line?: ILine | object;
    cap?: ICap | object;
    grid?: IGrid | object;
    legend?: ILegend | object;
    blockInfo?: IBlockInfo | object;
    type?: "line";
    padding?: IPadding | number;
    hideGroups?: Array<string>;
}

interface IAchartyClass extends IAchartyConstructor {
    update(): IAchartyClass;
    init(): IAchartyClass;
}

interface IUtilsClass {
    themes: IThemes;
    colors: IColors;

    getTheme(num: number, type: string): ITheme | object;
    getColor(name: string, opacity: number): string;
}

interface ILegendClass {
    hideGroups: Array<string>;
    showLegend: boolean;
    line: ILine;
    font: IFont;
    data: IData;
    ctx: CanvasRenderingContext2D;
    bounds: IBounds;
    circle: ICircleLegend;
    maxCount: number;
    legendGaps: ILegendGaps;
    totalHeight: number;
    themeForText: ILegendTheme;
    themeForCircle: ILineTheme;
    items: Array<IItemLegend>;

    draw(gaps: IGapsForLegend): ILegendClass;
}

interface IGridClass {
    maxPointYWidth: number;
    names: Array<string>;
    ctx: CanvasRenderingContext2D;
    pointsY: Array<IPointY>;
    pointsX: Array<IPointX>;
    showPointsX: boolean;
    showPointsY: boolean;
    line: ILineGrid;
    format: "vertical" | "horizontal" | "default";
    theme: IGridTheme;
    background: string;
    distanceBetweenLineAndPoint: number;

    init(): IGridClass;
}

interface ICanvasClass {
    selector: string;
    background: string;
    ctx: CanvasRenderingContext2D;
    canvasElement: HTMLCanvasElement;
    theme: ICanvasTheme;

    getSizes(): ISize;
    init(): ICanvasClass;
}

interface ITextClass {
    font: ISpecialFontData;

    getSizes(str: string): ISize;
    draw(): void;
}

interface IRectClass {
    width: number;
    height: number;
    startY: number;
    endY: number;
    stroke?: IStroke | object;

    draw(): void;
}

interface ILineClass {
    lineTo: Array<ILineTo>;
    width?: number;
    dotted?: boolean;

    draw(): void;
}

interface IElementClass {
    ctx: CanvasRenderingContext2D;
    x?: number;
    y?: number;
    color?: string;
    rotateDeg?: number;
    opacity?: number;
}

interface ICustomFigureClass {
    lineTo: Array<ILineTo>;
    startY?: number;
    endY?: number;

    draw(): void;
}

interface ICircleClass {
    radius: number;
    stroke?: IStroke;
    startY?: number;
    endY?: number;

    draw(): void;
}

interface ICapClass {
    format: "square" | "circle";
    size: number;
    stroke?: IStroke;
    startY?: number;
    endY?: number;

    draw(): void;
}

interface IBlockInfoClass {
    editValue: (value: number) => string;
    editName: (name: number | string) => string;
    data: IData;
    bounds: IBounds;
    elements: Array<IActiveElement>;
    padding: IPadding;
    titleData: ITitleBlockInfo;
    groupsData: IGroupsBlockInfo;
    groupLineWidth: number;
    triangleSizes: ISize;
    title: string;
    themeForWindow: IBlockInfoThemeWindow;
    themeForLine: ILineTheme;
    themeForTitle: IBlockInfoThemeTitle;
    themeForGroup: IBlockInfoThemeGroup;

    init(): void;
}

interface ILineChartClass {
    pointsX: Array<IPointX>;
    pointsY: Array<IPointY>;
    line: ILine;
    cap: ICap;
    sortValues: "more-less" | "less-more";
    caps: Array<ICapData>;
    themeForLine: ILineTheme;
    themeForCaps: ICapTheme;

    draw(): ILineChartClass;
}

interface IChartClass {
    padding: IPadding;
    data: IData;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    title: IChartTitle;
    type: "line";
    defaultPadding: number;
    hideGroups: Array<string>;
    theme: ITitleTheme;

    getBounds(): IBounds;
    drawTitle(): IChartClass;
    getGapsForYPoints(axisY: IAxisYClass, axisX: IAxisXClass, chartTitle: IChartTitle, legend: ILegendData): IGapsForYPoints;
    getGapsForXPoints(axisY: IAxisYClass, axisX: IAxisXClass): IGapsForXPoints;
    getGapsForYTitle(chartTitle: IChartTitleWithSizeAndPos, legend: ILegendDataGaps, axisX: IAxisX): IGapsForYTitle;
    getGapsForXTitle(axisY: IAxisYClass): IGapsForXTitle;
    getGapsForLegend(axisY: IAxisY, chartTitle: IChartTitleWithSizeAndPos): IGapsForLegend;
}

interface IAxisClass {
    ctx: CanvasRenderingContext2D;
    title: IAxisYTitle | IAxisXTitle;
    font: IFontAxis;
    bounds: IBounds;
    points: Array<IPointX | IPointY>;
    sortNames: "more-less" | "less-more";
    uniqueNames: Array<string | number>;
    uniqueValues: Array<number>;
    readonly gapTopAxisX: number;
    readonly gapRightAxisY: number;
    themeForPoint: IAxisThemePoint;
    themeForTitle: IAxisThemeTitle;

    getAxesData(data: IData): IAxesData;
}

interface IAxisXClass extends IAxisClass {
    themeForLine: ILineTheme;
    ignoreNames: Array<string> | ((name: string | number, index: number) => boolean);
    data: IData;
    editName: (name: string | number) => string;
    line: ILine;

    getIgnoreNames(): Array<string | number>;
    drawTitle(gaps: IGapsForXTitle): IAxisXClass;
    drawPoints(gaps: IGapsForXPoints): IAxisXClass;
    getCorrectName(name: string | number): string | number;
}

interface IAxisYClass extends IAxisClass {
    step: number;
    editValue: (value: number) => string | number;
    data: IData;
    sortValues: "more-less" | "less-more";

    drawTitle(gaps: IGapsForYTitle): IAxisYClass;
    drawPoints(gaps: IGapsForYPoints): IAxisYClass;
    getMaxTextWidthAtYAxis(): number;
}

interface IChartLineStyle {
    width: number;
    color: string;
    dotted: boolean;
    stepped: boolean;
    fill: string | Array<string>;
}

interface IChartCapStyle {
    size: number;
    color: string;
    stroke: IStroke | object;
    format: "square" | "circle";
}

interface IChartStyle {
    lineStyle: IChartLineStyle;
    capStyle: IChartCapStyle;
    themeStrokeColorForCap: string;
}

interface IGroupDataCoordinates extends IPos {
    name: number | string;
    value: number;
}

interface IAxisPoints {
    pointsY: Array<IPointY>;
    pointsX: Array<IPointX>;
}

interface IThemes {
    dark: Array<ITheme>;
    light: Array<ITheme>;
}

interface ITextData {
    size: number;
    str: string;
    text: string;
}

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

interface IAxisThemePoint {
    color: string;
}

interface IAxisThemeTitle {
    color: string;
}

interface IAxisTheme {
    title: IAxisThemeTitle;
    point: IAxisThemePoint;
}

interface IAxesData {
    values: Array<number>;
    names: Array<string | number>;
}

interface IGridTheme {
    color: string;
}

interface ILineTheme {
    color?: Array<string>;
    fill?: Array<string[]>;
}

interface ICapTheme {
    color?: Array<string>;
    strokeColor?: Array<string>;
}

interface IBlockInfoThemeWindow {
    color: Array<string> | string;
}

interface IBlockInfoThemeTitle {
    color: string;
}

interface IBlockInfoThemeGroup {
    color: string;
}

interface IBlockInfoTheme {
    window: IBlockInfoThemeWindow;
    title: IBlockInfoThemeTitle;
    group: IBlockInfoThemeGroup;
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
    format?: "square" | "circle";
    color?: string;
    size?: number;
    stroke?: IStroke;
}

interface ICapData extends IPos {
    group: string;
    value: number;
    name: string | number;
    format: "square" | "circle";
    size: number;
    stroke: {
        width?: number,
        color?: string,
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
    cap?: ICap;
    line?: ILine;
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
    sort: "more-less" | "less-more";
}

interface IAxisY extends IAxis {
    step: number;
    editValue: (value: number) => string;
    title: IAxisYTitle;
}

interface IAxisX extends IAxis {
    editName: (name: number | string) => string;
    ignoreNames: ((name: number | string, index: number) => boolean) | Array<string | number>;
    title: IAxisXTitle;
}

interface IActiveElement extends IPointX {
    name: string;
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
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
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
}

type IPointY = IPoint

interface IPointX extends IPoint {
    name: number | string;
    color: string | Array<string>;
    group: string;
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

interface IItemLegend extends ISize, IPos, IColumnLegend { }

interface IStroke {
    width?: number;
    color?: string;
}

type ILineTo = IPos

interface IGroupsBlockInfoGaps {
    bottom: number;
    right: number;
}

interface IGroupsBlockInfo {
    font: IFont;
    gaps: IGroupsBlockInfoGaps;
}

interface ITitleBlockInfoGaps {
    bottom: number;
}

interface ITitleBlockInfo {
    font: IFont;
    gaps: ITitleBlockInfoGaps;
}

interface IBlockInfo {
    background: string;
    groups: IGroupsBlockInfo;
    title: ITitleBlockInfo;
    padding: IPadding;
}

interface IBlockInfoElementWithSizeGroup extends ISize {
    name: string;
    color: string | Array<string>;
}

interface IBlockInfoElementWithSizeValue extends ISize {
    name: string;
}

interface IBlockInfoElementWithSize {
    group: IBlockInfoElementWithSizeGroup;
    value: IBlockInfoElementWithSizeValue;
}

interface ILinePos {
    moveTo: IPos;
    lineTo: Array<IPos>;
}

interface ITriangleData extends IPos {
    lineTo: Array<ILineTo>,
    startY: number;
    endY: number;
}

interface ILegendData extends ILegendClass, ILegend { }

interface ILegendDataGaps extends ILegendClass {
    gapBottom: number;
}

interface IGapsForYPoints {
    left: number;
    top: number;
    bottom: number;
}

interface IGapsForXPoints {
    left: number;
    right: number;
    bottom: number;
}

interface IGapsForYTitle {
    top: number;
    bottom: number;
}

interface IGapsForXTitle {
    left: number;
}

interface IChartTitleWithSizeAndPos extends IPos, ISize, IChartTitle { }

interface IGapsForLegend {
    top: number;
    left: number;
}

interface IGapsForTextLegend extends IGapsForLegend {
    top: number;
}

interface ISpecialFontData {
    str: string;
    color: string;
    text: string;
    size?: number;
    weight?: number;
}