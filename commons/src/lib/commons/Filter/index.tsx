import {
  faChevronDown,
  faFilter,
  faMagnifyingGlass,
  faRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateFormat } from '@react/constants/app';
import {
  Button,
  Checkbox,
  CheckboxProps,
  Divider,
  Form,
  Popover,
  Space,
} from 'antd';
import dayjs from 'dayjs';
import { memo, ReactElement, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { decodeSearchParams } from '../../helpers/utils';
import CButton from '../Button';
import CCheckbox from '../Checkbox';
import { WrapperButton } from '../Template/style';

export interface ItemFilter {
  label: string;
  value: React.ReactNode;
  key?: string;
  showDefault?: boolean;
  disabled?: boolean;
}

interface Props {
  items: ItemFilter[];
  searchComponent?: React.ReactNode;
  validQuery?: string;
  onRefresh?: () => void;
}

const CFilter = (props: Props) => {
  const { items, onRefresh } = props;
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const plainOptions = items?.map((_, index) => index);
  const getFilters = searchParams.get('filters');
  const filters = getFilters ? getFilters?.split(',') : [];
  const isCheckAll = items.length === filters.length;
  const indeterminate = filters.length > 0 && filters.length < items.length;
  const form = Form.useFormInstance();
  const defaultFilter = items
    .map((item, index) => (item.showDefault ? index : -1))
    .filter((index) => index !== -1)
    .join(',');

  const handleUncheckedField = (values: string[], currentParams: any) => {
    let [unCheckedKeys, unCheckedName]: any[] = [undefined, undefined];
    unCheckedKeys = filters.filter((e) => !values?.includes(e));
    if (!unCheckedKeys.length) return;
    unCheckedKeys.forEach((unCheckedKey: string) => {
      unCheckedName = (items[+unCheckedKey].value as ReactElement)?.props?.name;
      if (unCheckedName) {
        delete currentParams[unCheckedName];
        form.resetFields([unCheckedName]);
      }
    });
  };

  const setFilters = (values: any) => {
    const currentParams = { ...params, filters: values.join(',') };
    if (filters.length > values?.length) {
      handleUncheckedField(values, currentParams);
    }
    setSearchParams(currentParams, { replace: true });
  };

  const handleCheckAll: CheckboxProps['onChange'] = (e) => {
    setFilters(e.target.checked ? plainOptions : defaultFilter?.split(','));
  };

  const CheckboxRender = () => {
    return (
      <>
        <Checkbox
          indeterminate={indeterminate}
          onChange={handleCheckAll}
          checked={isCheckAll}
        >
          Chọn tất cả
        </Checkbox>
        <Divider className="my-3" />
        <Checkbox.Group onChange={(e) => setFilters(e)} value={filters}>
          {items?.map((item, index) => {
            return (
              <CCheckbox
                key={index}
                value={index.toString()}
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
  const defaultParam = { filters: defaultFilter };

  const handleRefresh = () => {
    form.resetFields();
    setSearchParams(
      { ...defaultParam, queryTime: dayjs().format(DateFormat.TIME) },
      {
        replace: true,
      }
    );
  };

  useEffect(() => {
    defaultFilter &&
      setSearchParams(
        { ...params, filters: params.filters || defaultFilter },
        { replace: true }
      );
  }, [pathname]);

  return (
    <WrapperButton>
      {items?.length > 0 && (
        <Popover
          content={<CheckboxRender />}
          placement="bottom"
          trigger="click"
        >
          <Button type="default">
            <Space>
              <FontAwesomeIcon icon={faFilter} />
              Bộ lọc
              <FontAwesomeIcon icon={faChevronDown} />
            </Space>
          </Button>
        </Popover>
      )}
      {props.searchComponent}
      {items?.map((item, i) => filters?.includes(i.toString()) && item.value)}
      <WrapperButton>
        <CButton
          icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
          htmlType="submit"
        >
          Tìm kiếm
        </CButton>
        <FontAwesomeIcon
          icon={faRotateLeft}
          size="lg"
          className="cursor-pointer self-center"
          onClick={() => (onRefresh ? onRefresh() : handleRefresh())}
          title="Làm mới"
        />
      </WrapperButton>
    </WrapperButton>
  );
};

export default memo(CFilter);
