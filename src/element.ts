import { TemplateTokenArray } from './template-literal-processor';
import { createFragment } from './template-factory';
import { updateChildNodes } from './dom-updates';
import { setStateScope } from './state-hook';
import { CustomEventHandlers, updateCustomEventHandlers } from './event-handler-updates';

type ExtractedFunctionExpressions = Function[];

const scopeAttributeName = 'scope';

type Constructor<T> = new (...args: any[]) => T;

const AdequateElement = <T extends Constructor<HTMLElement>>(BaseElementClass: T) => {
  return class extends BaseElementClass {
    f!: ExtractedFunctionExpressions;
    stateList_: any[];
    customEventHandlers_: CustomEventHandlers;

    render?(): TemplateTokenArray;

    constructor(..._: any[]) {
      super();
      this.stateList_ = [];
      this.customEventHandlers_ = {};
    }

    connectedCallback() {
      this.setAttribute(scopeAttributeName, '');
      this.update();
    }

    update() {
      const self = this;
      const extractedFunctionExpressions: Function[] = [];
      setStateScope(self.stateList_, () => window.requestAnimationFrame(() => self.update()));
      updateCustomEventHandlers(self, this.customEventHandlers_);
      const templateLiteralTokens = self.render!.call(self);
      const processedTokens = templateLiteralTokens.map(token =>
        token && (token as Function).call
          ? `return this.parentNode.closest('[${scopeAttributeName}]').f[${extractedFunctionExpressions.push(
              token as Function
            ) - 1}](...arguments)`
          : token
      );
      self.f = extractedFunctionExpressions;
      updateChildNodes(self, createFragment(processedTokens.join('')));
    }
  };
};

export { AdequateElement, scopeAttributeName };
