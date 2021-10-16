import createFragment from './template-factory';
import { updateChildNodes } from './dom-updates';
import { withHooks } from './hooks';
import { AttributeProxy, createAttributeProxy } from './attribute-proxy-factory';

type ExtractedFunctionExpressions = Function[];

type AdequateElement = HTMLElement & { update: () => void };

const functionAttributeStart = `/*fn*/return this.parentNode.closest`;

const element = <T extends AttributeProxy>(
  render: (this: AdequateElement, attributeProxy: T) => unknown[],
) =>
  class extends HTMLElement {
    attributeProxy_!: T;
    f!: ExtractedFunctionExpressions;
    render_!: typeof render;

    connectedCallback() {
      this.attributeProxy_ = createAttributeProxy(this);
      this.render_ = withHooks(render, () => requestAnimationFrame(() => this.update()));
      this.update();
    }

    update() {
      const self = this;
      const extractedFunctionExpressions: Function[] = [];
      const templateLiteralTokens = self.render_.call(self, this.attributeProxy_);
      const processedTokens = templateLiteralTokens.map((token: unknown) =>
        typeof token == 'function'
          ? `${functionAttributeStart}('${this.nodeName}').f[${
              extractedFunctionExpressions.push(token as Function) - 1
            }](...arguments)`
          : token,
      );
      self.f = extractedFunctionExpressions;
      updateChildNodes(self, createFragment(processedTokens.join('')));
    }
  };

export { AdequateElement, functionAttributeStart, element };
