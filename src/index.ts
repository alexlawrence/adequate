import { element, html, useState } from './index.module';

declare global {
  interface Window {
    adequate: {
      e: typeof element;
      h: typeof html;
      u: typeof useState;
    };
  }
}

window.adequate = { e: element, h: html, u: useState };
