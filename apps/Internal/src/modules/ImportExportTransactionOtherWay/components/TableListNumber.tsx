import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, CTable } from '@react/commons/index';
import { ACTION_MODE_ENUM } from '@react/commons/types';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { MESSAGE } from '@react/utils/message';
import { Col, Form } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { ColumnsType } from 'antd/es/table';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import ModalSelectInventory from 'apps/Internal/src/modules/ImportExportTransactionOtherWay/components/ModalSelectedInventory';
import useModal from 'apps/Internal/src/modules/ImportExportTransactionOtherWay/store/useModal';
import {
  IItemProduct,
  TypePage,
} from 'apps/Internal/src/modules/ImportExportTransactionOtherWay/type';
import { FC, Key, useCallback, useEffect, useMemo } from 'react';
import useColumnsProducts from '../hooks/useColumnsProducts';

type Props = {
  actionMode?: ACTION_MODE_ENUM;
  type: TypePage;
};
const TableListNumber: FC<Props> = ({ actionMode, type }) => {
  const form = useFormInstance();
  const orgId = useWatch('orgId', form);
  const dataTable: IItemProduct[] = Form.useWatch('products', form) ?? [];
  const { setIsOpen, setError, error } = useModal();

  useEffect(() => {
    if (dataTable && dataTable.length > 0) {
      setError('');
    }
  }, [dataTable]);

  const handleShowModal = useCallback(() => {
    setIsOpen(true);
  }, []);
  const { PRODUCT_PRODUCT_UOM = [] } = useGetDataFromQueryKey<ParamsOption>([
    REACT_QUERY_KEYS.GET_PARAMS,
  ]);

  const isDisabled = useMemo(() => {
    if (type === TypePage.EXPORT) {
      return !orgId;
    }
    return false;
  }, [actionMode, type, orgId]);

  const columns: ColumnsType<IItemProduct> = useColumnsProducts(
    type,
    PRODUCT_PRODUCT_UOM,
    actionMode
  );

  return (
    <>
      <div>
        <Form.List
          name={'products'}
          rules={[
            {
              validator: (role, value) => {
                if (!value || value.length === 0) {
                  return Promise.reject(MESSAGE.G06);
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          {(_, { add, remove }) => (
            <>
              <Col className="flex justify-between items-center mt-4" span={24}>
                <strong className="text-base">{`Danh sách sản phẩm`}</strong>
                {actionMode !== ACTION_MODE_ENUM.VIEW ? (
                  <Button
                    onClick={handleShowModal}
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    disabled={isDisabled}
                  >
                    Chọn sản phẩm
                  </Button>
                ) : null}
              </Col>
              <Col className="my-4" span={24}>
                <CTable
                  rowKey={'id'}
                  dataSource={dataTable}
                  loading={false}
                  virtual
                  scroll={{
                    y: 500,
                  }}
                  columns={columns}
                  rowClassName={'align-top'}
                  expandable={{
                    showExpandColumn: false,
                    expandedRowKeys: dataTable.map((item) => item.id as Key),
                  }}
                />
              </Col>
            </>
          )}
        </Form.List>
        {error ? (
          <span className={'text-sm text-[#ff4d4f] z-10'}>{error}</span>
        ) : null}
      </div>
      <ModalSelectInventory type={type} />
    </>
  );
};

export default TableListNumber;
