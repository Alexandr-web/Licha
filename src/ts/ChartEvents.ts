import { IBlockInfo, IBlockInfoThemeGroup, IBlockInfoThemeTitle, IBlockInfoThemeWindow, } from "./interfaces/blockInfo";
import { IAxisX, IPointX, } from "./interfaces/axisX";
import { IAxisY, IPointY, } from "./interfaces/axisY";
import { IBounds, IPos, } from "./interfaces/global";
import { ILineTheme, } from "./interfaces/line";
import { ICanvasClass, } from "./interfaces/canvas";
import { IItemLegend, ILegend, ILegendClass, } from "./interfaces/legend";
import { ITheme, } from "./interfaces/utils";
import { IData, } from "./interfaces/data";
import { ILichaClass, } from "./interfaces/licha";
import { IAxisPoints, } from "./interfaces/axis";
import { IChartClass, } from "./interfaces/chart";
import { IChartEventsClass, } from "./interfaces/chartEvents";

import BlockInfo from "./ui/BlockInfo";
import { TEmptyObject, TUpdate, } from "./types/index";
import isFunction from "./helpers/isFunction";

class ChartEvents implements IChartEventsClass {
    public readonly blockInfo?: IBlockInfo | TEmptyObject;
    public readonly axisX?: IAxisX | TEmptyObject;
    public readonly axisY?: IAxisY | TEmptyObject;
    public readonly theme?: ITheme | TEmptyObject;
    public readonly data: IData;
    public readonly legend?: ILegend | TEmptyObject;
    public readonly lichaContext: ILichaClass;
    public readonly update: TUpdate;
    public readonly fontFamily: string;

    constructor(
        data: IData,
        lichaContext: ILichaClass,
        update: TUpdate,
        blockInfo: IBlockInfo | TEmptyObject,
        axisX: IAxisX | TEmptyObject,
        axisY: IAxisY | TEmptyObject,
        theme: ITheme | TEmptyObject,
        legend: ILegend | TEmptyObject,
        fontFamily: string
    ) {
        // Семейство шрифта
        this.fontFamily = fontFamily;
        // Данные окна с информацией об активной группе
        this.blockInfo = blockInfo || {};
        // Данные оси абсцисс
        this.axisX = axisX || {};
        // Данные оси ординат
        this.axisY = axisY || {};
        // Стили темы
        this.theme = theme || {};
        // Данные легенды
        this.legend = legend || {};
        // Данные групп
        this.data = data;
        // Содержит контекст класса Licha
        this.lichaContext = lichaContext;
        // Метод, который обновляет диаграмму
        this.update = update;
    }

    /**
     * Обработчик события resize у window
     * Обновляет график и проверяет ширину окна с break points
     * @private
     */
    private _windowResizeHandler(): void {
        this.update.call(this.lichaContext);
    }

    // Добавление события resize элементу window
    public windowResize(): void {
        window.addEventListener("resize", this._windowResizeHandler.bind(this));
    }

    /**
     * Обработчик события mousemove у элемента canvas
     * Рисует окно с информацией об активной группе
     * @param {MouseEvent} e Объект события
     * @param {number} endY Конечная область видимости окна с информацией об активной группе
     * @param {Array<IPointX>} pointsX Содержит данные всех точек на оси абсцисс
     * @param {number} startY Начальная область видимости окна с информацией об активной группе
     * @param {ICanvasClass} canvas Экземпляр класса Canvas
     * @param {IBounds} bounds Содержит границы холста
     * @private
     */
    private _mousemoveByCanvasHandler(e: MouseEvent, endY: number, pointsX: Array<IPointX>, startY: number, canvas: ICanvasClass, bounds: IBounds): void {
        const mousePos: IPos = { x: e.offsetX, y: e.offsetY, };
        const { events = {}, } = this.blockInfo;

        if (mousePos.y <= endY && mousePos.y >= startY) {
            // Отбираем элементы, которые подходят по координатам на холсте
            const activeElements: Array<IPointX> = pointsX.map((point) => {
                if (isFunction(this.axisX.editName)) {
                    return {
                        ...point,
                        name: this.axisX.editName(point.name),
                    };
                }

                return point;
            }).filter(({ x, group, }) => !this.lichaContext.hideGroups.includes(group) && mousePos.x > (x - 5) && mousePos.x < (x + 5));

            if (activeElements.length) {
                this.update.call(this.lichaContext);

                const [{ x, }]: Array<IPointX> = activeElements;
                const { title, groups, background, padding, } = this.blockInfo;
                const themeForWindow: IBlockInfoThemeWindow = (this.theme.blockInfo || {}).window;
                const themeForLine: ILineTheme = this.theme.line;
                const themeForTitle: IBlockInfoThemeTitle = (this.theme.blockInfo || {}).title;
                const themeForGroup: IBlockInfoThemeGroup = (this.theme.blockInfo || {}).group;

                new BlockInfo(
                    this.axisY.editValue,
                    this.axisX.editName,
                    this.data,
                    bounds,
                    activeElements,
                    title,
                    groups,
                    x,
                    mousePos.y,
                    background,
                    canvas.ctx,
                    this.fontFamily,
                    padding,
                    themeForWindow,
                    themeForLine,
                    themeForTitle,
                    themeForGroup
                ).init();

                // Вызываем функцию-обработчик для обработки события наведения на точку
                if (isFunction(events.onAimed)) {
                    events.onAimed.call({ ...mousePos, activeElements, });
                }
            }
        }
    }

    /**
     * Добавление события mousemove элементу canvas
     * @param {ICanvasClass} canvas Экземпляр класса Canvas
     * @param {IBounds} bounds Содержит границы холста
     * @param {{ pointsX: Array<IPointX>, pointsY: Array<IPointY> }} param2 Содержит данные всех осевых точек
     * @param {string} eventName Название события ("mousemove" или "touchmove")
     */
    public mousemoveByCanvas(canvas: ICanvasClass, bounds: IBounds, { pointsX, pointsY, }, eventName: string): void {
        if (!Object.keys(this.blockInfo).length) {
            return;
        }

        const pointsYOnScreen: Array<IPointY> = pointsY.filter(({ onScreen, }) => onScreen);
        const { y: firstPointYOrdinate, height: firstPointYHeight, } = pointsYOnScreen[0];
        const { y: lastPointYOrdinate, height: lastPointYHeight, } = pointsYOnScreen[pointsYOnScreen.length - 1];
        const endY: number = lastPointYOrdinate - firstPointYHeight / 2;
        const startY: number = firstPointYOrdinate - lastPointYHeight / 2;

        canvas.canvasElement.addEventListener(eventName, (e: MouseEvent) => this._mousemoveByCanvasHandler(e, endY, pointsX, startY, canvas, bounds));
    }

    /**
     * Обработчик события mouseleave у элемента canvas
     * Обновляет график
     * @private
     */
    private _leavemouseFromCanvasAreaHandler(): void {
        this.update.call(this.lichaContext);
    }

    /**
     * Обработчки события touchstart у элемента window
     * Обновляет график, если пользователь не касается холста
     * @param {TouchEvent} e Содержит данные события
     * @private
     */
    private _leavetouchFormCanvasAreaHandler(e: TouchEvent): void {
        const target = e.target as HTMLElement;

        if (target.nodeName !== "CANVAS") {
            this.update.call(this.lichaContext);
        }
    }

    // Добавление события touchstart элементу window
    public leavetouchFromCanvasArea(): void {
        window.addEventListener("touchstart", this._leavetouchFormCanvasAreaHandler.bind(this));
    }

    /**
     * Добавление события mouseleave элементу canvas
     * @param {ICanvasClass} canvas Экземпляр класса Canvas
     */
    public leavemouseFromCanvasArea(canvas: ICanvasClass): void {
        canvas.canvasElement.addEventListener("mouseleave", this._leavemouseFromCanvasAreaHandler.bind(this));
    }

    /**
     * Обработчик события click у элемента canvas
     * Скрывает группы при клике на элементы легенды
     * @param {MouseEvent} e Объект event
     * @param {Array<IItemLegend>} legendItems Содержит данные элементов легенды
     * @private
     */
    private _clickByCanvasAreaHandler(e: MouseEvent, legendItems: Array<IItemLegend>): void {
        const { events = {}, } = this.legend;
        const mousePos: IPos = { x: e.offsetX, y: e.offsetY, };
        const findMatchLegendItem: IItemLegend | null = legendItems.find(({ x, y, width, height, }) => {
            const endX: number = x + width;
            const startY: number = y - height;

            return (mousePos.x <= endX && mousePos.x >= x) && (mousePos.y <= y && mousePos.y >= startY);
        });

        if (findMatchLegendItem) {
            const { group, } = findMatchLegendItem;
            const findIdxHideGroup: number = this.lichaContext.hideGroups.indexOf(group);

            if (findIdxHideGroup !== -1) {
                this.lichaContext.hideGroups.splice(findIdxHideGroup, 1);
            } else {
                this.lichaContext.hideGroups.push(group);
            }

            // Вызываем функцию-обработчик для обработки события клика на элемент легенды
            if (isFunction(events.onClick)) {
                const hiddenLegendItems = legendItems.filter(({ group: g, }) => this.lichaContext.hideGroups.includes(g));
                const notHiddenItems = legendItems.filter(({ group: g, }) => !this.lichaContext.hideGroups.includes(g));

                events.onClick.call({ element: findMatchLegendItem, hiddenElements: hiddenLegendItems, elements: legendItems, notHiddenElements: notHiddenItems, });
            }

            this.update.call(this.lichaContext);
        }
    }

    /**
     * Добавление события click элементу canvas
     * @param {ICanvasClass} canvas Экземпляр класса Canvas
     * @param {Array<IItemLegend>} legendItems Содержит данные элементов легенды
     * @param {string} eventName Название события ("click" или "touchstart")
     */
    public clickByCanvasArea(canvas: ICanvasClass, legendItems: Array<IItemLegend>, eventName: string): void {
        canvas.canvasElement.addEventListener(eventName, (e: MouseEvent) => this._clickByCanvasAreaHandler(e, legendItems));
    }

    /**
     * Объявляет все события для диаграммы
     * @param {ICanvasClass} canvas 
     * @param {IChartClass} chart 
     * @param {IAxisPoints} points 
     * @param {ILegendClass} legend 
     */
    public init(canvas: ICanvasClass, chart: IChartClass, points: IAxisPoints, legend: ILegendClass): void {
        this.mousemoveByCanvas(canvas, chart.getBounds(), points, "mousemove");
        this.mousemoveByCanvas(canvas, chart.getBounds(), points, "touchmove");
        this.leavemouseFromCanvasArea(canvas);
        this.leavetouchFromCanvasArea();
        this.clickByCanvasArea(canvas, legend.items, "click");
        this.clickByCanvasArea(canvas, legend.items, "touchstart");
        this.windowResize();
    }
}

export default ChartEvents;