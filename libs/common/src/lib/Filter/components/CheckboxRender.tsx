import { Checkbox, Divider } from 'antd';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterItemProps } from '../types';
import { decodeSearchParams } from '../../../utils';
import { CCheckbox } from '../../Checkbox';

interface CheckboxRenderProps {
  items: FilterItemProps[];
  defaultFilter: string[];
}

export const CheckboxRender = ({
  items,
  defaultFilter,
}: CheckboxRenderProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const currentFilters = useMemo(() => {
    const filtersParam = params.filters;
    if (!filtersParam) return [];
    if (Array.isArray(filtersParam)) return filtersParam;
    return filtersParam.split(',').filter(Boolean);
  }, [params.filters]);

  const isCheckAll = useMemo(() => {
    if (items.length === 0) return false;
    return items.every((item) => currentFilters.includes(item.name));
  }, [currentFilters, items]);

  const indeterminate = useMemo(() => {
    const checkedCount = items.filter((item) =>
      currentFilters.includes(item.name)
    ).length;
    return checkedCount > 0 && checkedCount < items.length;
  }, [currentFilters, items]);

  const handleCheckboxChange = (checkedValues: string[]) => {
    const selectedFilters = checkedValues
      .map((value) => {
        return items.find((item) => item.name === value)?.name;
      })
      .filter(Boolean);

    const allFilters = [...defaultFilter, ...selectedFilters];
    const filtersString = allFilters.join(',');

    setSearchParams({ ...params, filters: filtersString }, { replace: true });
  };

  const handleCheckAll = useCallback(
    (e: { target: { checked: boolean } }) => {
      const checked = e.target.checked;
      const allFilters: string[] = checked
        ? items.map((item) => item.name)
        : defaultFilter;
      const filtersString = allFilters.join(',');
      setSearchParams({ ...params, filters: filtersString }, { replace: true });
    },
    [defaultFilter, items, params, setSearchParams]
  );

  const checkboxGroupValue = useMemo(() => {
    return items
      .map((item) => {
        return currentFilters.includes(item.name) ? item.name : null;
      })
      .filter((value): value is string => value !== null);
  }, [currentFilters, items]);

  return (
    <>
      <Checkbox
        indeterminate={indeterminate}
        onChange={handleCheckAll}
        checked={isCheckAll}
      >
        Chọn tất cả
      </Checkbox>
      <Divider className="!my-4" />
      <Checkbox.Group
        onChange={handleCheckboxChange}
        value={checkboxGroupValue}
      >
        {items.map((item) => {
          return (
            <CCheckbox
              key={item.name}
              value={item.name}
              disabled={item.disabled || item.showDefault}
            >
              {item.label}
            </CCheckbox>
          );
        })}
      </Checkbox.Group>
    </>
  );
};
