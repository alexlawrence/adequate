const { describe, expect, it } = <any>window;

import { updateChildNodes } from './dom-updates';

const createFragment = (childNodes: Node[] = []) => {
  const newParentElement = document.createDocumentFragment();
  childNodes.forEach(node => newParentElement.appendChild(node));
  return newParentElement;
};

const createElement = (nodeName: string, childNodes: Node[] = []) => {
  const newParentElement = document.createElement(nodeName);
  childNodes.forEach(node => newParentElement.appendChild(node));
  return newParentElement;
};

describe('updateChildNodes()', () => {
  it('should append all new child nodes given the current parent element has no children', () => {
    const currentParentElement = createElement('main');
    const newChildNodes = [
      document.createTextNode('test'),
      document.createElement('span'),
      document.createElement('div'),
    ];
    updateChildNodes(currentParentElement, createFragment(newChildNodes));
    expect(() => currentParentElement.childNodes[0] == newChildNodes[0]);
    expect(() => currentParentElement.childNodes[1] == newChildNodes[1]);
    expect(() => currentParentElement.childNodes[2] == newChildNodes[2]);
  });

  it('should remove all current child nodes given the new parent element has no child nodes', () => {
    const currentParentElement = document.createElement('main');
    currentParentElement.innerHTML = 'test<span></span><div></div>';
    updateChildNodes(currentParentElement, document.createDocumentFragment());
    expect(() => currentParentElement.childNodes.length == 0);
  });

  it('should append additional child nodes not contained in the current parent element', () => {
    const currentSpanElement = document.createElement('span');
    const currentParentElement = createElement('main', [currentSpanElement]);
    const newSpanElement = document.createElement('span');
    const newDivElement = document.createElement('div');
    updateChildNodes(currentParentElement, createFragment([newSpanElement, newDivElement]));
    expect(() => currentParentElement.childNodes[0] == currentSpanElement);
    expect(() => currentParentElement.childNodes[1] == newDivElement);
  });

  it('should remove all current nodes not contained in the new parent element', () => {
    const currentParentElement = createElement('main', [
      document.createElement('span'),
      document.createElement('div'),
    ]);
    updateChildNodes(currentParentElement, createFragment([document.createElement('span')]));
    expect(() => currentParentElement.childNodes.length == 1);
    expect(() => currentParentElement.childNodes[0].nodeName == 'SPAN');
  });

  it('should replace a current child node with a new child node given a different node name', () => {
    const currentParentElement = createElement('main', [document.createElement('span')]);
    const newChildElement = document.createElement('div');
    updateChildNodes(currentParentElement, createFragment([newChildElement]));
    expect(() => currentParentElement.childNodes[0] == newChildElement);
  });

  it('should replace a current child node with a new child node a given different node type', () => {
    const currentParentElement = createElement('main', [document.createTextNode('test')]);
    const newChildElement = document.createElement('div');
    updateChildNodes(currentParentElement, createFragment([newChildElement]));
    expect(() => currentParentElement.childNodes[0] == newChildElement);
  });

  it('should update the text content given a current and a new text node', () => {
    const currentTextNode = document.createTextNode('initial');
    const currentParentElement = createElement('main', [currentTextNode]);
    const newParentElement = createFragment([document.createTextNode('new')]);
    updateChildNodes(currentParentElement, newParentElement);
    expect(() => currentParentElement.childNodes[0] == currentTextNode);
    expect(() => currentParentElement.childNodes[0].textContent == 'new');
  });

  it('should remove all attributes of a current element that do not exist on the new element', () => {
    const currentChildElement = document.createElement('div');
    currentChildElement.setAttribute('one', '1');
    currentChildElement.setAttribute('two', '1');
    const currentParentElement = createElement('main', [currentChildElement]);
    updateChildNodes(currentParentElement, createFragment([document.createElement('div')]));
    const child = currentParentElement.childNodes[0] as Element;
    expect(() => child == currentChildElement);
    expect(() => !child.hasAttribute('one'));
    expect(() => !child.hasAttribute('two'));
  });

  it('should add all attributes to a current element that only exist on the new element', () => {
    const currentChildElement = document.createElement('div');
    const currentParentElement = createElement('main', [currentChildElement]);
    const newChildElement = document.createElement('div');
    newChildElement.setAttribute('one', '1');
    newChildElement.setAttribute('two', '2');
    updateChildNodes(currentParentElement, createFragment([newChildElement]));
    const child = currentParentElement.childNodes[0] as Element;
    expect(() => child == currentChildElement);
    expect(() => child.getAttribute('one') == '1');
    expect(() => child.getAttribute('two') == '2');
  });

  it('should update all attributes of a current element that also exist on the new element', () => {
    const currentChildElement = document.createElement('div');
    currentChildElement.setAttribute('value', 'initial');
    const currentParentElement = createElement('main', [currentChildElement]);
    const divElement = document.createElement('div');
    divElement.setAttribute('value', 'updated');
    updateChildNodes(currentParentElement, createFragment([divElement]));
    const child = currentParentElement.childNodes[0] as Element;
    expect(() => child == currentChildElement);
    expect(() => child.getAttribute('value') == 'updated');
  });

  it('should update the properties of non-reflected attributes (e.g. value)', () => {
    const currentChildElement = document.createElement('input');
    currentChildElement.setAttribute('type', 'text');
    currentChildElement.setAttribute('value', 'foo');
    const currentParentElement = createElement('main', [currentChildElement]);
    const newChildElement = document.createElement('input');
    newChildElement.setAttribute('type', 'text');
    newChildElement.setAttribute('value', 'bar');
    newChildElement.setAttribute('disabled', '');
    updateChildNodes(currentParentElement, createFragment([newChildElement]));
    const child = currentParentElement.childNodes[0] as HTMLInputElement;
    expect(() => child == currentChildElement);
    expect(() => child.disabled === true);
    expect(() => child.value === 'bar');
  });

  it('should never remove the "scope" attribute from a current element', () => {
    const currentChildElement = document.createElement('div');
    currentChildElement.setAttribute('scope', '');
    const currentParentElement = createElement('main', [currentChildElement]);
    const newChildElement = document.createElement('div');
    updateChildNodes(currentParentElement, createFragment([newChildElement]));
    expect(() => (<Element>currentParentElement.childNodes[0]).hasAttribute('scope'));
  });

  it('should update all nested child nodes', () => {
    const currentParentElement = document.createElement('div');
    currentParentElement.innerHTML = '<main><article><h1>Initial</h1><h2></h2></article></main>';
    const newParentElement = document.createDocumentFragment();
    const mainElement = document.createElement('main');
    mainElement.innerHTML = '<article><h1>Updated</h1><p></p></article>';
    newParentElement.appendChild(mainElement);
    updateChildNodes(currentParentElement, newParentElement);
    expect(
      () =>
        currentParentElement.innerHTML == '<main><article><h1>Updated</h1><p></p></article></main>'
    );
  });

  it('should request to update an element with a scope attribute when its attributes change', () => {
    const currentChildElement = document.createElement('x-test');
    currentChildElement.setAttribute('scope', '');
    currentChildElement.setAttribute('value', 'initial');
    let wasUpdateCalled = false;
    // @ts-ignore
    currentChildElement.update = () => {
      wasUpdateCalled = true;
    };
    const currentParentElement = createElement('div', [currentChildElement]);
    currentParentElement.appendChild(currentChildElement);
    const newChildElement = document.createElement('x-test');
    newChildElement.setAttribute('value', 'updated');
    const newParentElement = createFragment([newChildElement]);
    updateChildNodes(currentParentElement, newParentElement);
    expect(() => wasUpdateCalled == true);
  });

  it('should not request to update an element with a scope attribute when attributes do not change', () => {
    const currentChildElement = document.createElement('x-test');
    currentChildElement.setAttribute('scope', '');
    currentChildElement.setAttribute('value', 'initial');
    let wasUpdateCalled = false;
    // @ts-ignore
    currentChildElement.update = () => {
      wasUpdateCalled = true;
    };
    const currentParentElement = createElement('div', [currentChildElement]);
    currentParentElement.appendChild(currentChildElement);
    const newCustomElement = document.createElement('x-test');
    newCustomElement.setAttribute('value', 'initial');
    const newParentElement = createFragment([newCustomElement]);
    updateChildNodes(currentParentElement, newParentElement);
    expect(() => wasUpdateCalled == false);
  });

  describe('keyed elements', () => {
    it('should update a current keyed element given a new element with the same key at the same position', () => {
      const currentKeyedChild = document.createElement('main');
      currentKeyedChild.setAttribute('key', 'unique-element');
      currentKeyedChild.innerHTML = 'text';
      const currentParentElement = createElement('main', [
        currentKeyedChild,
        document.createElement('div'),
      ]);
      const newKeyedChild = document.createElement('div');
      newKeyedChild.setAttribute('key', 'unique-element');
      newKeyedChild.setAttribute('foo', 'foo');
      newKeyedChild.innerHTML = 'updated text';
      const newParentElement = createFragment([newKeyedChild, document.createElement('div')]);
      updateChildNodes(currentParentElement, newParentElement);
      expect(() => currentParentElement.childNodes[0] == currentKeyedChild);
      expect(() => currentKeyedChild.hasAttribute('foo'));
      expect(() => currentKeyedChild.innerHTML == 'updated text');
    });

    it('should move a keyed element preceded by other elements given they are removed in the new child nodes', () => {
      const currentKeyedChild = document.createElement('main');
      currentKeyedChild.setAttribute('key', 'unique-element');
      currentKeyedChild.innerHTML = 'text';
      const currentParentElement = createElement('main', [
        document.createElement('div'),
        document.createElement('div'),
        currentKeyedChild,
      ]);
      const newKeyedChild = document.createElement('div');
      newKeyedChild.setAttribute('key', 'unique-element');
      const newParentElement = createFragment([newKeyedChild]);
      updateChildNodes(currentParentElement, newParentElement);
      expect(() => currentParentElement.childNodes[0] == currentKeyedChild);
    });

    it('should move a keyed element preceded by text nodes given they are removed in the new child nodes', () => {
      const currentKeyedChild = document.createElement('main');
      currentKeyedChild.setAttribute('key', 'unique-element');
      currentKeyedChild.innerHTML = 'text';
      const currentParentElement = createElement('main', [
        document.createTextNode('text'),
        document.createTextNode('text'),
        currentKeyedChild,
      ]);
      const newKeyedChild = document.createElement('div');
      newKeyedChild.setAttribute('key', 'unique-element');
      const newParentElement = createFragment([newKeyedChild]);
      updateChildNodes(currentParentElement, newParentElement);
      expect(() => currentParentElement.childNodes[0] == currentKeyedChild);
    });

    it('should update a current keyed element given a new element with the same key at another position', () => {
      const currentKeyedChild = document.createElement('main');
      currentKeyedChild.setAttribute('key', 'unique-element');
      currentKeyedChild.innerHTML = 'text';
      const currentParentElement = createElement('main', [
        document.createElement('div'),
        currentKeyedChild,
      ]);
      const newKeyedChild = document.createElement('div');
      newKeyedChild.setAttribute('key', 'unique-element');
      newKeyedChild.setAttribute('status', 'updated');
      newKeyedChild.innerHTML = 'updated text';
      const newParentElement = createFragment([newKeyedChild, document.createElement('div')]);
      updateChildNodes(currentParentElement, newParentElement);
      expect(() => currentKeyedChild.getAttribute('status') == 'updated');
      expect(() => currentKeyedChild.innerHTML == 'updated text');
    });

    it('should insert a new existing keyed element and push other non keyed elements down', () => {
      const currentFormElement = document.createElement('form');
      const currentParentElement = createElement('main', [currentFormElement]);
      const newKeyedChild = document.createElement('div');
      newKeyedChild.setAttribute('key', 'unique-element');
      const newParentElement = createFragment([newKeyedChild, document.createElement('form')]);
      updateChildNodes(currentParentElement, newParentElement);
      expect(() => currentParentElement.childNodes[1] == currentFormElement);
    });

    it('should insert a new existing keyed element and push other keyed elements down that exist in the new child nodes', () => {
      const currentFirstKeyedChild = document.createElement('div');
      currentFirstKeyedChild.setAttribute('key', 'unique-element-1');
      const currentParentElement = createElement('main', [currentFirstKeyedChild]);
      const newSecondKeyedChild = document.createElement('div');
      newSecondKeyedChild.setAttribute('key', 'unique-element-2');
      const newFirstKeyedChild = document.createElement('div');
      newFirstKeyedChild.setAttribute('key', 'unique-element-1');
      const newParentElement = createFragment([newSecondKeyedChild, newFirstKeyedChild]);
      updateChildNodes(currentParentElement, newParentElement);
      expect(() => currentParentElement.childNodes[1] == currentFirstKeyedChild);
    });

    it('should update an existing keyed element that is pushed down due to a new keyed element', () => {
      const currentFirstKeyedChild = document.createElement('div');
      currentFirstKeyedChild.setAttribute('key', 'unique-element-1');
      const currentParentElement = createElement('main', [currentFirstKeyedChild]);
      const newSecondKeyedChild = document.createElement('div');
      newSecondKeyedChild.setAttribute('key', 'unique-element-2');
      const newFirstKeyedChild = document.createElement('div');
      newFirstKeyedChild.setAttribute('key', 'unique-element-1');
      newFirstKeyedChild.setAttribute('status', 'updated');
      const newParentElement = createFragment([newSecondKeyedChild, newFirstKeyedChild]);
      updateChildNodes(currentParentElement, newParentElement);
      expect(() => currentParentElement.childNodes[1] == currentFirstKeyedChild);
      expect(() => currentFirstKeyedChild.getAttribute('status') == 'updated');
    });

    it('should replace a new keyed element with a current keyed one that is removed from the new child nodes', () => {
      const currentKeyChild = document.createElement('div');
      currentKeyChild.setAttribute('key', 'unique-element-1');
      const currentParentElement = createElement('main', [currentKeyChild]);
      const newOtherKeyedChild = document.createElement('div');
      newOtherKeyedChild.setAttribute('key', 'unique-element-2');
      const newParentElement = createFragment([newOtherKeyedChild]);
      updateChildNodes(currentParentElement, newParentElement);
      expect(() => currentParentElement.childNodes[0] == newOtherKeyedChild);
    });
  });
});
