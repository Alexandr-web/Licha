"use strict";

class Chart {
  constructor({
    canvasSelector,
    data,
    background = "black",
    line = {},
    cap = {},
    axisY = { fontSize: 12, color: "white", },
    axisX = { fontSize: 12, color: "white", },
    padding = { vertical: 30, horizontal: 30, },
  }) {
    // Объект с данными ординаты
    this.axisX = axisX;
    // Объект с данными абсциссы
    this.axisY = axisY;
    // Задний фон графика
    this.background = background;
    // Объект с данными линии (цвет, ширина, ...)
    this.line = line;
    // Объект с данными графика ({ name, value, })
    this.data = data;
    // Объект с данными колпачка линии (цвет, радиус, ...)
    this.cap = cap;
    // HTML элемент canvas
    this.canvasElement = document.querySelector(canvasSelector);
    // Контекст элемента canvas
    this.ctx = this.canvasElement.getContext("2d");
    // Содержит уникальные значения данных графика (0, 100, 200, ...)
    this.uniqueValues = [];
    // Содержит данные абсциссы ({ name, x, y, width, height, value, })
    this.axisYData = [];
    // Содержит данные ординаты ({ x, y, width, height, value, })
    this.axisXData = [];
    // Расстояние между горизонтальной линией и ординатой
    this.indentFromXAxisToGraph = 15;
    // Расстояние между осями
    this.distanceBetweenAxles = 15;
    // Внутренние отступы графика (vertical, horizontal)
    this.padding = padding;
  }

  // Устанавливает размеры элементу canvas
  _setCanvasSizes() {
    const { offsetWidth, offsetHeight, } = this.canvasElement;

    this.canvasElement.width = offsetWidth;
    this.canvasElement.height = offsetHeight;
  }

  /**
   * Записывает уникальные значения данных графика
   * и сортирует их от большего к меньшему
   */
  _setUniqueValues() {
    this.uniqueValues = [...new Set(this.data.map(({ value, }) => value))].sort((val1, val2) => val2 - val1);
  }

  /**
   * Возвращает размеры элемента canvas
   * @returns {object} Ширина и высота элемента canvas
   */
  _getCanvasSizes() {
    const { width, height, } = this.canvasElement;

    return {
      width,
      height,
    };
  }

  // Задает задний фон графику
  _setCanvasStyles() {
    this.ctx.fillStyle = this.background;
    this.ctx.fillRect(0, 0, this._getCanvasSizes().width, this._getCanvasSizes().height);
  }

  // Устанавливает ординату
  _setYAxis() {
    const canvasHeight = this._getCanvasSizes().height - this.padding.vertical * 2;
    // Шаг, с которым рисуем текст по оси абсцисс
    const step = canvasHeight / (this.uniqueValues.length - 1);

    this.uniqueValues.map((value, index) => {
      this.ctx.font = `${this.axisY.fontSize}px Calibri`;
      this.ctx.fontKerning = "none";
      this.ctx.fillStyle = this.axisY.color;

      const text = this.ctx.measureText(value);
      const y = step * index + text.actualBoundingBoxAscent + this.padding.vertical;
      const x = this.padding.horizontal;

      this.axisYData.push({
        y: y - text.actualBoundingBoxAscent / 2,
        x,
        width: text.width,
        height: text.actualBoundingBoxAscent,
        value,
      });

      // Рисуем текст
      this.ctx.fillText(value, this.padding.horizontal, y);
    });
  }

  /**
   * Возвращает максимальную ширину текста в ординате
   * @returns {number} Ширина текста
   */
  _getMaxTextWidthAtYAxis() {
    const axisYItem = this.axisYData.sort(({ width: width1, }, { width: width2, }) => width2 - width1)[0];

    return axisYItem.width;
  }

  // Устанавливает абсциссу
  _setXAxis() {
    // Размеры холста с учетом внутренних отступов
    const canvasWidth = this._getCanvasSizes().width - this.padding.horizontal * 2;
    const canvasHeight = this._getCanvasSizes().height - this.padding.vertical;
    // Шаг, с которым рисуем текст по оси абсцисс
    const step = canvasWidth / (this.data.length - 1);

    this.data.map(({ name, value, }, index) => {
      this.ctx.font = `${this.axisX.fontSize}px Calibri`;
      this.ctx.fontKerning = "none";
      this.ctx.fillStyle = this.axisX.color;

      const text = this.ctx.measureText(name);
      const x = step * index + text.width / 2 + this._getMaxTextWidthAtYAxis();
      const y = canvasHeight + text.actualBoundingBoxAscent + this.indentFromXAxisToGraph;

      // Рисуем текст
      this.axisXData.push({
        x,
        y,
        name,
        width: text.width,
        height: text.actualBoundingBoxAscent,
        value,
      });

      switch (index) {
        case 0:
          this.ctx.fillText(name, x, y);
          break;
        case this.data.length - 1:
          this.ctx.fillText(name, x - text.width, y);
          break;
        default:
          this.ctx.fillText(name, x - text.width / 2, y);
      }
    });
  }

  // Устанавливает горизонтальные линии
  _setHorizontalLines() {
    if (Object.keys(this.axisX.line || {}).length) {
      this.uniqueValues.map((value) => {
        const findYAxisItem = this.axisYData.find((yAxisItem) => yAxisItem.value === value);
        const firstXAxisItem = this.axisXData[0];
        const lastXAxisItem = this.axisXData[this.axisXData.length - 1];

        // Рисуем линию
        this.ctx.beginPath();
        this.ctx.moveTo(firstXAxisItem.x, findYAxisItem.y);
        this.ctx.strokeStyle = this.axisX.line.color;
        this.ctx.lineWidth = this.axisX.line.width;
        this.ctx.lineTo(lastXAxisItem.x, findYAxisItem.y);
        this.ctx.stroke();
      });
    }
  }

  // Устанавливает вертикальные линии
  _setVerticalLines() {
    if (Object.keys(this.axisY.line || {}).length) {
      this.data.map(({ name, }) => {
        const findAxisXItem = this.axisXData.find((axisXDataItem) => axisXDataItem.name === name);
        const firstAxisYItem = this.axisYData[0];
        const lastAxisYItem = this.axisYData[this.axisYData.length - 1];

        // Рисуем линию
        this.ctx.beginPath();
        this.ctx.moveTo(findAxisXItem.x, firstAxisYItem.y);
        this.ctx.strokeStyle = this.axisY.line.color;
        this.ctx.lineWidth = this.axisY.line.width;
        this.ctx.lineTo(findAxisXItem.x, lastAxisYItem.y);
        this.ctx.stroke();
      });
    }
  }

  // Рисует основные линии графика
  _setChart() {
    this.data.map(({ value, name, }, index) => {
      const nextDataItem = this.data[index + 1];
      // Находим элемент из ординаты, подходящий по значению
      const findAxisYItem = this.axisYData.find((axisYItem) => axisYItem.value === value);
      // Находим элемент из абсциссы, подходящий по имени
      const findAxisXItem = this.axisXData.find((axisXItem) => axisXItem.name === name);

      // Начало линии
      this.ctx.beginPath();
      this.ctx.moveTo(findAxisXItem.x, findAxisYItem.y);
      this.ctx.lineWidth = this.line.width;
      this.ctx.strokeStyle = this.line.color;
      this.ctx.lineJoin = "round";

      // Направлением линию только тогда, когда есть следующий элемент
      if (nextDataItem) {
        // Находим следующий элемент из ординаты, подходящий по значению
        const findNextAxisYItem = this.axisYData.find((nextAxisYItem) => nextAxisYItem.value === nextDataItem.value);
        // Находим следующий элемент из абсциссы, подходящий по имени
        const findNextAxisXItem = this.axisXData.find((nextAxisXItem) => nextAxisXItem.name === nextDataItem.name);

        // Направляем линию к следующему элементу
        this.ctx.lineTo(findNextAxisXItem.x, findNextAxisYItem.y);
      }

      // Рисуем линию
      this.ctx.stroke();
    });
  }

  // Устанавливает колпачок на конец линии
  _setLinesCap() {
    this.data.map(({ name, value, }) => {
      // Находим элемент из абсциссы, подходящий по имени
      const findAxisXItem = this.axisXData.find((axisXItem) => axisXItem.name === name);
      // Находим элемент из ординаты, подходящий по значению
      const findAxisYItem = this.axisYData.find((axisYItem) => axisYItem.value === value);

      // Рисуем колпачок
      this.ctx.beginPath();
      this.ctx.arc(findAxisXItem.x, findAxisYItem.y, this.cap.radius, Math.PI * 2, false);
      this.ctx.fillStyle = this.cap.color;
      this.ctx.fill();

      // Установка обводки колпачка линии
      if ("stroke" in this.cap) {
        this.ctx.lineWidth = this.cap.stroke.width;
        this.ctx.strokeStyle = this.cap.stroke.color;
        this.ctx.stroke();
      }
    });
  }

  // Перерисовывает график при изменении размеров окна
  _drawWhenResizeScreen() {
    window.addEventListener("resize", () => this.update());
  }

  // Перерисовывает график
  update() {
    this.axisXData = [];
    this.axisYData = [];

    this._setUniqueValues();
    this._setCanvasSizes();
    this._setCanvasStyles();
    this._setYAxis();
    this._setXAxis();
    this._setVerticalLines();
    this._setHorizontalLines();
    this._setChart();
    this._setLinesCap();
  }

  // Рисует график
  init() {
    this._setUniqueValues();
    this._setCanvasSizes();
    this._setCanvasStyles();
    this._setYAxis();
    this._setXAxis();
    this._setVerticalLines();
    this._setHorizontalLines();
    this._setChart();
    this._setLinesCap();
    this._drawWhenResizeScreen();

    return this;
  }
}