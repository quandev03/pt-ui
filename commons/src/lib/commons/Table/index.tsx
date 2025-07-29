import { TableProps } from 'antd';
import { FC, memo, useLayoutEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { StyledCommonTable } from './styles';
import { useLocation, useSearchParams } from 'react-router-dom';
import { decodeSearchParams } from '../../helpers/utils';
import { TotalTableMessage } from '../Template/TotalTableMessage';

const DEFAULT_TOP = 150;
const MARGIN_HEIGHT = 100;
const HEIGHT_HEADER_TABLE = 39;

interface CTableProps<T> extends TableProps<T> {
  otherHeight?: number;
  subHeight?: number
}

const CTable: FC<CTableProps<any>> = ({
  pagination = false,
  otherHeight = 0,
  subHeight,
  ...rest
}) => {
  const intl = useIntl();
  const [tableHeight, setTableHeight] = useState(0);
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  useLayoutEffect(() => {
    handleChangeHeight();
  }, [pathname, rest.loading]);

  const handleChangeHeight = () => {
    const boundingClientRect: DOMRect | undefined = document
      ?.querySelector('#common-table')
      ?.getBoundingClientRect();
    if (boundingClientRect) {
      const tempHeight = window.innerHeight - otherHeight - (subHeight ?? MARGIN_HEIGHT);
      if (boundingClientRect.height <= HEIGHT_HEADER_TABLE) {
        setTableHeight(tempHeight - DEFAULT_TOP);
      } else {
        const top = boundingClientRect.top || 0;
        setTableHeight(tempHeight - top);
      }
    }
  };

  const handleChangePagination = (page: number, pageSize: number) => {
    setSearchParams({ ...params, page: page - 1, size: pageSize });
  };

  return (
    <StyledCommonTable
      id="common-table"
      size="small"
      locale={{ emptyText: intl.formatMessage({ id: 'common.noData' }) }}
      scroll={{ y: tableHeight }}
      {...rest}
      pagination={
        pagination
          ? {
              current: params.page + 1,
              pageSize: params.size,
              ...pagination,
              showSizeChanger: true,
              pageSizeOptions: [20, 50, 100],
              defaultPageSize: 20,
              onChange: pagination?.onChange ?? handleChangePagination,
              showTotal: TotalTableMessage,
              showQuickJumper: false,
            }
          : false
      }
    />
  );
};

export default memo(CTable);
