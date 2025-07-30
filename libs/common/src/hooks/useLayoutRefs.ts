import { useRef, RefObject } from 'react';

export interface LayoutRefs {
  heightTitleRef: RefObject<HTMLDivElement>;
  wrapperManagerRef: RefObject<HTMLDivElement>;
  filterManagerRef: RefObject<HTMLDivElement>;
}

export const useLayoutRefs = (): LayoutRefs => {
  const heightTitleRef = useRef<HTMLDivElement>(null);
  const wrapperManagerRef = useRef<HTMLDivElement>(null);
  const filterManagerRef = useRef<HTMLDivElement>(null);

  return {
    heightTitleRef,
    wrapperManagerRef,
    filterManagerRef,
  };
};
