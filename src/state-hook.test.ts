import { useState, setStateScope } from './state-hook';

const { describe, expect, it } = <any>window;

describe('useState()', () => {
  it('should return the passed in initial value as first array item', () => {
    setStateScope([], () => {});
    const [state] = useState(123);
    expect(() => state == 123);
  });

  it('should return a state setter function as second array item', () => {
    setStateScope([], () => {});
    const [, setState] = useState(123);
    expect(() => typeof setState == 'function');
  });

  it('should assign the passed in initial value to the first entry in the state list', () => {
    const stateList: any[] = [];
    setStateScope(stateList, () => {});
    useState(123);
    expect(() => stateList[0] == 123);
  });

  it('should update the value in the state list when executing the state setter', () => {
    const stateList: any[] = [];
    setStateScope(stateList, () => {});
    const [, setState] = useState(123);
    setState(345);
    expect(() => stateList[0] == 345);
  });

  it('should execute the side effect after executing the state setter', () => {
    const values: any[] = [];
    let wasSideEffectExecuted = false;
    setStateScope(values, () => {
      wasSideEffectExecuted = true;
    });
    const [, setState] = useState(0);
    setState(1);
    expect(() => wasSideEffectExecuted == true);
  });

  it('should update the entry in the state list when executing the state setter subsequently', () => {
    const stateList: any[] = [];
    setStateScope(stateList, () => {});
    const [, setState] = useState(0);
    setState(1);
    setState(2);
    expect(() => stateList[0] == 2);
  });

  it('should increase the index to use for the state list when again invoking useState()', () => {
    const stateList: any[] = [];
    setStateScope(stateList, () => {});
    const [, setState1] = useState(0);
    setState1(1);
    const [, setState2] = useState(0);
    setState2(2);
    const [, setState3] = useState(0);
    setState3(3);
    expect(() => [1, 2, 3].every((number, index) => stateList[index] == number));
  });

  it('should reset the index to use when executing setStateScope()', () => {
    const stateList: any[] = [];
    setStateScope(stateList, () => {});
    const [initialState, setState] = useState('a');
    setState('b');
    setStateScope(stateList, () => {});
    const [firstSavedState, setStateAgain] = useState('a');
    setStateAgain('c');
    expect(() => initialState == 'a');
    expect(() => firstSavedState == 'b');
    expect(() => stateList[0] == 'c');
  });
});
