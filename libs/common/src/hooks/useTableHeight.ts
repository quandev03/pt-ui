import { useCallback, useLayoutEffect, useState, RefObject } from 'react';
import { useLocation } from 'react-router-dom';
import { UI_CONSTANTS } from '../constants';

// Use constants instead of hardcoded values
const { HEADER_HEIGHT, TABLE_MARGIN } = UI_CONSTANTS;

interface UseTableHeightProps {
  heightTitleRef: RefObject<HTMLDivElement>;
  wrapperManagerRef: RefObject<HTMLDivElement>;
  filterManagerRef: RefObject<HTMLDivElement>;
  dataSource?: readonly unknown[] | unknown[];
}

export const useTableHeight = ({
  heightTitleRef,
  wrapperManagerRef,
  filterManagerRef,
  dataSource,
}: UseTableHeightProps) => {
  const [tableHeight, setTableHeight] = useState(0);
  const { pathname } = useLocation();

  const calculateTableHeight = useCallback(() => {
    const heightTitle = heightTitleRef.current?.offsetHeight ?? 0;
    const heightWrapper = wrapperManagerRef.current?.offsetHeight ?? 0;
    const filterManager = filterManagerRef.current?.offsetHeight ?? 0;

    const calculatedHeight =
      heightWrapper -
      heightTitle -
      filterManager -
      HEADER_HEIGHT -
      TABLE_MARGIN;

    setTableHeight(Math.max(calculatedHeight, 0));
  }, [heightTitleRef, wrapperManagerRef, filterManagerRef]);

  useLayoutEffect(() => {
    calculateTableHeight();
  }, [dataSource, calculateTableHeight, pathname]);

  // Thêm listener cho window resize để recalculate khi cần
  useLayoutEffect(() => {
    const handleResize = () => {
      calculateTableHeight();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateTableHeight]);

  return {
    tableHeight,
    recalculateHeight: calculateTableHeight,
  };
};
