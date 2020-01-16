type TemplateToken = number | string | Boolean | Function | null | undefined;
type TemplateTokenArray = TemplateToken[];
type TemplateValue = TemplateToken | TemplateTokenArray | TemplateTokenArray[];
type TemplateValuesArray = TemplateValue[];

const html = (
  strings: TemplateStringsArray,
  ...values: TemplateValuesArray
): TemplateTokenArray => {
  return values
    .map<[string, TemplateValue] | string>((value, index) => [strings[index], value])
    .concat(strings[strings.length - 1])
    .flat(Infinity);
};

export { html, TemplateTokenArray };
