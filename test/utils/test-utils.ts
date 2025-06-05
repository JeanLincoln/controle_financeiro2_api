interface BasicExpectationsProps<mockFuncArgs, mockFuncReturn, calledWithArgs> {
  mockFunction: (
    args: mockFuncArgs
  ) => Promise<mockFuncReturn> | mockFuncReturn;
  calledWith: calledWithArgs;
  times: number;
}

interface ResultExpectationsProps<T> {
  result: T;
  expected: T;
}

export const timesCalledExpectations = <
  mockFuncArgs,
  mockFuncReturn,
  calledWithArgs
>({
  mockFunction,
  calledWith,
  times
}: BasicExpectationsProps<mockFuncArgs, mockFuncReturn, calledWithArgs>) => {
  if (times < 0) {
    throw new Error("Times must be greater than 0");
  }

  expect(mockFunction).toHaveBeenCalledWith(calledWith);
  expect(mockFunction).toHaveBeenCalledTimes(times);
};

export const notCalledExpectations = (notExpectingArray: unknown[]) => {
  notExpectingArray.forEach((notExpecting) => {
    expect(notExpecting).not.toHaveBeenCalled();
  });
};

export const resultExpectations = <Expected, Result>(
  result: Result,
  expected: Expected
) => {
  expect(result).toEqual(expected);
};

export const arrayExpectations = <T>({
  result,
  expected,
  length
}: ResultExpectationsProps<T[]> & { length: number }) => {
  expect(result).toEqual(expected);
  expect(result).toHaveLength(length);
};
