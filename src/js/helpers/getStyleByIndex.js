/**
 * Определяет элемент темы
 * @param {number} idx Индекс текущего элемента, к которому будет применяться стиль
 * @param {array} styles Содержит элементы, содержащие стили
 * @return {string} 
 */
export default (idx, styles = []) => {
  if (!styles.length) {
    return "";
  }
  
  if (idx > styles.length - 1) {
    return styles[(idx - 1) - (styles.length - 1)];
  }

  return styles[idx] || "";
};