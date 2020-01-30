import { TemplateTokenArray } from './template-literal-processor';
import { createFragment } from './template-factory';
import { updateChildNodes } from './dom-updates';
import { setStateScope } from './state-hook';
import { createRenderArguments, RenderArguments } from './render-arguments-factory';
import { CustomEventHandlers, updateCustomEventHandlers } from './event-handler-updates';

type RenderFunction = (this: HTMLElement, renderArguments: RenderArguments) => TemplateTokenArray;
type ExtractedFunctionExpressions = Function[];

const element = (render: RenderFunction, BaseClass = HTMLElement) => {
  return class extends BaseClass {
    f!: ExtractedFunctionExpressions;
    stateList_!: any[];
    renderArguments_!: ReturnType<typeof createRenderArguments>;
    customEventHandlers_!: CustomEventHandlers;

    connectedCallback() {
      this.stateList_ = [];
      this.renderArguments_ = createRenderArguments(this);
      this.customEventHandlers_ = {};
      this.setAttribute('scope', '');
      this.update();
    }

    update() {
      const self = this;
      const extractedFunctionExpressions: Function[] = [];
      setStateScope(self.stateList_, () => window.requestAnimationFrame(() => self.update()));
      updateCustomEventHandlers(self, this.customEventHandlers_);
      const templateLiteralTokens = render.call(self, this.renderArguments_);
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

export { element };
