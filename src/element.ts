import { TemplateTokenArray } from './template-literal-processor';
import { createFragment } from './template-factory';
import { updateChildNodes } from './dom-updates';
import { setStateScope } from './state-hook';
import { CustomEventHandlers, updateCustomEventHandlers } from './event-handler-updates';

type RenderFunction = (this: HTMLElement, element: HTMLElement) => TemplateTokenArray;
type ExtractedFunctionExpressions = Function[];

const AdequateElement = (BaseElementClass = HTMLElement) => {
  return class extends BaseElementClass {
    f!: ExtractedFunctionExpressions;
    stateList_: any[];
    customEventHandlers_: CustomEventHandlers;
    render!: RenderFunction;

    constructor() {
      super();
      this.stateList_ = [];
      this.customEventHandlers_ = {};
    }

    connectedCallback() {
      this.setAttribute('scope', '');
      this.update();
    }

    update() {
      const self = this;
      const extractedFunctionExpressions: Function[] = [];
      setStateScope(self.stateList_, () => window.requestAnimationFrame(() => self.update()));
      updateCustomEventHandlers(self, this.customEventHandlers_);
      const templateLiteralTokens = self.render.call(self, self);
      const processedTokens = templateLiteralTokens.map(token =>
        token && (token as Function).call
          ? `return this.parentNode.closest('[scope]').f[${extractedFunctionExpressions.push(
            token as Function
          ) - 1}](...arguments)`
          : token
      );
      self.f = extractedFunctionExpressions;
      updateChildNodes(self, createFragment(processedTokens.join('')));
    }
  };
};

export { AdequateElement };
