"use strict";

class Chart {
  constructor({
    canvasSelector,
    data,
    background = "black",
    colorVerticalLegend = "white",
    colorHorizontalLegend = "white",
    colorHorizontalLine = "#c2c2c2",
    line = {},
    cap = {},
  }) {
    // Задний фон графика
    this.background = background;
    // Цвет горизонтальной линии
    this.colorHorizontalLine = colorHorizontalLine;
    // Цвет текста у вертикальной легенды
    this.colorVerticalLegend = colorVerticalLegend;
    // Цвет текста у горизонтальной легенды
    this.colorHorizontalLegend = colorHorizontalLegend;
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
    // Содержит данные горизонтальной легенды ({ name, x, y, width, height, value, })
    this.horizontalLegend = [];
    // Содержит данные вертикальной легенды ({ x, y, width, height, value, })
    this.verticalLegend = [];
    // Расстояние между горизонтальной линией и вертикальной легендой
    this.lineDistanceFromLegend = 8;
    // Внутренние отступы графика
    this.padding = {
      vertical: 15,
      horizontal: 15,
    };
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

  // Устанавливает вертикальную легенду
  _setVerticalLegend() {
    // Высота холста с учетом внутренних отступов
    const canvasHeight = this._getCanvasSizes().height - this.padding.vertical * 2;
    // Шаг, с которым рисуем текст по оси абсцисс
    const step = canvasHeight / this.uniqueValues.length;

    this.uniqueValues.map((value, index) => {
      this.ctx.font = "12px Calibri";
      this.ctx.fontKerning = "none";
      this.ctx.fillStyle = this.colorVerticalLegend;

      const text = this.ctx.measureText(value);
      const y = step * index + step - text.actualBoundingBoxAscent;
      const x = this.padding.horizontal;

      this.verticalLegend.push({
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
   * Возвращает максимальную ширину текста в вертикальной легенде
   * @returns {number} Ширина текста
   */
  _getMaxTextWidthAtVerticalLegend() {
    const verticalLegendItem = this.verticalLegend.sort(({ width: width1, }, { width: width2, }) => width2 - width1)[0];

    return verticalLegendItem.width;
  }

  // Устанавливает горизонтальную легенду
  _setHorizontalLegend() {
    // Размеры холста с учетом внутренних отступов
    const canvasWidth = this._getCanvasSizes().width - this.padding.horizontal * 2;
    const canvasHeight = this._getCanvasSizes().height - this.padding.vertical * 2;
    // Шаг, с которым рисуем текст по оси абсцисс
    const step = canvasWidth / this.data.length;

    this.data.map(({ name, value, }, index) => {
      this.ctx.font = "12px Calibri";
      this.ctx.textBaseline = "middle";
      this.ctx.fontKerning = "none";
      this.ctx.fillStyle = this.colorHorizontalLegend;

      const text = this.ctx.measureText(name);
      const x = (step * index) + this.padding.horizontal + this._getMaxTextWidthAtVerticalLegend() + this.lineDistanceFromLegend;
      const y = canvasHeight;

      this.horizontalLegend.push({
        x,
        y,
        name,
        width: text.width,
        height: text.actualBoundingBoxAscent,
        value,
      });

      // Рисуем текст
      this.ctx.fillText(name, x - text.width / 2, y);
    });
  }

  // Устанавливает горизонтальные линии
  _setHorizontalLines() {
    // Размеры холста с учетом внутренних отступов
    const canvasHeight = this._getCanvasSizes().height - this.padding.vertical * 2;
    const canvasWidth = this._getCanvasSizes().width - this.padding.horizontal * 2;
    // Шаг, с которым рисуем линии по оси ординат
    const step = canvasHeight / this.uniqueValues.length;

    this.uniqueValues.map((value, index) => {
      // Находим элемент из вертикальной легенды, подходящий по значению
      const findVerticalLegendItem = this.verticalLegend.find((verticalLegendItem) => verticalLegendItem.value === value);
      const y = (step * index) + (step - findVerticalLegendItem.height) - (findVerticalLegendItem.height / 2);
      const x = this.padding.horizontal + this._getMaxTextWidthAtVerticalLegend() + this.lineDistanceFromLegend;

      // Рисуем линию
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.strokeStyle = this.colorHorizontalLine;
      this.ctx.lineTo(canvasWidth, y);
      this.ctx.stroke();
    });
  }

  // Рисует основные линии графика
  _setLines() {
    for (let i = 0; i < this.data.length; i++) {
      const dataItem = this.data[i];
      const dataItemLine = dataItem.line || {};
      const nextDataItem = this.data[i + 1];
      // Находим элемент из вертикальной легенды, подходящий по значению
      const findVerticalLegendItem = this.verticalLegend.find((verticalLegendItem) => verticalLegendItem.value === dataItem.value);
      // Находим элемент из горизонтальной легенды, подходящий по имени
      const findHorizontalLegendItem = this.horizontalLegend.find((horizontalLegendItem) => horizontalLegendItem.name === dataItem.name);

      // Начало линии
      this.ctx.beginPath();
      this.ctx.moveTo(findHorizontalLegendItem.x, findVerticalLegendItem.y);
      this.ctx.lineWidth = dataItemLine.width || this.line.width;
      this.ctx.strokeStyle = dataItemLine.color || this.line.color;
      this.ctx.lineJoin = "round"

      // Направлением линию только тогда, когда есть следующий элемент
      if (nextDataItem) {
        // Находим следующий элемент из вертикальной легенды, подходящий по значению
        const findNextVerticalLegendItem = this.verticalLegend.find((verticalLegendItem) => verticalLegendItem.value === nextDataItem.value);
        // Находим следующий элемент из горизонтальной легенды, подходящий по имени
        const findNextHorizontalLegendItem = this.horizontalLegend.find((horizontalLegendItem) => horizontalLegendItem.name === nextDataItem.name);

        // Направляем линию к следующему элементу
        this.ctx.lineTo(findNextHorizontalLegendItem.x, findNextVerticalLegendItem.y);
      }

      // Рисуем линию
      this.ctx.stroke();
    }
  }

  // Устанавливает колпачок на конец линии
  _setLinesCap() {
    this.data.map((dataItem) => {
      const dataItemCap = dataItem.cap || {};
      // Находим элемент из горизонтальной легенды, подходящий по имени
      const findHorizontalLegendItem = this.horizontalLegend.find((horizontalLegendItem) => horizontalLegendItem.name === dataItem.name);
      // Находим элемент из вертикальной легенды, подходящий по значению
      const findVerticalLegendItem = this.verticalLegend.find((verticalLegendItem) => verticalLegendItem.value === dataItem.value);

      // Рисуем колпачок
      this.ctx.beginPath();
      this.ctx.arc(findHorizontalLegendItem.x, findVerticalLegendItem.y, dataItemCap.radius || this.cap.radius, Math.PI * 2, false);
      this.ctx.fillStyle = dataItemCap.color || this.cap.color;
      this.ctx.fill();
    })
  }

  // Перерисовывает график при изменении размеров окна
  _drawWhenResizeScreen() {
    window.addEventListener("resize", () => this.update());
  }

  // Перерисовывает график
  update() {
    this.horizontalLegend = [];
    this.verticalLegend = [];

    this._setUniqueValues();
    this._setCanvasSizes();
    this._setCanvasStyles();
    this._setVerticalLegend();
    this._setHorizontalLegend();
    this._setHorizontalLines();
    this._setLines();
    this._setLinesCap();
  }

  // Рисует график
  init() {
    this._setUniqueValues();
    this._setCanvasSizes();
    this._setCanvasStyles();
    this._setVerticalLegend();
    this._setHorizontalLegend();
    this._setHorizontalLines();
    this._setLines();
    this._setLinesCap();
    this._drawWhenResizeScreen();

    return this;
  }
}

const myChart = new Chart({
  canvasSelector: ".canvas",
  background: "black",
  colorVerticalLegend: "white",
  colorHorizontalLegend: "white",
  colorHorizontalLine: "#c2c2c2",
  line: {
    color: "#CC397B",
    width: 3,
  },
  cap: {
    color: "#CC005C",
    radius: 3,
  },
  data: [
    { name: "Name 1", value: 0, },
    { name: "Name 2", value: 10, },
    { name: "Name 3", value: 5, },
    { name: "Name 4", value: 15, },
    { name: "Name 5", value: 35, },
    { name: "Name 6", value: 35, },
    { name: "Name 7", value: 35, },
  ],
}).init();