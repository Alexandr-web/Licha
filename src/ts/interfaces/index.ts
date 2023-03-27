import { TEmptyObject, TGroup, } from "../types/index";

export interface IDefaultStylesForCanvasElement {
	display: "block";
	boxSizing: "border-box";
}

export interface IAchartyConstructor {
	selectorCanvas: string;
	background?: string | Array<string>;
	title?: IChartTitle | TEmptyObject;
	theme?: ITheme | TEmptyObject;
	data: IData;
	axisY?: IAxisY | TEmptyObject;
	axisX?: IAxisX | TEmptyObject;
	line?: ILine | TEmptyObject;
	cap?: ICap | object;
	grid?: IGrid | TEmptyObject;
	legend?: ILegend | TEmptyObject;
	blockInfo?: IBlockInfo | TEmptyObject;
	type?: "line";
	padding?: IPadding | number;
	hideGroups?: Array<string>;
}

export interface IAchartyClass extends IAchartyConstructor {
	update(): IAchartyClass;
	init(): IAchartyClass;
}

export interface IUtilsClass {
	themes: IThemes;
	colors: IColors;

	getTheme(num: number, type: string): ITheme | object;
	getColor(name: string, opacity: number): string;
}

export interface ILegendClass {
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

export interface IGridClass {
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

export interface ICanvasClass {
	selector: string;
	background: string;
	ctx: CanvasRenderingContext2D;
	canvasElement: HTMLCanvasElement;
	theme: ICanvasTheme;

	getSizes(): ISize;
	init(): ICanvasClass;
}

export interface ITextClass {
	font: ISpecialFontData;

	getSizes(str: string): ISize;
	draw(): void;
}

export interface IRectClass {
	width: number;
	height: number;
	startY: number;
	endY: number;
	stroke?: IStroke | object;

	draw(): void;
}

export interface ILineClass {
	lineTo: Array<ILineTo>;
	width?: number;
	dotted?: boolean;

	draw(): void;
}

export interface ILineTo extends IPos { }

export interface IElementClass {
	ctx: CanvasRenderingContext2D;
	x?: number;
	y?: number;
	color?: string;
	rotateDeg?: number;
	opacity?: number;
}

export interface ICustomFigureClass {
	lineTo: Array<ILineTo>;
	startY?: number;
	endY?: number;

	draw(): void;
}

export interface ICircleClass {
	radius: number;
	stroke?: IStroke;
	startY?: number;
	endY?: number;

	draw(): void;
}

export interface ICapClass {
	format: "square" | "circle";
	size: number;
	stroke?: IStroke;
	startY?: number;
	endY?: number;

	draw(): void;
}

export interface IBlockInfoClass {
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

export interface ILineChartClass {
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

export interface IChartClass {
	padding: IPadding;
	data: IData;
	ctx: CanvasRenderingContext2D;
	width: number;
	height: number;
	title: IChartTitle | TEmptyObject;
	type: "line";
	defaultPadding: number;
	hideGroups: Array<string>;
	theme: ITitleTheme | TEmptyObject;
	titleData: IChartTitleData;

	getBounds(): IBounds;
	drawTitle(): IChartClass;
	getGapsForYPoints(axisY: IAxisYClass, axisX: IAxisXClass, chartTitle: IChartTitle, legend: ILegendData): IGapsForYPoints;
	getGapsForXPoints(axisY: IAxisYClass, axisX: IAxisXClass): IGapsForXPoints;
	getGapsForYTitle(chartTitle: IChartTitleData, legend: ILegendData, axisX: IAxisX): IGapsForYTitle;
	getGapsForXTitle(axisY: IAxisYClass): IGapsForXTitle;
	getGapsForLegend(axisY: IAxisY | TEmptyObject, chartTitle: IChartTitleWithSizeAndPos): IGapsForLegend;
}

export interface IAxisClass {
	ctx: CanvasRenderingContext2D;
	title: IAxisYTitle | IAxisXTitle | TEmptyObject;
	font: IFontAxis | TEmptyObject;
	bounds: IBounds | TEmptyObject;
	points: Array<IPointX | IPointY>;
	sortNames: "more-less" | "less-more";
	uniqueNames: Array<string | number>;
	uniqueValues: Array<number>;
	readonly gapTopAxisX: number;
	readonly gapRightAxisY: number;
	themeForPoint: IAxisThemePoint | TEmptyObject;
	themeForTitle: IAxisThemeTitle | TEmptyObject;

	getAxesData(data: IData): IAxesData;
}

export interface IAxisXTitleData extends IAxisXTitle, IPos, ISize { }
export interface IAxisYTitleData extends IAxisYTitle, IPos, ISize { }

export interface IAxisXClass extends IAxisClass {
	themeForLine: ILineTheme;
	ignoreNames: Array<string> | ((name: string | number, index: number) => boolean);
	data: IData;
	editName: (name: string | number) => string;
	line: ILine;
	titleData: IAxisXTitleData;

	getIgnoreNames(): Array<string | number>;
	drawTitle(gaps: IGapsForXTitle): IAxisXClass;
	drawPoints(gaps: IGapsForXPoints): IAxisXClass;
	getCorrectName(name: string | number): string | number;
}

export interface IAxisYClass extends IAxisClass {
	step: number;
	editValue: (value: number) => string | number;
	data: IData;
	sortValues: "more-less" | "less-more";
	titleData: IAxisYTitleData;

	drawTitle(gaps: IGapsForYTitle): IAxisYClass;
	drawPoints(gaps: IGapsForYPoints): IAxisYClass;
	getMaxTextWidthAtYAxis(): number;
}

export interface IChartLineStyle {
	width: number;
	color: string;
	dotted: boolean;
	stepped: boolean;
	fill: string | Array<string>;
}

export interface IChartCapStyle {
	size: number;
	color: string;
	stroke: IStroke;
	format: "square" | "circle";
}

export interface IChartStyle {
	lineStyle: IChartLineStyle;
	capStyle: IChartCapStyle;
	themeStrokeColorForCap: string;
}

export interface IGroupDataCoordinates extends IPos {
	name: number | string;
	value: number;
}

export interface IAxisPoints {
	pointsY: Array<IPointY>;
	pointsX: Array<IPointX>;
}

export interface IThemes {
	dark: Array<ITheme>;
	light: Array<ITheme>;
}

export interface ITextData {
	size: number;
	str: string;
	text: string;
}

export interface IFont {
	size: number;
	color: string;
	weight: number;
}

export interface IFontWithText extends IFont {
	text: string;
}

export interface IChartTitle {
	font: IFontWithText;
	gapBottom: number;
}

export interface IChartTitleData extends IChartTitle, ISize, IPos { }

export interface ILegendTheme {
	color: string;
}

export interface ICanvasTheme {
	background: string;
}

export interface ITitleTheme {
	color: string;
}

export interface IAxisThemePoint {
	color: string;
}

export interface IAxisThemeTitle {
	color: string;
}

interface IAxisTheme {
	title: IAxisThemeTitle;
	point: IAxisThemePoint;
}

export interface IAxesData {
	values: Array<number>;
	names: Array<string | number>;
}

export interface IGridTheme {
	color: string;
}

export interface ILineTheme {
	color?: Array<string>;
	fill?: Array<string[]>;
}

export interface ICapTheme {
	color?: Array<string>;
	strokeColor?: Array<string>;
}

export interface IBlockInfoThemeWindow {
	color: Array<string> | string;
}

export interface IBlockInfoThemeTitle {
	color: string;
}

export interface IBlockInfoThemeGroup {
	color: string;
}

interface IBlockInfoTheme {
	window: IBlockInfoThemeWindow;
	title: IBlockInfoThemeTitle;
	group: IBlockInfoThemeGroup;
}

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

export interface IDataAtItemData {
	name: string | number;
	value: number;
}

export interface IData {
	[key: string]: IItemData
}

export interface ICap {
	format?: "square" | "circle";
	color?: string;
	size?: number;
	stroke?: IStroke;
}

export interface ICapData extends IPos {
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

export interface ILine {
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

export interface IFontAxis extends IFont {
	showText: boolean;
}

export interface IAxisYTitle {
	font: IFontWithText;
	gapRight: number;
}

export interface IAxisXTitle {
	font: IFontWithText;
	gapTop: number;
}

interface IAxis {
	font: IFontAxis;
	sort: "more-less" | "less-more";
}

export interface IAxisY extends IAxis {
	step: number;
	editValue: (value: number) => string;
	title: IAxisYTitle;
}

export interface IAxisX extends IAxis {
	editName: (name: number | string) => string;
	ignoreNames: ((name: number | string, index: number) => boolean) | Array<string | number>;
	title: IAxisXTitle;
}

export interface IActiveElement extends IPointX {
	name: string;
}

export interface ILineGrid extends Omit<ILine, "fill" & "stepped"> {
	stretch: boolean;
}

export interface IGrid {
	background: string;
	format: "vertical" | "horizontal" | "default";
	line: ILineGrid;
}

export interface ILegendGapsCircle {
	right: number;
}

export interface ILegendGapsGroup {
	right: number;
	bottom: number;
}

export interface ILegendGapsLegend {
	bottom: number;
}

export interface ILegendGaps {
	circle: ILegendGapsCircle;
	group: ILegendGapsGroup;
	legend: ILegendGapsLegend;
}

export interface ICircleLegend {
	radius: number,
}

export interface ILegend {
	circle: ICircleLegend;
	font: IFont;
	gaps: ILegendGaps;
	maxCount: number;
}

export interface IPadding {
	top?: number;
	right?: number;
	bottom?: number;
	left?: number;
}

export interface IGroupsBlockInfo {
	font: IFont;
	gaps: {
		bottom: number,
		right: number,
	};
}

export interface ITitleBlockInfo {
	font: IFont;
	gaps: { bottom: number, };
}

export interface IBlockInfo {
	background: string;
	groups: IGroupsBlockInfo;
	title: ITitleBlockInfo;
	padding: IPadding;
}

export interface IPos {
	x: number;
	y: number;
}

export interface ISize {
	width: number;
	height: number;
}

interface IPoint extends IPos, ISize {
	onScreen: boolean;
	value: number;
}

export interface IPointY extends IPoint { }

export interface IPointX extends IPoint {
	name: number | string;
	color: string | Array<string>;
	group: string;
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

export interface IColumnLegend {
	group: string;
	color: Array<string> | string;
}

export interface IColors {
	[key: string]: (opacity?: number) => string;
}

export interface IItemLegend extends ISize, IPos, IColumnLegend { }

export interface IStroke {
	width?: number;
	color?: string;
}

interface IGroupsBlockInfoGaps {
	bottom: number;
	right: number;
}

interface IGroupsBlockInfo {
	font: IFont;
	gaps: IGroupsBlockInfoGaps;
}

export interface ITitleBlockInfoGaps {
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

export interface IBlockInfoElementWithSizeGroup extends ISize {
	name: string;
	color: string | Array<string>;
}

interface IBlockInfoElementWithSizeValue extends ISize {
	name: string;
}

export interface IBlockInfoElementWithSize {
	group: IBlockInfoElementWithSizeGroup;
	value: IBlockInfoElementWithSizeValue;
}

export interface ILinePos {
	moveTo: IPos;
	lineTo: Array<IPos>;
}

export interface ITriangleData extends IPos {
	lineTo: Array<ILineTo>,
	startY: number;
	endY: number;
}

export interface ILegendData extends ILegendClass, ILegend { }

export interface ILegendDataGaps extends ILegendClass {
	gapBottom: number;
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

export interface IChartTitleWithSizeAndPos extends IPos, ISize, IChartTitle { }

export interface IGapsForLegend {
	top: number;
	left: number;
}

export interface IGapsForTextLegend extends IGapsForLegend {
	top: number;
}

export interface ISpecialFontData {
	str: string;
	color: string;
	text: string;
	size?: number;
	weight?: number;
}