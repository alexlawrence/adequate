import arrayFrom from './helper/array-from';

type CustomEventHandlers = {
  [eventType: string]: {
    handler_: (event: Event) => void;
    functionText_: string;
  };
};

const updateCustomEventHandlers = (element: Element, customEventHandlers: CustomEventHandlers) => {
  const customEventHandlerAttributes = arrayFrom(element.attributes).filter(
    ({ name }) => /^on/.test(name) && !(name in element)
  );
  customEventHandlerAttributes.forEach(attribute => {
    const eventType = attribute.name.slice(2);
    const functionText = attribute.value;
    const currentEventHandler = customEventHandlers[eventType];
    if (!currentEventHandler || currentEventHandler.functionText_ != functionText) {
      if (currentEventHandler) element.removeEventListener(eventType, currentEventHandler.handler_);
      const handler = new Function(functionText).bind(element);
      customEventHandlers[eventType] = { handler_: handler, functionText_: functionText };
      element.addEventListener(eventType, handler);
    }
  });
  Object.entries(customEventHandlers).forEach(([eventType, { handler_ }]) => {
    if (!element.hasAttribute('on' + eventType)) {
      element.removeEventListener(eventType, handler_);
      delete customEventHandlers[eventType];
    }
  });
};

export { CustomEventHandlers, updateCustomEventHandlers };
