// import { html } from './template-literal-processor';

// const { describe, expect, it } = <any>window;

// describe('html() tag function', () => {
//   it('should return an array', () => {
//     expect(() => Array.isArray(html``));
//   });

//   it('should return an array with one item given a simple string', () => {
//     // prettier-ignore
//     const tokens = html`<p>Hello</p>`;
//     expect(() => tokens.length == 1);
//     expect(() => tokens[0] == '<p>Hello</p>');
//   });

//   it('should return an array with an empty string, an item and another empty string given a value', () => {
//     // prettier-ignore
//     const tokens = html`${'<p>Hello</p>'}`;
//     expect(() => tokens.length == 3);
//     expect(() => tokens[0] == '');
//     expect(() => tokens[1] == '<p>Hello</p>');
//     expect(() => tokens[2] == '');
//   });

//   it('should return an array with three items given a string, a value and a string', () => {
//     // prettier-ignore
//     const tokens = html`<p>${'Hello'}</p>`;
//     expect(() => tokens.length == 3);
//     expect(() => tokens[0] == '<p>');
//     expect(() => tokens[1] == 'Hello');
//     expect(() => tokens[2] == '</p>');
//   });

//   it('should return an array with an empty string entry between every value given only values', () => {
//     // prettier-ignore
//     const tokens = html`${'<p>'}${'Hello'}${'</p>'}`;
//     expect(() => tokens.length == 7);
//     expect(() => tokens[1] == '<p>');
//     expect(() => tokens[2] == '');
//     expect(() => tokens[3] == 'Hello');
//     expect(() => tokens[4] == '');
//     expect(() => tokens[5] == '</p>');
//   });

//   it('should merge strings and values into one ordered array', () => {
//     // prettier-ignore
//     const tokens = html`1${'2'}3${'4'}5`;
//     expect(() => tokens.length == 5);
//     expect(() => ['1', '2', '3', '4', '5'].every((value, index) => tokens[index] == value));
//   });

//   it('should preserve the original types of values', () => {
//     // prettier-ignore
//     const tokens = html`${1}${true}${() => {}}${''}`;
//     expect(() => typeof tokens[1] == 'number');
//     expect(() => typeof tokens[3] == 'boolean');
//     expect(() => typeof tokens[5] == 'function');
//     expect(() => typeof tokens[7] == 'string');
//   });

//   it('should flatten nested html() calls', () => {
//     // prettier-ignore
//     const tokens = html`
//       <ul>
//         ${html`<li>${1}</li>`}
//         ${[2, 3].map(item => html`<li>${item}</li>`)}
//       </ul>
//     `;
//     expect(() => tokens.filter(x => x == '<li>').length == 3);
//     expect(() => tokens.filter(x => x == '</li>').length == 3);
//     expect(() => tokens.includes(1));
//     expect(() => tokens.includes(2));
//     expect(() => tokens.includes(3));
//   });
// });
