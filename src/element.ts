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
    stateList_: any[];
    renderArguments_: ReturnType<typeof createRenderArguments>;
    customEventHandlers_: CustomEventHandlers;

    constructor() {
      super();
      this.stateList_ = [];
      this.renderArguments_ = createRenderArguments(this);
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

/* type RenderFunction = (this: HTMLElement, element: HTMLElement) => TemplateTokenArray;
type ExtractedFunctionExpressions = Function[];

const element = (BaseElementClass = HTMLElement, render: RenderFunction = () => ['']) => {
  return class extends BaseElementClass {
    f!: ExtractedFunctionExpressions;
    stateList_: any[];
    renderArguments_: ReturnType<typeof createRenderArguments>;
    customEventHandlers_: CustomEventHandlers;
    render: any;

    constructor() {
      super();
      this.stateList_ = [];
      this.renderArguments_ = createRenderArguments(this);
      this.customEventHandlers_ = {};
      this.render = render;
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
      const templateLiteralTokens = render.call(self, self);
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
}; */

/**
 * 
better way detect adequate elements?
what about the function name? adequate, element, ...=

customElements.define(
  'x-calculator',
  adequate(HTMLElement, element => {
    const [a, operator, b] = ['a', 'operator', 'b'].map(name => element.getAttribute(name));
    const expression = `${a} ${operator} ${b}`;
    return html`
      <p>
        ${expression} = ${new Function('return ' + expression)()}
      </p>
    `;
  })
);

customElements.define(
  'x-calculator',
  class extends adequate(HTMLElement) {
    render() {
      const [a, operator, b] = ['a', 'operator', 'b'].map(name => this.getAttribute(name));
      const expression = `${a} ${operator} ${b}`;
      return html`
        <p>
          ${expression} = ${new Function('return ' + expression)()}
        </p>
      `;
    }
  }
);

customElements.define(
  'x-counter',
  adequate(HTMLElement, () => {
    const [value, setValue] = useState(0);

    return html`
      <div>Counter: ${value}</div>
      <button onclick="${() => setValue(value + 1)}">Increment</button>
      <button onclick="${() => setValue(value - 1)}">Decrement</button>
    `;
  })
);

customElements.define(
  'x-counter',
  class extends Adequate(HTMLElement) {
    render() {
      const [value, setValue] = useState(0);
      return html`
        <div>Counter: ${value}</div>
        <button onclick="${() => setValue(value + 1)}">Increment</button>
        <button onclick="${() => setValue(value - 1)}">Decrement</button>
      `;
    }
  }

 */

export { element };
