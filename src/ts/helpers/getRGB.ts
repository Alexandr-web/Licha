/**
 * Преобразует rgba строку
 * @param {string} rgb rgb параметры ("255,255,255")
 * @param {number} opacity Прозрачность цвета (от 0 до 1)
 * @return {string} rgba строка
 */
export default (rgb: string, opacity = 1): string => `rgba(${rgb},${opacity})`;