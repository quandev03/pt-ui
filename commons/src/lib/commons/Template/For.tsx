import { Children } from "react";

interface Props<T> {
  array: T[];
  render: (item: T, index: number, array: T[]) => JSX.Element;
}

function For<T>({ array, render }: Props<T>) {
  return <>{Children.toArray(array.map((item, index, arrayOrigin) => render(item, index, arrayOrigin)))}</>;
}

export default For;
