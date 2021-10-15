import { AdequateElement, functionAttributeStart } from './element';

type IndexableElement = HTMLElement & { [key: string]: unknown };

const nonReflectedAttributesRegex = /^(checked|disabled|selected|value)$/;

const updateChildNodes = (
  currentElement: HTMLElement,
  newElement: HTMLElement | DocumentFragment,
) => {
  const newChildNodes = Array.from(newElement.childNodes);
  newChildNodes.forEach((newChildNode, index) => {
    const currentChildNode = currentElement.childNodes[index];
    if (!currentChildNode) {
      return currentElement.appendChild(newChildNode) as any;
    }
    const newChildKey = getElementKey(newChildNode);
    const currentChildKey = getElementKey(currentChildNode);
    // NOTE: This also evaluates to true if both elements do not have keys
    if (currentChildKey == newChildKey) updateNode(currentChildNode, newChildNode);
    else {
      const otherCurrentChildNodeWithNewKey =
        newChildKey && getElementByKey(currentElement, newChildKey);
      const currentChildNodeShouldBeRemoved =
        currentChildKey && !getElementByKey(newElement, currentChildKey);
      const operationToExecute = currentChildNodeShouldBeRemoved ? 'replaceChild' : 'insertBefore';
      const nodeToInsert = otherCurrentChildNodeWithNewKey || newChildNode;
      currentElement[operationToExecute](nodeToInsert, currentChildNode);
      if (otherCurrentChildNodeWithNewKey)
        updateElement(
          otherCurrentChildNodeWithNewKey as IndexableElement,
          newChildNode as IndexableElement,
        );
    }
  });
  removeExtraneousChildren(currentElement, newChildNodes.length);
};

const updateNode = (currentNode: Node, newNode: Node) => {
  const newNodeType = newNode.nodeType;
  if (newNodeType != currentNode.nodeType || newNode.nodeName != currentNode.nodeName) {
    currentNode.parentNode!.replaceChild(newNode, currentNode);
  } else if (newNodeType == 3) {
    if (currentNode.nodeValue != newNode.nodeValue) {
      currentNode.nodeValue = newNode.nodeValue;
    }
  } else if (newNodeType == 1)
    updateElement(currentNode as IndexableElement, newNode as IndexableElement);
};

const updateElement = (currentElement: IndexableElement, newElement: IndexableElement) => {
  let adequateElementMustUpdate = false;
  Array.from(newElement.attributes)
    .filter(
      (attribute) =>
        attribute.value != currentElement.getAttribute(attribute.name) ||
        !attribute.value.indexOf(functionAttributeStart),
    )
    .forEach(({ name, value }) => {
      adequateElementMustUpdate = true;
      currentElement.setAttribute(name, value);
      if (nonReflectedAttributesRegex.test(name)) {
        currentElement[name] = newElement[name];
      }
    });
  Array.from(currentElement.attributes)
    .filter((attribute) => !newElement.hasAttribute(attribute.name))
    .forEach(({ name }) => {
      adequateElementMustUpdate = true;
      currentElement.removeAttribute(name);
      if (nonReflectedAttributesRegex.test(name)) {
        currentElement[name] = newElement[name];
      }
    });
  if (!currentElement.update) updateChildNodes(currentElement, newElement);
  else if (adequateElementMustUpdate)
    (currentElement as IndexableElement & AdequateElement).update();
};

const getElementKey = (node: Node) =>
  node.nodeType == 1 && (node as HTMLElement).getAttribute('data-key');

const getElementByKey = (parentElement: HTMLElement | DocumentFragment, key: string) =>
  parentElement.querySelector(`:scope [data-key="${key}"]`);

const removeExtraneousChildren = (node: HTMLElement, startIndex: number) => {
  const range = document.createRange();
  range.selectNodeContents(node);
  range.setStart(node, startIndex);
  range.deleteContents();
};

export { updateChildNodes };
