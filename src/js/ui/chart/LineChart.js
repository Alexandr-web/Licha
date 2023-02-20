import Chart from "./Chart";
import Line from "../elements/Line";
import Cap from "../elements/Cap";
import CustomFigure from "../elements/CustomFigure";
import getStyleByIndex from "../../helpers/getStyleByIndex";

class LineChart extends Chart {
  constructor(
    data,
    line,
    cap,
    pointsY,
    pointsX,
    ctx,
    width,
    height,
    title,
    padding,
    sortValues = "less-more",
    themeForLine = {},
    themeForCaps = {}
  ) {
    super(padding, data, ctx, width, height, "line", title);

    this.pointsX = pointsX;
    this.pointsY = pointsY;
    this.line = line;
    this.cap = cap;
    this.sortValues = sortValues;
    this.caps = [];
    this.themeForLine = themeForLine;
    this.themeForCaps = themeForCaps;
  }

  draw() {
    for (const group in this.data) {
      const dataKeys = Object.keys(this.data);
      const idx = dataKeys.indexOf(group);
      const themeColorForLine = getStyleByIndex(idx, this.themeForLine.color);
      const themeFillForLine = getStyleByIndex(idx, this.themeForLine.fill);
      const themeColorForCap = getStyleByIndex(idx, this.themeForCaps.color);
      const themeStrokeColorForCap = getStyleByIndex(idx, this.themeForCaps.strokeColor);

      const {
        data: groupData,
        line: groupLine = {},
        cap: groupCap = {},
      } = this.data[group];
      const lineStyle = {
        width: groupLine.width || this.line.width,
        color: groupLine.color || this.line.color || themeColorForLine,
        dotted: groupLine.dotted || this.line.dotted,
        stepped: groupLine.stepped || this.line.stepped,
        fill: groupLine.fill || this.line.fill || themeFillForLine,
      };
      const capStyle = {
        size: groupCap.size || this.cap.size,
        color: groupCap.color || this.cap.color || themeColorForCap,
        stroke: groupCap.stroke || this.cap.stroke || {},
        format: groupCap.format || this.cap.format,
      };
      const coordinations = groupData.map(({ value, name, }) => {
        // Элемент для начальной позиции Y линии
        const findAxisYItem = this.pointsY.find((axisYItem) => axisYItem.value === value);
        // Элемент для начальной позиции X линии
        const findAxisXItem = this.pointsX.find((axisXItem) => axisXItem.name === name);

        return {
          x: findAxisXItem.x,
          y: findAxisYItem.y,
          value: findAxisYItem.value,
          name: findAxisXItem.name,
        };
      });

      // Рисуем задний фон группе
      if (Array.isArray(lineStyle.fill) || typeof lineStyle.fill === "string") {
        this._setFillGroupChart(coordinations, lineStyle.fill, lineStyle.stepped, group);
      }

      // Находим координаты для линий
      groupData.map(({ value, name, }, index) => {
        const nextDataItem = groupData[index + 1];
        // Элемент для начальной позиции Y линии
        const findAxisYItem = this.pointsY.find((axisYItem) => axisYItem.value === value);
        // Элемент для начальной позиции X линии
        const findAxisXItem = this.pointsX.find((axisXItem) => axisXItem.name === name);
        // Содержит следующие позиции линии
        const lineToArray = [];

        if (nextDataItem) {
          // Элемент для следующей позиции Y линии
          const findNextAxisYItem = this.pointsY.find((nextAxisYItem) => nextAxisYItem.value === nextDataItem.value);
          // Элемент для следующей позиции X линии
          const findNextAxisXItem = this.pointsX.find((nextAxisXItem) => nextAxisXItem.name === nextDataItem.name);

          if (!lineStyle.stepped) {
            lineToArray.push({ x: findNextAxisXItem.x, y: findNextAxisYItem.y, });
          } else {
            lineToArray.push(
              {
                x: findNextAxisXItem.x,
                y: findAxisYItem.y,
              },
              {
                x: findNextAxisXItem.x,
                y: findNextAxisYItem.y,
              }
            );
          }
        }

        // Рисуем линию
        if (lineStyle.color) {
          new Line(
            findAxisXItem.x,
            findAxisYItem.y,
            lineStyle.color,
            this.ctx,
            lineToArray,
            lineStyle.width,
            lineStyle.dotted
          ).draw();
        }

        if (capStyle.color) {
          new Cap(
            capStyle.size,
            capStyle.format === "circle" ? findAxisXItem.x : findAxisXItem.x - capStyle.size / 2,
            capStyle.format === "circle" ? findAxisYItem.y : findAxisYItem.y - capStyle.size / 2,
            capStyle.color,
            capStyle.format,
            this.ctx,
            1,
            capStyle.format === "circle" ? findAxisYItem.y - capStyle.size : findAxisYItem.y - capStyle.size / 2,
            capStyle.format === "circle" ? findAxisYItem.y + capStyle.size : findAxisYItem.y + capStyle.size / 2,
            0,
            {
              ...capStyle.stroke,
              color: capStyle.stroke.color || themeStrokeColorForCap,
            }
          ).draw();

          this.caps.push({
            group,
            value,
            name,
            x: capStyle.format === "circle" ? findAxisXItem.x : findAxisXItem.x - capStyle.size / 2,
            y: capStyle.format === "circle" ? findAxisYItem.y : findAxisYItem.y - capStyle.size / 2,
            stroke: capStyle.stroke,
            format: capStyle.format,
            size: capStyle.size,
          });
        }
      });
    }

    return this;
  }

  /**
   * Создает задний фон у всей группы
   * @param {array} coordinations массив координат линий графика
   * @param {string|array} fill содержит данные о цвете заднего фона
   * @param {boolean} stepped Правило, которое будет рисовать линию пошагово
   * @param {string} group Группа, в которой находится линия
   * @private
   */
  _setFillGroupChart(coordinations, fill, stepped, group) {
    const firstPoint = coordinations[0];
    const lastPoint = coordinations[coordinations.length - 1];
    const yItemsOnScreen = this.pointsY.filter(({ onScreen, }) => onScreen);
    const lastYPoint = yItemsOnScreen[yItemsOnScreen.length - 1];
    const firstYPoint = yItemsOnScreen[0];
    const lineData = {
      moveTo: { x: firstPoint.x, y: firstPoint.y, },
      lineTo: [],
      fill,
      group,
      startY: Math.min(...coordinations.map(({ y, }) => y)),
      endY: lastYPoint.y,
    };

    // Определяем координаты для будущей фигуры
    coordinations.map(({ x, y, }, index) => {
      if (stepped) {
        const nextItem = coordinations[index + 1];

        if (nextItem) {
          // Элемент для следующей позиции Y линии
          const findNextAxisYItem = this.pointsY.find((nextAxisYItem) => nextAxisYItem.value === nextItem.value);
          // Элемент для следующей позиции X линии
          const findNextAxisXItem = this.pointsX.find((nextAxisXItem) => nextAxisXItem.name === nextItem.name);

          lineData.lineTo.push(
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
        lineData.lineTo.push({ x, y, });
      }
    });

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
}

export default LineChart;