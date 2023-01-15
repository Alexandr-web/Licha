export default (canvas, elements, e) => {
  const canvasLeft = canvas.offsetLeft + canvas.clientLeft;
  const canvasTop = canvas.offsetTop + canvas.clientTop;
  const x = e.pageX - canvasLeft;
  const y = e.pageY - canvasTop;

  return elements.filter(({ x: elX, y: elY, width, height, }) => {
    return y >= elY - height && y <= elY + height && x >= x - width && x <= elX + width;
  });
};