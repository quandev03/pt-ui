import { Form, InputProps, Row, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { TableRowSelection } from 'antd/es/table/interface';
import { TablePaginationConfig } from 'antd/lib';
import { Search } from 'lucide-react';
import { memo } from 'react';
import { useLayoutRefs } from '../../hooks';
import { AnyElement, IPage } from '../../types';
import { CFilter, FilterItemProps } from '../Filter';
import { CInput } from '../Input';
import { CTable } from '../Table';
import { RowHeader, TitleHeader, Wrapper } from '../Template';

export interface LayoutListProps<T = unknown> {
  title: string;
  columns?: ColumnsType<T>;
  data?: IPage<T>;
  loading?: boolean;
  filterItems: FilterItemProps[];
  searchComponent?: React.ReactNode;
  actionComponent?: React.ReactNode;
  rowSelection?: TableRowSelection<T>;
  subFilter?: React.ReactNode;
  actionComponentSub?: React.ReactNode;
  dataNoPagination?: T[];
  expandable?: AnyElement;
  pagination?: false | TablePaginationConfig;
}

function LayoutListComponent<T = unknown>({
  title,
  columns,
  data,
  loading,
  filterItems,
  searchComponent,
  actionComponent,
  rowSelection,
  subFilter,
  actionComponentSub,
  dataNoPagination,
  expandable,
  pagination,
}: LayoutListProps<T>) {
  // Sử dụng custom hook để quản lý refs
  const { heightTitleRef, wrapperManagerRef, filterManagerRef } =
    useLayoutRefs();
  const getDataSource = () => {
    if (dataNoPagination) {
      return dataNoPagination;
    } else return data?.content ?? [];
  };
  return (
    <Wrapper ref={wrapperManagerRef} id="wrapperManager">
      <TitleHeader ref={heightTitleRef} id="heightTitle">
        {title}
      </TitleHeader>
      <div className="flex flex-col">
        <RowHeader
          ref={filterManagerRef}
          id="filterManager"
          className="!mb-0 flex flex-wrap justify-between gap-4"
        >
          <CFilter
            items={filterItems}
            searchComponent={searchComponent}
            loading={loading}
            actionComponentSub={actionComponentSub}
          />
          {actionComponent && <div>{actionComponent}</div>}
        </RowHeader>
        {subFilter}
        <Row>
          <div className="flex w-full">
            <CTable<T>
              columns={columns}
              dataSource={getDataSource()}
              loading={loading}
              rowKey="id"
              pagination={
                pagination ?? {
                  total: data?.totalElements,
                }
              }
              rowSelection={rowSelection}
              refs={{
                heightTitleRef,
                wrapperManagerRef,
                filterManagerRef,
              }}
              scroll={{ x: 'max-content' }}
              expandable={expandable}
            />
          </div>
        </Row>
      </div>
    </Wrapper>
  );
}

interface SearchComponentProps extends InputProps {
  name: string;
  tooltip: string;
  placeholder: string;
  stateKey?: string;
  className?: string;
}

// Tạo SearchComponent riêng
const SearchComponent = memo(
  ({
    name,
    tooltip,
    placeholder,
    stateKey,
    className,
    ...rest
  }: SearchComponentProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Tự động cắt ký tự nếu vượt quá maxLength
      if (e.target.value.length > 100) {
        e.target.value = e.target.value.substring(0, 100);
      }

      if (rest.onChange) {
        rest.onChange(e);
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pasteData = e.clipboardData.getData('text');
      const currentValue = (e.target as HTMLInputElement).value;
      const selectionStart = (e.target as HTMLInputElement).selectionStart || 0;
      const selectionEnd = (e.target as HTMLInputElement).selectionEnd || 0;

      // Tính toán giá trị sau khi paste
      const beforeSelection = currentValue.substring(0, selectionStart);
      const afterSelection = currentValue.substring(selectionEnd);
      const newValue = beforeSelection + pasteData + afterSelection;

      // Nếu vượt quá maxLength, ngăn chặn paste mặc định và xử lý thủ công
      if (newValue.length > 100) {
        e.preventDefault();

        // Tính toán giá trị được phép paste
        const allowedLength =
          100 - beforeSelection.length - afterSelection.length;
        const allowedPasteData = pasteData.substring(
          0,
          Math.max(0, allowedLength)
        );
        const finalValue = beforeSelection + allowedPasteData + afterSelection;

        // Cập nhật giá trị
        (e.target as HTMLInputElement).value = finalValue;

        // Đặt lại cursor position
        const newCursorPosition =
          beforeSelection.length + allowedPasteData.length;
        setTimeout(() => {
          (e.target as HTMLInputElement).setSelectionRange(
            newCursorPosition,
            newCursorPosition
          );
        }, 0);
      }

      // Gọi onPaste từ props nếu có
      if (rest.onPaste) {
        rest.onPaste(e);
      }
    };

    return (
      <Tooltip title={tooltip} placement="top">
        <Form.Item
          name={stateKey ? stateKey : name}
          className={`min-w-42 ${className}`}
        >
          <CInput
            maxLength={100}
            placeholder={placeholder}
            prefix={<Search size={16} className="cursor-pointer" />}
            onChange={handleChange}
            onPaste={handlePaste}
            {...rest}
          />
        </Form.Item>
      </Tooltip>
    );
  }
);

// Tạo compound component với đúng type
const LayoutList = memo(
  LayoutListComponent
) as unknown as typeof LayoutListComponent & {
  SearchComponent: typeof SearchComponent;
};

LayoutList.SearchComponent = SearchComponent;

export { LayoutList };
