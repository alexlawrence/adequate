import { element, html, useEffect, useState } from './index.module';

declare global {
  interface Window {
    adequate: {
      element: typeof element;
      html: typeof html;
      useEffect: typeof useEffect;
      useState: typeof useState;
    };
  }
}

window.adequate = { element, html, useEffect, useState };
