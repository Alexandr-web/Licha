class Axis {
  constructor(
    ctx,
    line = {},
    title = {},
    bounds = {},
    font = {
      size: 12,
      color: "black",
    }
  ) {
    // Контекст элемента canvas
    this.ctx = ctx;
    // Название оси
    this.title = title;
    // Данные линии оси
    this.line = line;
    // Стили шрифта оси
    this.font = font;
    // Содержит границы холста
    this.bounds = bounds;
    // Содержит данные точек, находящихся на этой оси
    this.points = [];
    // Содержит уникальные названия на оси абсцисс
    this.uniqueNames = [];
    this.uniqueValues = [];
    this.distanceFromXAxisToGraph = 10;
    this.distanceBetweenYAndChart = 10;
  }

  getAxesData(data) {
    // Для оси ординат
    const values = [];
    // Для оси абсцисс
    const names = [];

    // Добавляем значения и названия в массивы данных осей
    for (const group in data) {
      const groupData = data[group].data;

      names.push(...groupData.map(({ name, }) => name));
      values.push(...groupData.map(({ value, }) => value));
    }

    // Находим максимальное значение для оси ординат
    const sortedValues = [...new Set(values)].sort((val1, val2) => val2 - val1);

    return {
      values: sortedValues,
      names: [...new Set(names)],
    };
  }
}

export default Axis;