/**
 * Быстрая сортировка массива
 * @param {array} arr Содержит значений
 * @param {string} key Ключ, по значению которого нужно сортировать
 * @returns {array} Отсортированный массив
 */
function quickSort(arr: Array<number | object>, key?: string): Array<number | object> {
  if (arr.length <= 1) {
    return arr;
  }

  const lastValue: number | object = arr[arr.length - 1];
  const leftSide: Array<number | object> = [];
  const rightSide: Array<number | object> = [];

  for (let i = 0; i < arr.length - 1; i++) {
    if (key ? arr[i][key] < lastValue[key] : arr[i] < lastValue) {
      leftSide.push(arr[i]);
    } else {
      rightSide.push(arr[i]);
    }
  }

  return [...quickSort(leftSide, key), lastValue, ...quickSort(rightSide, key)];
}

export default quickSort;