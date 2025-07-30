import { Checkbox, Divider } from 'antd';
import { useCallback, useMemo } from 'react';
import { FilterItemProps } from '../types';
import { CCheckbox } from '../../Checkbox';

interface CheckboxRenderProps {
  items: FilterItemProps[];
  keyOpen: string[];
  setKeyOpen: React.Dispatch<React.SetStateAction<string[]>>;
}

export const CheckboxRenderState = ({
  items,
  keyOpen,
  setKeyOpen,
}: CheckboxRenderProps) => {
  const isCheckAll = useMemo(() => {
    if (items.length === 0) return false;
    return items.every((item) => keyOpen.includes(item.name));
  }, [keyOpen, items]);

  const indeterminate = useMemo(() => {
    const checkedCount = items.filter((item) =>
      keyOpen.includes(item.name)
    ).length;
    return checkedCount > 0 && checkedCount < items.length;
  }, [keyOpen, items]);

  const handleCheckboxChange = (checkedValues: string[]) => {
    setKeyOpen(checkedValues);
  };

  const handleCheckAll = useCallback(
    (e: { target: { checked: boolean } }) => {
      const checked = e.target.checked;
      const allFilters: string[] = checked
        ? items.map((item) => item.name)
        : keyOpen;
      setKeyOpen(allFilters);
    },
    [keyOpen, items, setKeyOpen]
  );

  const checkboxGroupValue = useMemo(() => {
    return items
      .map((item) => {
        return keyOpen.includes(item.name) ? item.name : null;
      })
      .filter((value): value is string => value !== null);
  }, [keyOpen, items]);

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
