"use strict";

class Chart {
  constructor({
    canvasSelector,
    data,
    background = "black",
    line = {},
    cap = {},
    hLegend = { fontSize: 12, color: "white", },
    vLegend = { fontSize: 12, color: "white", },
    padding = { vertical: 30, horizontal: 30, },
  }) {
    // Объект с данными горизонтальной легенды
    this.hLegend = hLegend;
    // Объект с данными вертикальной легенды
    this.vLegend = vLegend;
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
    // Содержит данные горизонтальной легенды ({ name, x, y, width, height, value, })
    this.horizontalLegend = [];
    // Содержит данные вертикальной легенды ({ x, y, width, height, value, })
    this.verticalLegend = [];
    // Расстояние между горизонтальной линией и вертикальной легендой
    this.indentFromVerticalLegendToGraph = 10;
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

  // Устанавливает вертикальную легенду
  _setVerticalLegend() {
    const canvasHeight = this._getCanvasSizes().height - this.padding.vertical;
    // Шаг, с которым рисуем текст по оси абсцисс
    const step = canvasHeight / (this.uniqueValues.length - 1);

    this.uniqueValues.map((value, index) => {
      this.ctx.font = `${this.vLegend.fontSize}px Calibri`;
      this.ctx.fontKerning = "none";
      this.ctx.fillStyle = this.vLegend.color;

      const text = this.ctx.measureText(value);
      const y = index > 0 ? (step * index) : text.actualBoundingBoxAscent + this.padding.vertical;
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
    const canvasWidth = this._getCanvasSizes().width - this.padding.horizontal;
    const canvasHeight = this._getCanvasSizes().height - this.padding.vertical;
    // Шаг, с которым рисуем текст по оси абсцисс
    const step = canvasWidth / (this.data.length - 1);

    this.data.map(({ name, value, }, index) => {
      this.ctx.font = `${this.hLegend.fontSize}px Calibri`;
      this.ctx.fontKerning = "none";
      this.ctx.fillStyle = this.hLegend.color;

      const text = this.ctx.measureText(name);
      const x = index > 0 ? (step * index) : this.padding.horizontal + this._getMaxTextWidthAtVerticalLegend() + text.width / 2;
      const y = canvasHeight + text.actualBoundingBoxAscent + this.indentFromVerticalLegendToGraph;

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
    if (Object.keys(this.hLegend.line || {}).length) {
      this.uniqueValues.map((value) => {
        const findVerticalLegendItem = this.verticalLegend.find((verticalLegendItem) => verticalLegendItem.value === value);
        const firstHorizontalLegendItem = this.horizontalLegend[0];
        const lastHorizontalLegendItem = this.horizontalLegend[this.horizontalLegend.length - 1];

        // Рисуем линию
        this.ctx.beginPath();
        this.ctx.moveTo(findVerticalLegendItem.x + this._getMaxTextWidthAtVerticalLegend() + firstHorizontalLegendItem.width / 2, findVerticalLegendItem.y);
        this.ctx.strokeStyle = this.hLegend.line.color;
        this.ctx.lineWidth = this.hLegend.line.width;
        this.ctx.lineTo(lastHorizontalLegendItem.x, findVerticalLegendItem.y);
        this.ctx.stroke();
      });
    }
  }

  // Устанавливает вертикальные линии
  _setVerticalLines() {
    if (Object.keys(this.vLegend.line || {}).length) {
      this.data.map(({ name, }) => {
        const findHorizontalLegendItem = this.horizontalLegend.find((horizontalLegendItem) => horizontalLegendItem.name === name);
        const firstVerticalLegendItem = this.verticalLegend[0];
        const lastVerticalLegendItem = this.verticalLegend[this.verticalLegend.length - 1];

        // Рисуем линию
        this.ctx.beginPath();
        this.ctx.moveTo(findHorizontalLegendItem.x, firstVerticalLegendItem.y);
        this.ctx.strokeStyle = this.vLegend.line.color;
        this.ctx.lineWidth = this.vLegend.line.width;
        this.ctx.lineTo(findHorizontalLegendItem.x, lastVerticalLegendItem.y);
        this.ctx.stroke();
      });
    }
  }

  // Рисует основные линии графика
  _setChart() {
    for (let i = 0; i < this.data.length; i++) {
      const dataItem = this.data[i];
      const nextDataItem = this.data[i + 1];
      // Находим элемент из вертикальной легенды, подходящий по значению
      const findVerticalLegendItem = this.verticalLegend.find((verticalLegendItem) => verticalLegendItem.value === dataItem.value);
      // Находим элемент из горизонтальной легенды, подходящий по имени
      const findHorizontalLegendItem = this.horizontalLegend.find((horizontalLegendItem) => horizontalLegendItem.name === dataItem.name);

      // Начало линии
      this.ctx.beginPath();
      this.ctx.moveTo(findHorizontalLegendItem.x, findVerticalLegendItem.y);
      this.ctx.lineWidth = this.line.width;
      this.ctx.strokeStyle = this.line.color;
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
      // Находим элемент из горизонтальной легенды, подходящий по имени
      const findHorizontalLegendItem = this.horizontalLegend.find((horizontalLegendItem) => horizontalLegendItem.name === dataItem.name);
      // Находим элемент из вертикальной легенды, подходящий по значению
      const findVerticalLegendItem = this.verticalLegend.find((verticalLegendItem) => verticalLegendItem.value === dataItem.value);

      // Рисуем колпачок
      this.ctx.beginPath();
      this.ctx.arc(findHorizontalLegendItem.x, findVerticalLegendItem.y, this.cap.radius, Math.PI * 2, false);
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
    this.horizontalLegend = [];
    this.verticalLegend = [];

    this._setUniqueValues();
    this._setCanvasSizes();
    this._setCanvasStyles();
    this._setVerticalLegend();
    this._setHorizontalLegend();
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
    this._setVerticalLegend();
    this._setHorizontalLegend();
    this._setVerticalLines();
    this._setHorizontalLines();
    this._setChart();
    this._setLinesCap();
    this._drawWhenResizeScreen();

    return this;
  }
}