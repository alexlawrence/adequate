let currentHookStack: any[];
let currentIndex: number;
let currentSideEffect: Function;

const withHooks = <T extends (...args: any[]) => any>(original: T, sideEffect: Function) => {
  const stateList: any[] = [];
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    currentHookStack = stateList;
    currentIndex = 0;
    currentSideEffect = sideEffect;
    return original.apply(this, args);
  };
};

const useState = <T>(initialState: T): [T, (state: T) => void] => {
  const hookStack = currentHookStack;
  const index = currentIndex++;
  const sideEffect = currentSideEffect;
  if (!(index in hookStack)) hookStack[index] = initialState;
  const setState = (state: T) => sideEffect(hookStack[index] = state);
  return [hookStack[index], setState];
};

const useEffect = (effectFn: Function, dependencies: unknown[]) => {
  const index = currentIndex++;
  const oldDependencies = currentHookStack[index];
  if (
    !oldDependencies ||
    dependencies.some((dependency, index) => dependency != oldDependencies[index])
  )
    queueMicrotask(effectFn as () => void);
  currentHookStack[index] = dependencies;
};

export { useEffect, useState, withHooks };
