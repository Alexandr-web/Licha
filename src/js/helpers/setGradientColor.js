import getRange from "./getRange";

export default (color, startY, endY, methodToStyle, ctx) => {
  const grd = ctx.createLinearGradient(0, startY, 0, endY);
  const range = getRange(0, 1, color.length - 1);

  // Создает градиент
  color.map((clr, idx) => grd.addColorStop(range[idx], clr));

  ctx[methodToStyle] = grd;
};