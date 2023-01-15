import Chart from "./Chart";
import Line from "../elements/Line";
import Cap from "../elements/Cap";
import CustomFigure from "../elements/CustomFigure";

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
    padding
  ) {
    super(data, ctx, width, height, "line", title, padding);

    this.pointsX = pointsX;
    this.pointsY = pointsY;
    this.line = line;
    this.cap = cap;
    this.caps = [];
  }

  draw() {
    for (const group in this.data) {
      const {
        data: groupData,
        line: groupLine = {},
        cap: groupCap = {},
      } = this.data[group];
      const lineStyle = {
        width: groupLine.width || this.line.width,
        color: groupLine.color || this.line.color,
        dotted: groupLine.dotted || this.line.dotted,
        stepped: groupLine.stepped || this.line.stepped,
        fill: groupLine.fill || this.line.fill,
      };
      const capStyle = {
        size: groupCap.size || this.cap.size,
        color: groupCap.color || this.cap.color,
        stroke: groupCap.stroke || this.cap.stroke,
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
            0,
            1,
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
            capStyle.stroke
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
    const lastYItem = yItemsOnScreen[yItemsOnScreen.length - 1];
    const lineData = {
      moveTo: { x: firstPoint.x, y: firstPoint.y, },
      lineTo: [],
      fill,
      group,
      startY: Math.min(...coordinations.map(({ y, }) => y)),
      endY: lastYItem.y,
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
    lineData.lineTo.push(
      { x: lastPoint.x, y: lastYItem.y, },
      { x: firstPoint.x, y: lastYItem.y, },
      lineData.moveTo
    );

    // Рисуем задний фон группе
    new CustomFigure(
      ...Object.values(lineData.moveTo),
      lineData.fill,
      this.ctx,
      lineData.lineTo,
      lineData.startY,
      lineData.endY
    ).draw();
  }
}

export default LineChart;