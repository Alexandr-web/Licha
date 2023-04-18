export default (format, y, x, size) => {
    switch (format) {
        case "square":
            return {
                startY: y - size / 2,
                endY: y + size / 2,
                x: x - size / 2,
                y: y - size / 2,
            };
        default:
            return {
                startY: y - size,
                endY: y + size,
                x,
                y,
            };
    }
};