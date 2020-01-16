import creatingAnElement from '../examples/creating-an-element';
import customCallbacks from '../examples/custom-callbacks';
import elementAttributes from '../examples/element-attributes';
import elementComposition from '../examples/element-composition';
import eventHandlers from '../examples/event-handlers';
import functionAttributes from '../examples/function-attributes';
import renderingBasics from '../examples/rendering-basics';
import sideEffects from '../examples/side-effects';
import standaloneCustomElement from '../examples/standalone-custom-element';
import stateManagement from '../examples/state-management';
import todoList from '../examples/todo-list';
import childRendering from '../examples/child-rendering';
import keyedElements from '../examples/keyed-elements';
import renderProps from '../examples/render-props';
import largeDatasets from '../examples/large-datasets';
import domAccess from '../examples/dom-access';
import customEvents from '../examples/custom-events';

const examples = [
  {
    name: 'Creating an element',
    id: 'creating-an-element',
    code: creatingAnElement,
  },
  {
    name: 'Rendering basics',
    id: 'rendering-basics',
    code: renderingBasics,
  },
  {
    name: 'Element attributes',
    id: 'element-attributes',
    code: elementAttributes,
  },
  {
    name: 'Event handlers',
    id: 'event-handlers',
    code: eventHandlers,
  },
  {
    name: 'State management',
    id: 'state-management',
    code: stateManagement,
  },
  {
    name: 'Side effects',
    id: 'side-effects',
    code: sideEffects,
  },
  {
    name: 'Element composition',
    id: 'element-composition',
    code: elementComposition,
  },
  {
    name: 'Child rendering',
    id: 'child-rendering',
    code: childRendering,
  },
  {
    name: 'Function attributes',
    id: 'function-attributes',
    code: functionAttributes,
  },
  {
    name: 'Custom callbacks',
    id: 'custom-callbacks',
    code: customCallbacks,
  },
  {
    name: 'Render props',
    id: 'render-props',
    code: renderProps,
  },
  {
    name: 'Large datasets',
    id: 'large-datasets',
    code: largeDatasets,
  },
  {
    name: 'Keyed elements',
    id: 'keyed-elements',
    code: keyedElements,
  },
  {
    name: 'DOM access',
    id: 'dom-access',
    code: domAccess,
  },
  {
    name: 'Custom Events',
    id: 'custom-events',
    code: customEvents,
  },
  {
    name: 'Standalone Custom Element',
    id: 'standalone-custom-element',
    code: standaloneCustomElement,
  },
  {
    name: 'Todo List',
    id: 'todo-list',
    code: todoList,
  },
];

export default examples;
