import Chart from "./Chart";
import Line from "../elements/Line";
import Cap from "../elements/Cap";
import CustomFigure from "../elements/CustomFigure";

import getStyleByIndex from "../../helpers/getStyleByIndex";
import isString from "../../helpers/isString";
import isUndefined from "../../helpers/isUndefined";
import ifTrueThenOrElse from "../../helpers/ifTrueThenOrElse";
import getCapPos from "../../helpers/getCapPos";

import { TEmptyObject, TSort, } from "../../types/index";

import { IPointX, } from "../../interfaces/axisX";
import { IPointY, } from "../../interfaces/axisY";
import { ICap, ICapData, ICapTheme, } from "../../interfaces/cap";
import { IChartCapStyle, IChartStyle, IChartTitle, } from "../../interfaces/chart";
import { IChartLineStyle, ILineChartClass, } from "../../interfaces/lineChart";
import { IData, IDataAtItemData, IGroupDataCoordinates, } from "../../interfaces/data";
import { ILine, ILineTheme, ILineTo, } from "../../interfaces/line";
import { IPadding, IPos, } from "../../interfaces/global";

class LineChart extends Chart implements ILineChartClass {
	public readonly pointsX: Array<IPointX>;
	public readonly pointsY: Array<IPointY>;
	public readonly line: ILine;
	public readonly cap: ICap;
	public readonly sortValues: TSort;
	public readonly caps: Array<ICapData>;
	public readonly themeForLine: ILineTheme;
	public readonly themeForCaps: ICapTheme;

	constructor(
		data: IData,
		line: ILine,
		cap: ICap,
		pointsY: Array<IPointY>,
		pointsX: Array<IPointX>,
		ctx: CanvasRenderingContext2D,
		width: number,
		height: number,
		title: IChartTitle | TEmptyObject,
		padding: IPadding,
		hideGroups: Array<string>,
		sortValues: TSort,
		themeForLine: ILineTheme | TEmptyObject = {},
		themeForCaps: ICapTheme | TEmptyObject = {}
	) {
		super(padding, data, ctx, width, height, "line", title, null, hideGroups);

		// Содержит данные точек оси абсцисс
		this.pointsX = pointsX;
		// Содержит данные точек оси ординат
		this.pointsY = pointsY;
		// Содержит данные линии
		this.line = line;
		// Содержит данные колпачка
		this.cap = cap;
		// Содержит сортированные значения
		this.sortValues = sortValues || "less-more";
		// Содержит данные нарисованных колпачков
		this.caps = [];
		// Содержит стилия для линии от темы
		this.themeForLine = themeForLine;
		// Содержит стилия для колпачка от темы
		this.themeForCaps = themeForCaps;
	}

	/**
	 * Определяет стили для графика
	 * @param {ILine} gLine Данные линии группы
	 * @param {ICap} gCap Данные колпачка группы
	 * @param {string} group Название группы (ключ объекта data)
	 * @private
	 * @returns {IChartStyle} Стили
	 */
	private _getStyles(gLine: ILine, gCap: ICap, group: string): IChartStyle {
		const dataKeys: Array<string> = Object.keys(this.data);
		const idx: number = dataKeys.indexOf(group);
		const themeColorForLine = getStyleByIndex(idx, this.themeForLine.color) as string;
		const themeFillForLine = getStyleByIndex(idx, this.themeForLine.fill) as Array<string> | string;
		const themeColorForCap = getStyleByIndex(idx, this.themeForCaps.color) as string;
		const themeStrokeColorForCap = getStyleByIndex(idx, this.themeForCaps.strokeColor) as string;
		const lineStyle: IChartLineStyle = {
			width: gLine.width || this.line.width,
			color: gLine.color || this.line.color || themeColorForLine,
			dotted: gLine.dotted || this.line.dotted,
			stepped: gLine.stepped || this.line.stepped,
			fill: gLine.fill || this.line.fill || themeFillForLine,
		};
		const capStyle: IChartCapStyle = {
			size: gCap.size || this.cap.size,
			color: gCap.color || this.cap.color || themeColorForCap,
			stroke: gCap.stroke || this.cap.stroke || {},
			format: gCap.format || this.cap.format,
		};

		return {
			lineStyle,
			capStyle,
			themeStrokeColorForCap,
		};
	}

	/**
	 * Определяет координаты данных группы
	 * @param {Array<IDataAtItemData>} gData Данные группы
	 * @private
	 * @returns {Array<IGroupDataCoordinates>} Массив координат у данных группы
	 */
	private _getGroupsDataCoordinates(gData: Array<IDataAtItemData>): Array<IGroupDataCoordinates> {
		return gData.map(({ value, name, }) => {
			// Элемент для начальной позиции Y линии
			const findAxisYItem = this.pointsY.find((axisYItem: IPointY) => axisYItem.value === value) as IPointY;
			// Элемент для начальной позиции X линии
			const findAxisXItem = this.pointsX.find((axisXItem: IPointX) => axisXItem.name === name) as IPointX;

			return {
				x: findAxisXItem.x,
				y: findAxisYItem.y,
				value: findAxisYItem.value,
				name: findAxisXItem.name,
			};
		});
	}

	/**
	 * Определяет координаты для фигуры, которая будет "красить" группу всю
	 * @param {Array<IGroupDataCoordinates>} coordinates массив координат линий графика
	 * @param {boolean} stepped Правило, которое будет рисовать линию пошагово
	 * @returns {Array<ILineTo>}
	 */
	private _getLineToForGroupFigure(coordinates: Array<IGroupDataCoordinates>, stepped: boolean): Array<ILineTo> {
		const lineTo: Array<ILineTo> = [];

		coordinates.map(({ x, y, }, index: number) => {
			if (stepped) {
				const nextItem: IGroupDataCoordinates | undefined = coordinates[index + 1];

				if (nextItem) {
					// Элемент для следующей позиции Y линии
					const findNextAxisYItem: IPointY = this.pointsY.find((nextAxisYItem: IPointY) => nextAxisYItem.value === nextItem.value);
					// Элемент для следующей позиции X линии
					const findNextAxisXItem: IPointX = this.pointsX.find((nextAxisXItem: IPointX) => nextAxisXItem.name === nextItem.name);

					lineTo.push(
						{
							x: findNextAxisXItem.x,
							y,
						},
						{
							x: findNextAxisXItem.x,
							y: findNextAxisYItem.y,
						}
					);
				}
			} else if (index > 0) {
				lineTo.push({ x, y, });
			}
		});

		return lineTo;
	}

	/**
	 * Создает задний фон всей группе
	 * @param {Array<IGroupDataCoordinates>} coordinates массив координат линий графика
	 * @param {string | Array<string>} fill содержит данные о цвете заднего фона
	 * @param {boolean} stepped Правило, которое будет рисовать линию пошагово
	 * @param {string} group Группа, в которой находится линия
	 * @private
	 */
	private _setFillGroupChart(coordinates: Array<IGroupDataCoordinates>, fill: Array<string> | string, stepped: boolean, group: string): void {
		const firstPoint: IGroupDataCoordinates = coordinates[0];
		const lastPoint: IGroupDataCoordinates = coordinates[coordinates.length - 1];
		const yItemsOnScreen: Array<IPointY> = this.pointsY.filter(({ onScreen, }) => onScreen);
		const lastYPoint: IPointY = yItemsOnScreen[yItemsOnScreen.length - 1];
		const firstYPoint: IPointY = yItemsOnScreen[0];
		const lineData = {
			moveTo: { x: firstPoint.x, y: firstPoint.y, },
			lineTo: this._getLineToForGroupFigure(coordinates, stepped),
			fill,
			group,
			startY: Math.min(...coordinates.map(({ y, }) => y)),
			endY: lastYPoint.y,
		};

		// Закрываем фигуру
		switch (this.sortValues) {
			case "less-more":
				lineData.lineTo.push(
					{ x: lastPoint.x, y: lastYPoint.y, },
					{ x: firstPoint.x, y: lastYPoint.y, },
					lineData.moveTo
				);
				break;
			case "more-less":
				lineData.lineTo.push(
					{ x: lastPoint.x, y: firstYPoint.y, },
					{ x: firstPoint.x, y: firstYPoint.y, },
					lineData.moveTo
				);
				break;
		}

		// Рисуем задний фон группе
		new CustomFigure(
			lineData.moveTo.x,
			lineData.moveTo.y,
			lineData.fill,
			this.ctx,
			lineData.lineTo,
			lineData.startY,
			lineData.endY
		).draw();
	}

	/**
	 * Рисует общую линию
	 * @param {number} startX Начальная позиция линии по оси абсцисс
	 * @param {number} startY Начальная позиция линии по оси ординат
	 * @param {IChartLineStyle} lineStyle Содержит стили для линии
	 * @param {Array<ILineTo>} lineTo Содержит массив координат последующих позиций линии
	 * @private
	 */
	private _drawLine(startX: number, startY: number, lineStyle: IChartLineStyle, lineTo: Array<ILineTo>): void {
		new Line(
			startX,
			startY,
			lineStyle.color,
			this.ctx,
			lineTo,
			lineStyle.width,
			lineStyle.dotted
		).draw();
	}

	/**
	 * Рисует колпачки на графике
	 * @private
	 */
	private _drawCaps(): void {
		this.caps.map(({ x, y, size, color, format, stroke, }) => {
			const { startY, endY, } = getCapPos(format, y, x, size);

			new Cap(
				size,
				x,
				y,
				color,
				format,
				this.ctx,
				1,
				startY,
				endY,
				0,
				stroke
			).draw();
		});
	}

	/**
	 * Рисует линии и колпачки
	 * @param {Array<IGroupDataCoordinates>} coordinates Массив координат у данных группы
	 * @param {Array<IDataAtItemData>} gData Данные группы
	 * @param {ILine} gLine Данные линии группы
	 * @param {ICap} gCap Данные колпачка группы
	 * @param {string} group Название группы (ключ объекта data)
	 * @private
	 */
	private _drawLinesAndCaps(coordinates: Array<IGroupDataCoordinates>, gData: Array<IDataAtItemData>, gLine: ILine, gCap: ICap, group: string): void {
		const { lineStyle, capStyle, themeStrokeColorForCap, } = this._getStyles(gLine, gCap, group);
		// Содержит следующие позиции линии
		const lineToArray: Array<IPos> = [];
		const { format: capFormat, size: capSize, color: capColor, stroke: capStroke, } = capStyle;

		// Находим координаты для линии
		coordinates.map(({ value, name, x, y, }, index: number) => {
			const { x: capX, y: capY, } = getCapPos(capFormat, y, x, capSize);
			const nextDataItem: IDataAtItemData | undefined = gData[index + 1];
			const capItem: ICapData = {
				group,
				value,
				name,
				x: capX,
				y: capY,
				stroke: {
					width: capStroke.width,
					color: ifTrueThenOrElse(isUndefined(capStroke.color), themeStrokeColorForCap, capStroke.color),
				},
				format: capFormat,
				size: capSize,
				color: capColor,
			};

			if (nextDataItem) {
				// Элемент для следующей позиции Y линии
				const findNextAxisYItem: IPointY = this.pointsY.find((nextAxisYItem: IPointY) => nextAxisYItem.value === nextDataItem.value);
				// Элемент для следующей позиции X линии
				const findNextAxisXItem: IPointX = this.pointsX.find((nextAxisXItem: IPointX) => nextAxisXItem.name === nextDataItem.name);

				if (!lineStyle.stepped) {
					lineToArray.push({ x: findNextAxisXItem.x, y: findNextAxisYItem.y, });
				} else {
					lineToArray.push(
						{
							x: findNextAxisXItem.x,
							y,
						},
						{
							x: findNextAxisXItem.x,
							y: findNextAxisYItem.y,
						}
					);
				}
			}

			this.caps.push(capItem);
		});

		this._drawLine(coordinates[0].x, coordinates[0].y, lineStyle, lineToArray);
		this._drawCaps();
	}

	/**
	 * Рисует график
	 * @returns {ILineChartClass}
	 */
	public draw(): ILineChartClass {
		const visibleGroups: IData = Object
			.keys(this.data)
			.filter((group: string) => !this.hideGroups.includes(group))
			.reduce((acc: object, group: string) => {
				acc[group] = this.data[group];

				return acc;
			}, {});

		for (const group in visibleGroups) {
			const {
				data: groupData,
				line: groupLine = {} as ILine,
				cap: groupCap = {},
			} = visibleGroups[group];

			const { lineStyle, } = this._getStyles(groupLine, groupCap, group);
			const coordinates: Array<IGroupDataCoordinates> = this._getGroupsDataCoordinates(groupData);

			// Рисуем задний фон группе
			if (Array.isArray(lineStyle.fill) || (isString(lineStyle.fill) && lineStyle.fill.length)) {
				this._setFillGroupChart(coordinates, lineStyle.fill, lineStyle.stepped, group);
			}

			this._drawLinesAndCaps(coordinates, groupData, groupLine, groupCap, group);
		}

		return this;
	}
}

export default LineChart;