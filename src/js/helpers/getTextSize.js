import Text from "../ui/elements/Text";

export default (size, weight, text, ctx) => {
  const font = {
    size,
    str: `${weight} ${size}px Arial, sans-serif`,
    text,
  };

  return new Text(font, ctx).getSizes();
};