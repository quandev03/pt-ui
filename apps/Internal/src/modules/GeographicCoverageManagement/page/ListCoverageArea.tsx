import CTable from '@react/commons/Table';
import { TitleHeader, Wrapper } from '@react/commons/Template/style';
import { ACTION_MODE_ENUM } from '@react/commons/types';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { Row } from 'antd';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FilterAction } from '../components/FilterAction';
import {
  useColumns,
  useGetCoverageAreas,
  useSupportDeleteCoverageArea,
} from '../queryHooks';
import { ICoverageAreaItem, ICoverageAreaParams } from '../types';
import { useParameterQuery } from 'apps/Internal/src/hooks/useParameterQuery';
const ListCoverageArea = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const navigate = useNavigate();
  const { mutate: deleteCoverageArea } = useSupportDeleteCoverageArea();

  const { data: listCoverageAreas, isLoading: loadingTable } =
    useGetCoverageAreas(queryParams<ICoverageAreaParams>(params));
  const { data: rangeTypes = [] } = useParameterQuery({
    'table-name': 'COVERAGE_RANGE',
    'column-name': 'RANGE_TYPE',
  });

  const handleAction = useCallback(
    (action: ACTION_MODE_ENUM, record: ICoverageAreaItem) => {
      switch (action) {
        case ACTION_MODE_ENUM.VIEW:
          navigate(pathRoutes.coverageAreaManagerView(record.id));
          return;
        case ACTION_MODE_ENUM.CREATE:
          navigate(pathRoutes.coverageAreaManagerAdd);
          return;
        case ACTION_MODE_ENUM.EDIT:
          navigate(pathRoutes.coverageAreaManagerEdit(record.id));
          return;
        case ACTION_MODE_ENUM.Delete:
          ModalConfirm({
            title: 'Bạn có chắc chắn muốn Xóa bản ghi không?',
            message: 'Các dữ liệu liên quan cũng sẽ bị xóa',
            handleConfirm: () => {
              deleteCoverageArea(record.id + '');
            },
          });
          return;
      }
    },
    [deleteCoverageArea]
  );

  const columns = useColumns(handleAction, rangeTypes);

  return (
    <Wrapper>
      <TitleHeader>Danh mục phạm vi phủ sóng</TitleHeader>
      <div className="flex flex-col">
        <FilterAction rangeTypeOptions={rangeTypes} />
        <Row>
          <CTable
            columns={columns}
            dataSource={listCoverageAreas?.content ?? []}
            loading={loadingTable}
            rowKey={'id'}
            pagination={{
              total: listCoverageAreas?.totalElements,
            }}
          />
        </Row>
      </div>
    </Wrapper>
  );
};

export default ListCoverageArea;
