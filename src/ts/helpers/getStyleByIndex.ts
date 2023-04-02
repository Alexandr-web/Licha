/**
* Определяет стиль для элемента с индексом, который больше длины массива стилей
* @param {Array<string | string[]>} res Содержит стили, последний из которых будет применен к элементу
* @param {number} idx Индекс элемента
* @param {Array<string | string[]>} styles Содержит массив стилей
* @returns {Array<string | string[]> | string}
*/
function getStyleByBigIndex(res: Array<string | string[]>, idx: number, styles: Array<string | string[]>): Array<string | string[]> | string {
  const arr: Array<string | string[]> = res;

  if (arr.length - 1 >= idx) {
    return arr[idx];
  }

  for (let i = 0; i < styles.length; i++) {
    if (arr.length - 1 >= idx) {
      break;
    }

    arr.push(styles[i]);
  }

  return getStyleByBigIndex(arr, idx, styles);
}

/**
 * Определяет элемент темы
 * @param {number} idx Индекс текущего элемента, к которому будет применяться стиль
 * @param {array} styles Содержит элементы, содержащие стили
 * @return {string} 
 */
export default (idx: number, styles: Array<string | string[]> = []): Array<string | string[]> | string => {
  if (!styles.length) {
    return "";
  }

  if (idx > styles.length - 1) {
    return getStyleByBigIndex([], idx, styles);
  }

  return styles[idx] || "";
};