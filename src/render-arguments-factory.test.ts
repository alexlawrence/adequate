import { createRenderArguments } from './render-arguments-factory';

const { describe, expect, it } = <any>window;

describe('createRenderArguments()', () => {
  it('should return an object for a given DOM element', () => {
    const divElement = document.createElement('div');
    const renderArguments = createRenderArguments(divElement);
    expect(() => typeof renderArguments == 'object');
  });

  it('should expose element attributes as properties', () => {
    const inputElement = document.createElement('input');
    inputElement.setAttribute('type', 'text');
    inputElement.setAttribute('maxlength', '5');
    inputElement.setAttribute('onclick', 'console.log("onclick")');
    const renderArguments = createRenderArguments(inputElement);
    expect(() => renderArguments.type == 'text');
    expect(() => renderArguments.maxlength == '5');
    expect(() => renderArguments.onclick == 'console.log("onclick")');
  });

  it('should retrieve element attribute values on-demand', () => {
    const inputElement = document.createElement('input');
    const renderArguments = createRenderArguments(inputElement);
    inputElement.setAttribute('maxlength', '5');
    expect(() => renderArguments.maxlength == '5');
  });

  it('should ignore casing for attribute names', () => {
    const inputElement = document.createElement('input');
    inputElement.setAttribute('mAxLeNgTh', '5');
    const renderArguments = createRenderArguments(inputElement);
    expect(() => renderArguments.MaXlEnGtH == '5');
  });

  it('should provide an operation to dispatch events with the given element as target', () => {
    const divElement = document.createElement('div');
    divElement.setAttribute('mAxLeNgTh', '5');
    let receivedEvent!: CustomEvent;
    const renderArguments = createRenderArguments(divElement);
    divElement.addEventListener('custom-event', ((event: CustomEvent) => {
      receivedEvent = event;
    }) as EventListener);
    const dispatchedEvent = new CustomEvent('custom-event');
    renderArguments.dispatch(dispatchedEvent);
    expect(() => receivedEvent == dispatchedEvent);
  });
});
