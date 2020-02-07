// type RenderArguments = {
//   [name: string]: string;
// } & {
//   dispatch: (event: Event) => void;
// };

// const createRenderArguments = (element: Element) => {
//   const dispatch = element.dispatchEvent.bind(element);
//   return new Proxy(
//     {},
//     {
//       get: (_, property: string) =>
//         property == 'dispatch' ? dispatch : element.getAttribute(property),
//     }
//   ) as RenderArguments;
// };

// export { createRenderArguments, RenderArguments };
