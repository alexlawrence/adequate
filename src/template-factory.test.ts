import createFragment from './template-factory';

const { describe, expect, it } = <any>window;

describe('createFragment()', () => {
  it('should create a document fragment', () => {
    const fragment = createFragment('');
    expect(() => fragment instanceof DocumentFragment);
  });

  it('should use the given html string as inner html', () => {
    const fragment = createFragment('<p>1</p><span>2</span><div>3</div>');
    expect(() => fragment.querySelector('p')?.innerText == '1');
    expect(() => fragment.querySelector('span')?.innerText == '2');
    expect(() => fragment.querySelector('div')?.innerText == '3');
  });
});
