let currentHookStack: any[];
let currentIndex: number;
let currentSideEffect: () => void;

const withHooks = <T extends (...args: any[]) => any>(original: T, sideEffect: () => void) => {
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
  if (hookStack.length <= index) hookStack[index] = initialState;
  const setState = (state: T) => {
    hookStack[index] = state;
    sideEffect();
  };
  return [hookStack[index], setState];
};

const useEffect = (effectFn: Function, dependencies: unknown[]) => {
  const hookStack = currentHookStack;
  const index = currentIndex++;
  const oldDependencies = hookStack[index];
  if (
    !oldDependencies ||
    dependencies.some((dependency, index) => dependency != oldDependencies[index])
  )
    queueMicrotask(() => effectFn());
  hookStack[index] = dependencies;
};

export { useEffect, useState, withHooks };
