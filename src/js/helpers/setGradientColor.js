import getRange from "./getRange";

export default (color, startY, endY, methodToStyle, ctx, startX = 0, endX = 0) => {
  const grd = ctx.createLinearGradient(startX, startY, endX, endY);
  const range = getRange(0, 1, color.length - 1);

  // Создает градиент
  color.map((clr, idx) => grd.addColorStop(range[idx], clr));

  ctx[methodToStyle] = grd;
};