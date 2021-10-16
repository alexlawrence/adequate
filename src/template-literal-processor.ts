const html = (
  strings: TemplateStringsArray,
  ...expressions: unknown[]
) => expressions
  .map<[string, unknown] | string>((value, index) => [strings[index], value])
  .concat(strings[strings.length - 1])
  .flat(Infinity);

export default html;
