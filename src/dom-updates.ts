import arrayFrom from './helper/array-from';

type IndexableElement = Element & { [key: string]: string };
type AdequateElement = IndexableElement & { update: () => {} };

const nonReflectedAttributes = ['checked', 'disabled', 'selected', 'value'];

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
      const nodeToMove = otherCurrentChildNodeWithNewKey || newChildNode;
      // @ts-ignore
      currentParentElement[operationToExecute](nodeToMove, currentChildNode);
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
    };
  } else if (newNodeType == 1)
    updateElement(currentNode as IndexableElement, newNode as IndexableElement);
};

const updateElement = (currentElement: IndexableElement, newElement: IndexableElement) => {
  const currentAttributes = arrayFrom(currentElement.attributes);
  const newAttributes = arrayFrom(newElement.attributes);
  const attributesToSet = newAttributes.filter(
    attribute => attribute.value != currentElement.getAttribute(attribute.name)
  );
  const attributesToRemove = currentAttributes
    .filter(attribute => attribute.name != 'scope' && !newElement.hasAttribute(attribute.name))
    .map<{ name: string }>(({ name }) => ({ name }));
  const attributesToUpdate: { name: string; value?: string }[] = [
    ...attributesToSet,
    ...attributesToRemove,
  ];
  attributesToUpdate.forEach(attribute => {
    const attributeName = attribute.name;
    if (attribute.value != null) currentElement.setAttribute(attributeName, attribute.value);
    else currentElement.removeAttribute(attributeName);
    if (nonReflectedAttributes.includes(attributeName)) {
      currentElement[attributeName] = newElement[attributeName];
    }
  });
  if (!currentElement.hasAttribute('scope')) {
    updateChildNodes(currentElement, newElement);
  } else if (attributesToUpdate[0]) {
    (currentElement as AdequateElement).update();
  }
};

const getChildNodes = (node: Node) => node.childNodes;

const getElementKey = (node: Node) => node.nodeType == 1 && (node as Element).getAttribute('key');

const getElementByKey = (parentElement: Element | DocumentFragment, key: string) =>
  parentElement.querySelector(`:scope [key="${key}"]`);

const removeExtraneousChildren = (childNodes: NodeListOf<ChildNode>, startIndex: number) => {
  arrayFrom(childNodes)
    .slice(startIndex)
    .forEach(node => node.remove());
};

export { updateChildNodes };
