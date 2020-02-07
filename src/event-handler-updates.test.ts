// import { updateCustomEventHandlers } from './event-handler-updates';

// const { describe, expect, it } = <any>window;

// declare global {
//   interface Window {
//     executedHandlers: number[];
//     receivedArguments: any;
//   }
// }

// type CustomEventHandlers = Parameters<typeof updateCustomEventHandlers>[1];

// describe('updateCustomEventHandlers()', () => {
//   it('should add a new event listener given no currently existing one', () => {
//     const targetElement = document.createElement('div');
//     targetElement.setAttribute('oncustom-click', 'window.receivedArguments = arguments;');
//     const customEventHandlers = {};
//     updateCustomEventHandlers(targetElement, customEventHandlers);
//     window.receivedArguments = null;
//     const customEvent = new CustomEvent('custom-click');
//     targetElement.dispatchEvent(customEvent);
//     expect(() => window.receivedArguments[0] == customEvent);
//   });

//   it('should not replace a current event listener given the new source code is identical', () => {
//     const targetElement = document.createElement('div');
//     targetElement.setAttribute('oncustom-shake', 'console.log("shaken")');
//     const customEventHandlers: CustomEventHandlers = {};
//     updateCustomEventHandlers(targetElement, customEventHandlers);
//     const existingEventHandler = customEventHandlers['custom-shake'].handler_;
//     updateCustomEventHandlers(targetElement, customEventHandlers);
//     expect(() => existingEventHandler == customEventHandlers['custom-shake'].handler_);
//   });

//   it('should replace a current event listener given the new source code is different', () => {
//     const targetElement = document.createElement('div');
//     targetElement.setAttribute('oncustom-push', 'window.executedHandlers.push(1);');
//     const customEventHandlers: CustomEventHandlers = {};
//     window.executedHandlers = [];
//     updateCustomEventHandlers(targetElement, customEventHandlers);
//     targetElement.setAttribute('oncustom-push', 'window.executedHandlers.push(2);');
//     updateCustomEventHandlers(targetElement, customEventHandlers);
//     const pushEvent = new CustomEvent('custom-push');
//     targetElement.dispatchEvent(pushEvent);
//     expect(() => window.executedHandlers.length == 1 && window.executedHandlers[0] == 2);
//   });

//   it('should remove a current event listener given it is not existing in the new attributes', () => {
//     const targetElement = document.createElement('div');
//     targetElement.setAttribute('oncustom-push', 'window.executedHandlers.push(1);');
//     const customEventHandlers: CustomEventHandlers = {};
//     window.executedHandlers = [];
//     updateCustomEventHandlers(targetElement, customEventHandlers);
//     targetElement.removeAttribute('oncustom-push');
//     updateCustomEventHandlers(targetElement, customEventHandlers);
//     const pushEvent = new CustomEvent('custom-push');
//     targetElement.dispatchEvent(pushEvent);
//     expect(() => window.executedHandlers.length == 0);
//   });
// });
