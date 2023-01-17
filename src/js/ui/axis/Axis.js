import quickSort from "../../helpers/quickSort";

class Axis {
  constructor(
    ctx,
    line = {},
    title = {},
    bounds = {},
    sortNames = "less-more",
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
    this.sortNames = sortNames;
    this.uniqueNames = [];
    this.uniqueValues = [];
    this.distanceFromXAxisToGraph = 15;
    this.distanceBetweenYAndChart = 15;
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

    const uniqueNames = [...new Set(names)];
    const uniqueValues = [...new Set(values)];
    const namesIsNumbers = !uniqueNames.some((name) => isNaN(+name));
    const sortedValues = quickSort(uniqueValues).reverse();
    const sortedNames = [];

    if (namesIsNumbers) {
      switch (this.sortNames) {
        case "less-more":
          sortedNames.push(...quickSort(uniqueNames));
          break;
        case "more-less":
          sortedNames.push(...quickSort(uniqueNames).reverse());
          break;
      }
    }

    return {
      values: sortedValues,
      names: namesIsNumbers ? sortedNames : uniqueNames,
    };
  }
}

export default Axis;