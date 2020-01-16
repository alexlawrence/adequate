import { createAttributeProxy } from './attribute-proxy-factory';
import { functionAttributeStart } from './element';

const { describe, expect, it } = <any>window;

describe('createAttributeProxy()', () => {
  it('should return an object', () => {
    const element = document.createElement('div');
    const attributeProxy = createAttributeProxy(element);
    expect(() => typeof attributeProxy == 'object');
  });

  describe('returned object', () => {
    it('should expose HTML attributes of the given target as properties', () => {
      const element = document.createElement('div');
      element.setAttribute('id', '12345');
      element.setAttribute('data-boolean', '');
      element.setAttribute('data-string', 'foo');
      element.setAttribute('data-number', '3');
      const attributeProxy = createAttributeProxy(element);
      expect(() => attributeProxy.id == '12345');
      expect(() => attributeProxy['data-boolean'] == '');
      expect(() => attributeProxy['data-string'] == 'foo');
      expect(() => attributeProxy['data-number'] == '3');
    });

    it('should de-serialize function expression attributes', () => {
      const element = document.createElement('div');
      element.setAttribute('data-test', functionAttributeStart);
      const attributeProxy = createAttributeProxy(element);
      expect(() => typeof attributeProxy['data-test'] == 'function');
    });

    it('should bind de-serialized functions to target', () => {
      const element = document.createElement('div');
      element.setAttribute(
        'data-fn',
        `${functionAttributeStart}('div').getAttribute('data-value')`,
      );
      const parentElement = document.createElement('div');
      parentElement.setAttribute('data-value', 'foo');
      parentElement.appendChild(element);
      const attributeProxy = createAttributeProxy<{ 'data-fn': () => string }>(element);
      expect(() => attributeProxy['data-fn']() == 'foo');
    });
  });
});
