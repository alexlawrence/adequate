import arrayFrom from './helper/array-from';
import { scopeAttributeName } from './element';

type IndexableElement = Element & { [key: string]: string };

const nonReflectedAttributes = ['checked', 'disabled', 'selected', 'value'];
const keyAttributeName = 'data-key';

const updateChildNodes = (
  currentParentElement: Element,
  newParentElement: Element | DocumentFragment
) => {
  const newChildNodes = arrayFrom(getChildNodes(newParentElement));
  newChildNodes.forEach((newChildNode, index) => {
    const currentChildNode = getChildNodes(currentParentElement)[index];
    if (!currentChildNode) {
      currentParentElement.appendChild(newChildNode);
      return;
    }
    const newChildNodeKey = getElementKey(newChildNode);
    const currentChildKey = getElementKey(currentChildNode);
    if (!currentChildKey && !newChildNodeKey) updateNode(currentChildNode, newChildNode);
    else if (currentChildKey == newChildNodeKey)
      updateElement(<IndexableElement>currentChildNode, <IndexableElement>newChildNode);
    else {
      const otherCurrentChildNodeWithNewKey =
        newChildNodeKey && getElementByKey(currentParentElement, newChildNodeKey);
      const currentChildNodeShouldBeRemoved =
        currentChildKey && !getElementByKey(newParentElement, currentChildKey);
      const operationToExecute = currentChildNodeShouldBeRemoved ? 'replaceChild' : 'insertBefore';
      const nodeToInsert = otherCurrentChildNodeWithNewKey || newChildNode;
      // @ts-ignore
      currentParentElement[operationToExecute](nodeToInsert, currentChildNode);
      if (otherCurrentChildNodeWithNewKey)
        updateElement(
          <IndexableElement>otherCurrentChildNodeWithNewKey,
          <IndexableElement>newChildNode
        );
    }
  });
  removeExtraneousChildren(getChildNodes(currentParentElement), newChildNodes.length);
};

const updateNode = (currentNode: Node, newNode: Node) => {
  const newNodeType = newNode.nodeType;
  if (newNodeType != currentNode.nodeType || newNode.nodeName != currentNode.nodeName) {
    currentNode.parentNode?.replaceChild(newNode, currentNode);
  } else if (newNodeType == 3) {
    if (currentNode.nodeValue != newNode.nodeValue) {
      currentNode.nodeValue = newNode.nodeValue;
    }
  } else if (newNodeType == 1)
    updateElement(currentNode as IndexableElement, newNode as IndexableElement);
};

const updateElement = (currentElement: IndexableElement, newElement: IndexableElement) => {
  arrayFrom(newElement.attributes)
    .filter(attribute => attribute.value != currentElement.getAttribute(attribute.name))
    .forEach(({ name, value }) => {
      currentElement.setAttribute(name, value);
      if (nonReflectedAttributes.includes(name)) {
        currentElement[name] = newElement[name];
      }
    });
  arrayFrom(currentElement.attributes)
    .filter(
      attribute => attribute.name != scopeAttributeName && !newElement.hasAttribute(attribute.name)
    )
    .forEach(({ name }) => {
      currentElement.removeAttribute(name);
      if (nonReflectedAttributes.includes(name)) {
        currentElement[name] = newElement[name];
      }
    });
  if (!currentElement.hasAttribute(scopeAttributeName)) {
    updateChildNodes(currentElement, newElement);
  }
};

const getChildNodes = (node: Node) => node.childNodes;

const getElementKey = (node: Node) =>
  node.nodeType == 1 && (node as Element).getAttribute(keyAttributeName);

const getElementByKey = (parentElement: Element | DocumentFragment, key: string) =>
  parentElement.querySelector(`:scope [${keyAttributeName}="${key}"]`);

const removeExtraneousChildren = (childNodes: NodeListOf<ChildNode>, startIndex: number) => {
  arrayFrom(childNodes)
    .slice(startIndex)
    .forEach(node => node.remove());
};

export { updateChildNodes };
