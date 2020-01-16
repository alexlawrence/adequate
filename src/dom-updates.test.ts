const { describe, expect, it } = <any>window;

import { updateChildNodes } from './dom-updates';
import { functionAttributeStart } from './element';

type MaybeAdequateElement = HTMLElement & { update?: () => void };

const createFragment = (childNodes: Node[] = []) => {
  const newParentElement = document.createDocumentFragment();
  childNodes.forEach((node) => newParentElement.appendChild(node));
  return newParentElement;
};

const createElement = (nodeName: string, childNodes: Node[] = []) => {
  const newParentElement = document.createElement(nodeName);
  childNodes.forEach((node) => newParentElement.appendChild(node));
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

  it('should replace a current child node with a new child node given a different node type', () => {
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
    const child = currentParentElement.childNodes[0] as HTMLElement;
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
    const child = currentParentElement.childNodes[0] as HTMLElement;
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
    const child = currentParentElement.childNodes[0] as HTMLElement;
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
        currentParentElement.innerHTML == '<main><article><h1>Updated</h1><p></p></article></main>',
    );
  });

  describe('adequate elements as children', () => {
    it('should not update the children of an adequate element', () => {
      const currentChildElement: MaybeAdequateElement = document.createElement('x-test');
      currentChildElement.update = () => {};
      currentChildElement.innerHTML = '<p>Some child</p>';
      const currentParentElement = createElement('div', [currentChildElement]);
      currentParentElement.appendChild(currentChildElement);
      const newChildElement: MaybeAdequateElement = document.createElement('x-test');
      newChildElement.update = () => {};
      newChildElement.innerHTML = '';
      const newParentElement = createFragment([newChildElement]);
      updateChildNodes(currentParentElement, newParentElement);
      expect(() => currentChildElement.querySelector('p')?.innerText == 'Some child');
    });

    it('should call the update() function of an adequate element when an attribute changed', () => {
      const currentChildElement: MaybeAdequateElement = document.createElement('x-test');
      currentChildElement.update = () => (currentChildElement.innerHTML = 'updated');
      currentChildElement.setAttribute('data-type', 'foo');
      const currentParentElement = createElement('div', [currentChildElement]);
      currentParentElement.appendChild(currentChildElement);
      const newChildElement: MaybeAdequateElement = document.createElement('x-test');
      newChildElement.update = () => (newChildElement.innerHTML = 'updated');
      newChildElement.setAttribute('data-type', 'bar');
      const newParentElement = createFragment([newChildElement]);
      updateChildNodes(currentParentElement, newParentElement);
      expect(() => currentChildElement.innerHTML == 'updated');
    });

    it('should call the update() function of an adequate element when an attribute is removed', () => {
      const currentChildElement: MaybeAdequateElement = document.createElement('x-test');
      currentChildElement.update = () => (currentChildElement.innerHTML = 'updated');
      currentChildElement.setAttribute('data-type', 'foo');
      const currentParentElement = createElement('div', [currentChildElement]);
      currentParentElement.appendChild(currentChildElement);
      const newChildElement: MaybeAdequateElement = document.createElement('x-test');
      newChildElement.update = () => (newChildElement.innerHTML = 'updated');
      const newParentElement = createFragment([newChildElement]);
      updateChildNodes(currentParentElement, newParentElement);
      expect(() => currentChildElement.innerHTML == 'updated');
    });

    it('should call the update() function of an adequate element when an attribute is added', () => {
      const currentChildElement: MaybeAdequateElement = document.createElement('x-test');
      currentChildElement.update = () => (currentChildElement.innerHTML = 'updated');
      const currentParentElement = createElement('div', [currentChildElement]);
      currentParentElement.appendChild(currentChildElement);
      const newChildElement: MaybeAdequateElement = document.createElement('x-test');
      newChildElement.update = () => (newChildElement.innerHTML = 'updated');
      newChildElement.setAttribute('data-type', 'foo');
      const newParentElement = createFragment([newChildElement]);
      updateChildNodes(currentParentElement, newParentElement);
      expect(() => currentChildElement.innerHTML == 'updated');
    });

    it('should not call the update() function of an adequate element when no attribute changes', () => {
      const currentChildElement: MaybeAdequateElement = document.createElement('x-test');
      currentChildElement.update = () => (currentChildElement.innerHTML = 'updated');
      currentChildElement.setAttribute('data-type', 'foo');
      const currentParentElement = createElement('div', [currentChildElement]);
      currentParentElement.appendChild(currentChildElement);
      const newChildElement: MaybeAdequateElement = document.createElement('x-test');
      newChildElement.update = () => (newChildElement.innerHTML = 'updated');
      newChildElement.setAttribute('data-type', 'foo');
      const newParentElement = createFragment([newChildElement]);
      updateChildNodes(currentParentElement, newParentElement);
      expect(() => currentChildElement.innerHTML == '');
    });

    it('should call the update() function of an adequate element when attribute is a function', () => {
      const currentChildElement: MaybeAdequateElement = document.createElement('x-test');
      currentChildElement.update = () => (currentChildElement.innerHTML = 'updated');
      currentChildElement.setAttribute('data-type', functionAttributeStart);
      const currentParentElement = createElement('div', [currentChildElement]);
      currentParentElement.appendChild(currentChildElement);
      const newChildElement: MaybeAdequateElement = document.createElement('x-test');
      newChildElement.update = () => (newChildElement.innerHTML = 'updated');
      newChildElement.setAttribute('data-type', functionAttributeStart);
      const newParentElement = createFragment([newChildElement]);
      updateChildNodes(currentParentElement, newParentElement);
      expect(() => currentChildElement.innerHTML == 'updated');
    });
  });

  describe('keyed elements', () => {
    it('should update a current keyed element given a new element with the same key at the same position', () => {
      const currentKeyedChild = document.createElement('div');
      currentKeyedChild.setAttribute('data-key', 'unique-element');
      currentKeyedChild.innerHTML = 'text';
      const currentParentElement = createElement('main', [
        currentKeyedChild,
        document.createElement('div'),
      ]);
      const newKeyedChild = document.createElement('div');
      newKeyedChild.setAttribute('data-key', 'unique-element');
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
      currentKeyedChild.setAttribute('data-key', 'unique-element');
      currentKeyedChild.innerHTML = 'text';
      const currentParentElement = createElement('main', [
        document.createElement('div'),
        document.createElement('div'),
        currentKeyedChild,
      ]);
      const newKeyedChild = document.createElement('div');
      newKeyedChild.setAttribute('data-key', 'unique-element');
      const newParentElement = createFragment([newKeyedChild]);
      updateChildNodes(currentParentElement, newParentElement);
      expect(() => currentParentElement.childNodes[0] == currentKeyedChild);
    });

    it('should move a keyed element preceded by text nodes given they are removed in the new child nodes', () => {
      const currentKeyedChild = document.createElement('main');
      currentKeyedChild.setAttribute('data-key', 'unique-element');
      currentKeyedChild.innerHTML = 'text';
      const currentParentElement = createElement('main', [
        document.createTextNode('text'),
        document.createTextNode('text'),
        currentKeyedChild,
      ]);
      const newKeyedChild = document.createElement('div');
      newKeyedChild.setAttribute('data-key', 'unique-element');
      const newParentElement = createFragment([newKeyedChild]);
      updateChildNodes(currentParentElement, newParentElement);
      expect(() => currentParentElement.childNodes[0] == currentKeyedChild);
    });

    it('should update a current keyed element given a new element with the same key at another position', () => {
      const currentKeyedChild = document.createElement('main');
      currentKeyedChild.setAttribute('data-key', 'unique-element');
      currentKeyedChild.innerHTML = 'text';
      const currentParentElement = createElement('main', [
        document.createElement('div'),
        currentKeyedChild,
      ]);
      const newKeyedChild = document.createElement('div');
      newKeyedChild.setAttribute('data-key', 'unique-element');
      newKeyedChild.setAttribute('status', 'updated');
      newKeyedChild.innerHTML = 'updated text';
      const newParentElement = createFragment([newKeyedChild, document.createElement('div')]);
      updateChildNodes(currentParentElement, newParentElement);
      expect(() => currentKeyedChild.getAttribute('status') == 'updated');
      expect(() => currentKeyedChild.innerHTML == 'updated text');
    });

    it('should insert a new keyed element and push other elements down', () => {
      const currentFormElement = document.createElement('form');
      const currentParentElement = createElement('main', [currentFormElement]);
      const newKeyedChild = document.createElement('div');
      newKeyedChild.setAttribute('data-key', 'unique-element');
      const newParentElement = createFragment([newKeyedChild, document.createElement('form')]);
      updateChildNodes(currentParentElement, newParentElement);
      expect(() => currentParentElement.childNodes[1] == currentFormElement);
    });

    it('should insert a new keyed element and push other keyed elements down that exist in the new child nodes', () => {
      const currentFirstKeyedChild = document.createElement('div');
      currentFirstKeyedChild.setAttribute('data-key', 'unique-element-1');
      const currentParentElement = createElement('main', [currentFirstKeyedChild]);
      const newSecondKeyedChild = document.createElement('div');
      newSecondKeyedChild.setAttribute('data-key', 'unique-element-2');
      const newFirstKeyedChild = document.createElement('div');
      newFirstKeyedChild.setAttribute('data-key', 'unique-element-1');
      const newParentElement = createFragment([newSecondKeyedChild, newFirstKeyedChild]);
      updateChildNodes(currentParentElement, newParentElement);
      expect(() => currentParentElement.childNodes[1] == currentFirstKeyedChild);
    });

    it('should update an existing keyed element that is pushed down due to a new keyed element', () => {
      const currentFirstKeyedChild = document.createElement('div');
      currentFirstKeyedChild.setAttribute('data-key', 'unique-element-1');
      const currentParentElement = createElement('main', [currentFirstKeyedChild]);
      const newSecondKeyedChild = document.createElement('div');
      newSecondKeyedChild.setAttribute('data-key', 'unique-element-2');
      const newFirstKeyedChild = document.createElement('div');
      newFirstKeyedChild.setAttribute('data-key', 'unique-element-1');
      newFirstKeyedChild.setAttribute('status', 'updated');
      const newParentElement = createFragment([newSecondKeyedChild, newFirstKeyedChild]);
      updateChildNodes(currentParentElement, newParentElement);
      expect(() => currentParentElement.childNodes[1] == currentFirstKeyedChild);
      expect(() => currentFirstKeyedChild.getAttribute('status') == 'updated');
    });

    it('should replace a new keyed element with a current keyed one that is removed from the new child nodes', () => {
      const currentKeyedChild = document.createElement('div');
      currentKeyedChild.setAttribute('data-key', 'unique-element-1');
      const currentParentElement = createElement('main', [currentKeyedChild]);
      const newOtherKeyedChild = document.createElement('div');
      newOtherKeyedChild.setAttribute('data-key', 'unique-element-2');
      const newParentElement = createFragment([newOtherKeyedChild]);
      updateChildNodes(currentParentElement, newParentElement);
      expect(() => currentParentElement.childNodes[0] == newOtherKeyedChild);
    });

    it('should replace a current keyed element with a new one given they have different tag names', () => {
      const currentKeyedChild = document.createElement('div');
      currentKeyedChild.setAttribute('data-key', 'unique-element-1');
      const currentParentElement = createElement('main', [currentKeyedChild]);
      const newKeyedChild = document.createElement('span');
      newKeyedChild.setAttribute('data-key', 'unique-element-1');
      const newParentElement = createFragment([newKeyedChild]);
      updateChildNodes(currentParentElement, newParentElement);
      expect(() => currentParentElement.childNodes[0] == newKeyedChild);
    });
  });
});
