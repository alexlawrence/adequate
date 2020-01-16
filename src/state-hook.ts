type SideEffect = () => void;

let currentStateList: any[];
let currentIndex: number;
let currentSideEffect: SideEffect;

const setStateScope = (stateList: any[], sideEffect: SideEffect) => {
  currentStateList = stateList;
  currentIndex = 0;
  currentSideEffect = sideEffect;
};

const useState = <T>(initialState: T): [T, (state: T) => void] => {
  const stateList = currentStateList;
  const index = currentIndex++;
  const sideEffect = currentSideEffect;
  if (stateList.length <= index) stateList[index] = initialState;
  const setState = (state: T) => {
    stateList[index] = state;
    sideEffect();
  };
  return [stateList[index], setState];
};

export { useState, setStateScope };
