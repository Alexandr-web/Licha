import quickSort from "../../helpers/quickSort";

class Axis {
  constructor(
    ctx,
    themeForPoint = {},
    themeForTitle = {},
    title = {},
    bounds = {},
    sortNames = "less-more",
    font = {}
  ) {
    // Контекст элемента canvas
    this.ctx = ctx;
    // Название оси
    this.title = title;
    // Стили шрифта оси
    this.font = font;
    // Содержит границы холста
    this.bounds = bounds;
    // Содержит данные точек, находящихся на этой оси
    this.points = [];
    // Тип сортировки точек ("less-more" или "more-less")
    this.sortNames = sortNames;
    // Содержит уникальные названия точек оси абсцисс
    this.uniqueNames = [];
    // Содержит уникальные значения точек оси ординат
    this.uniqueValues = [];
    // Дистанция между осью абсцисс и графиком
    this.distanceFromXAxisToGraph = 15;
    // Дистанция между осью ординат и графиком
    this.distanceBetweenYAndChart = 15;
    // Стили для точек от темы
    this.themeForPoint = themeForPoint;
    // Стили для заголовка от темы
    this.themeForTitle = themeForTitle;
  }

  /**
   * Сортирует значения и названия (если те имеют тип данных число) групп
   * @param {object} data Содержит данные групп
   * @returns 
   */
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