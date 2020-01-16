import { useEffect, useState, withHooks } from './hooks';

const { describe, expect, it } = <any>window;

describe('withHooks()', () => {
  it('should create a function that executes the original upon invocation', () => {
    let wasExecuted = false;
    const wrappedFunction = withHooks(
      () => {
        wasExecuted = true;
      },
      () => {},
    );
    wrappedFunction();
    expect(() => wasExecuted == true);
  });

  it('should create a function that returns the return value from the original', () => {
    const wrappedFunction = withHooks(
      () => 'foobar',
      () => {},
    );
    expect(() => wrappedFunction() == 'foobar');
  });

  it('should create a function that forwards given arguments to the original', () => {
    const wrappedFunction = withHooks(
      (a, b) => `${a}${b}`,
      () => {},
    );
    expect(() => wrappedFunction('foo', 'bar') == 'foobar');
  });

  it('should create a function that forwards the scope to the original', () => {
    const scope = { foo: 'bar' };
    const wrappedFunction = withHooks(
      function (this: typeof scope) {
        return this;
      },
      () => {},
    );
    expect(() => wrappedFunction.call(scope) == scope);
  });
});

describe('useState', () => {
  it('should return the passed in initial value as first array item', () => {
    let state: number;
    const wrappedFunction = withHooks(
      () => {
        [state] = useState(123);
      },
      () => {},
    );
    wrappedFunction();
    expect(() => state == 123);
  });

  it('should always return the first initial value even when the given value changes', () => {
    let initialState: number = 1;
    let state: number;
    const wrappedFunction = withHooks(
      () => {
        [state] = useState(initialState);
      },
      () => {},
    );
    wrappedFunction();
    initialState = 2;
    wrappedFunction();
    expect(() => state == 1);
  });

  it('should return a state setter function as second array item', () => {
    let setState: (state: number) => void;
    const wrappedFunction = withHooks(
      () => {
        [, setState] = useState(123);
      },
      () => {},
    );
    wrappedFunction();
    expect(() => typeof setState == 'function');
  });

  it('should execute the given side effect after executing the state setter', () => {
    let wasSideEffectExecuted = false;
    const wrappedFunction = withHooks(
      () => {
        const [, setState] = useState('');
        setState('foo');
      },
      () => {
        wasSideEffectExecuted = true;
      },
    );
    wrappedFunction();
    expect(() => wasSideEffectExecuted == true);
  });

  it('should return an updated value after using the state setter', () => {
    let state: number, setState: (state: number) => void;
    const wrappedFunction = withHooks(
      () => {
        [state, setState] = useState(0);
        if (state == 0) setState(1);
      },
      () => {},
    );
    wrappedFunction();
    wrappedFunction();
    expect(() => state == 1);
  });

  it('should return an updated value after using the state setter subsequently', () => {
    let state: number, setState: (state: number) => void;
    const wrappedFunction = withHooks(
      () => {
        [state, setState] = useState(0);
        setState(state + 1);
      },
      () => {},
    );
    wrappedFunction();
    expect(() => state == 0);
    wrappedFunction();
    expect(() => state == 1);
    wrappedFunction();
    expect(() => state == 2);
  });

  it('should work correctly with multiple state variables', () => {
    let a: string, setA: (state: string) => void;
    let b: string, setB: (state: string) => void;
    const wrappedFunction = withHooks(
      () => {
        [a, setA] = useState('');
        [b, setB] = useState('');
        if (a == '') setA('a');
        if (b == '') setB('b');
      },
      () => {},
    );
    wrappedFunction();
    wrappedFunction();
    expect(() => a == 'a');
    expect(() => b == 'b');
  });

  it('should work correctly when using multiple functions wrapped via withHooks()', () => {
    let firstState: string, setFirstState: (state: string) => void;
    const wrappedFunction1 = withHooks(
      () => {
        [firstState, setFirstState] = useState('');
        if (firstState == '') setFirstState('first');
      },
      () => {},
    );
    const wrappedFunction2 = withHooks(
      () => {
        const [, setSecondState] = useState('');
        setSecondState('second');
      },
      () => {},
    );
    wrappedFunction1();
    wrappedFunction1();
    wrappedFunction2();
    expect(() => firstState == 'first');
  });
});

describe('useEffect()', () => {
  it('should execute the given effect function after the caller function completed', async () => {
    let wasExecuted = false;
    const wrappedFunction = withHooks(
      () => {
        useEffect(() => {
          wasExecuted = true;
        }, []);
      },
      () => {},
    );
    wrappedFunction();
    expect(() => wasExecuted == false);
    await new Promise((resolve) => window.queueMicrotask(() => resolve(true)));
    expect(() => wasExecuted == true);
  });

  it('should execute the given effect function only once given an empty dependency array', async () => {
    let executionCounter = 0;
    const wrappedFunction = withHooks(
      () => {
        useEffect(() => {
          executionCounter++;
        }, []);
      },
      () => {},
    );
    wrappedFunction();
    wrappedFunction();
    wrappedFunction();
    await new Promise((resolve) => window.queueMicrotask(() => resolve(true)));
    expect(() => executionCounter == 1);
  });

  it('should not execute the given effect function again when the dependencies remain unchanged', async () => {
    let executionCounter = 0;
    const user = '123';
    const page = 'settings';
    const wrappedFunction = withHooks(
      () => {
        useEffect(() => {
          executionCounter++;
        }, [user, page]);
      },
      () => {},
    );
    wrappedFunction();
    wrappedFunction();
    await new Promise((resolve) => window.queueMicrotask(() => resolve(true)));
    expect(() => executionCounter == 1);
  });

  it('should execute the given effect function again when the dependencies change', async () => {
    let executionCounter = 0;
    let user = '123';
    let page = 'settings';
    const wrappedFunction = withHooks(
      () => {
        useEffect(() => {
          executionCounter++;
        }, [user, page]);
      },
      () => {},
    );
    wrappedFunction();
    user = '456';
    wrappedFunction();
    page = 'profile';
    wrappedFunction();
    await new Promise((resolve) => window.queueMicrotask(() => resolve(true)));
    expect(() => executionCounter == 3);
  });
});
