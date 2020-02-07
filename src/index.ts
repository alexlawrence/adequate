import { AdequateElement, html, useState } from './index.module';

declare global {
  interface Window {
    adequate: {
      a: typeof AdequateElement;
      h: typeof html;
      u: typeof useState;
    };
  }
}

window.adequate = { a: AdequateElement, h: html, u: useState };
