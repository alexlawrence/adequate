import { functionAttributeStart } from './element';

type AttributeProxy = Record<string, string | Function>;

const createAttributeProxy = <T extends AttributeProxy>(target: HTMLElement) =>
  new Proxy({} as T, {
    get(_, property) {
      const attribute = target.getAttribute(property as string) || '';
      return !attribute.indexOf(functionAttributeStart)
        ? Function(attribute).bind(target)
        : attribute;
    },
  });

export { createAttributeProxy, AttributeProxy };
