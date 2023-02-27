/**
 * Определяет диапазон значений от меньшего к большему в зависимости от шага
 * @param {number} from Начальное значение (наименьшее)
 * @param {number} to Конечное значение (наибольшее)
 * @param {number} count Шаг
 * @return {array} Диапазон
 * 
 * Отдельная благодарность
 * @see http://www.robertpenner.com/easing/
 */
export default (from, to, count) => {
  const range = [];

  if (from === 0 && Math.abs(to) === 1) {
    let step = 0;

    for (let i = 0; i < count; i++) {
      step = ((from * i) + (to * (count - i))) / count;
    }

    for (let j = from; j <= to; j += step) {
      range.push(j);
    }
  } else {
    const step = (to - from) / (count - 1);

    for (let i = from; i <= to; i += step) {
      range.push(Math.ceil(i));
    }
  }

  return range;
};