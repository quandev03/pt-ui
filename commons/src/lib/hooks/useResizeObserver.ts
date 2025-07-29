import { useEffect, useRef, useState } from 'react';

interface Size {
  width: number;
  height: number;
}

export const useResizeObserver = <T extends HTMLElement>(): [
  Size,
  React.RefObject<T>
] => {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<Size>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });
    resizeObserver.observe(element);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return [size, ref];
};
