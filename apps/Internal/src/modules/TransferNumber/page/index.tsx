import { CButtonAdd } from '@react/commons/Button';
import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import { CModalConfirm } from '@react/commons/index';
import CSelect from '@react/commons/Select';
import CTable from '@react/commons/Table';
import { TitleHeader } from '@react/commons/Template/style';
import { ActionsTypeEnum } from '@react/constants/app';
import { formatDateBe } from '@react/constants/moment';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Col, Form, Row } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import { INumberTransactionDetail } from 'apps/Internal/src/app/types';
import ModalViewApprovalProcess from 'apps/Internal/src/components/ModalViewApprovalProcess';
import {
  NumberProcessType,
  NumberStockTypes,
  OPTION_NUMBER_PROCESS_TYPE,
} from 'apps/Internal/src/constants/constants';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useDownloadResourceFile } from 'apps/Internal/src/hooks/useGetFileDownload';
import { useGetNumberStocksNoSelect } from 'apps/Internal/src/hooks/useGetNumberStocks';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs, { Dayjs } from 'dayjs';
import { includes } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  getColumns,
  TRANSFER_MOVE_TYPE_OPTION,
  TransferMoveTypeEnum,
} from '../constants';
import { QUERY_KEY } from '../hooks/key';
import { useCancelTransferNumber } from '../hooks/useCancleTransferNumber';
import { useGetStockTranferNumber } from '../hooks/useGetStockTranferNumber';
import { RowHeader, Wrapper } from './style';

const NumberTransferList = () => {
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [recordId, setRecordId] = useState<number>();
  const actionByRole = useRolesByRouter();
  const [searchParams, _] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const [filterMoveType, setFilterMoveType] = useState(
    TRANSFER_MOVE_TYPE_OPTION[0].value
  );
  const [stockTypes, setStockTypes] = useState<number[]>([]);
  const navigate = useNavigate();
  const { data: stockTransferNumber, isLoading: loading } =
    useGetStockTranferNumber(
      queryParams({
        ...params,
        from:
          params.from ??
          dayjs().subtract(1, 'month').startOf('day').format(formatDateBe),
        to: params.to ?? dayjs().endOf('day').format(formatDateBe),
      })
    );
  const { handleSearch } = useSearchHandler(
    QUERY_KEY.GET_STOCK_TRANSFER_NUMBER
  );
  const { mutate: cancelTransferNumber } = useCancelTransferNumber();
  const handleCancel = useCallback(
    (id: number) =>
      CModalConfirm({
        message: 'Bạn có chắc chắn hủy điều chuyển số không?',
        onOk: () => id && cancelTransferNumber(id),
      }),
    [cancelTransferNumber]
  );

  useEffect(() => {
    if (params) {
      const { from, to, ...rest } = params;
      const fromDate = from ? dayjs(from) : dayjs().subtract(29, 'day');
      const toDate = to ? dayjs(to) : dayjs();
      form.setFieldsValue({
        ...rest,
        time: [fromDate, toDate],
        moveType: rest.moveType ? Number(rest.moveType) : null,
        processType: params.processType ? Number(params.processType) : null,
        stockId: params.stockId ? Number(params.stockId) : null,
        ieStockId: params.ieStockId ? Number(params.ieStockId) : null,
      });
    }
  }, []);

  useEffect(() => {
    if (filterMoveType === TRANSFER_MOVE_TYPE_OPTION[0].value) {
      setStockTypes([NumberStockTypes.SALE, NumberStockTypes.SPECIFIC]);
    } else if (filterMoveType === TRANSFER_MOVE_TYPE_OPTION[1].value) {
      setStockTypes([NumberStockTypes.SPECIFIC]);
    } else {
      setStockTypes([]);
    }
  }, [filterMoveType]);

  const { mutate: handleDownloadFile } = useDownloadResourceFile();

  const onFinish = (values: Record<string, string | [Dayjs, Dayjs]>) => {
    const { time, ...rest } = values;
    const payload = {
      ...params,
      ...rest,
      from: time && time[0] ? dayjs(time[0]).format(formatDateBe) : undefined,
      to:
        time && time[1]
          ? dayjs(time[1]).endOf('day').format(formatDateBe)
          : undefined,
    };
    handleSearch(payload);
  };
  const handleAdd = () => {
    navigate(pathRoutes.transferNumberAdd);
  };

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
  }, [setOpenModal]);

  const moveType = useWatch<TransferMoveTypeEnum>('moveType', form);
  const stockId = useWatch<NumberProcessType>('stockId', form);

  const { data: optionStock = [] } = useGetNumberStocksNoSelect([
    NumberStockTypes.SPECIFIC,
    NumberStockTypes.SALE,
  ]);

  const stockSaleInternal = useMemo(() => {
    return optionStock
      .filter((item) => item.stockType === NumberStockTypes.SALE)
      .map((item) => ({
        value: item.id,
        label: item.stockName,
      }));
  }, [optionStock]);

  const stockSpecific = useMemo(() => {
    return optionStock
      .filter((item) => item.stockType === NumberStockTypes.SPECIFIC)
      .map((item) => ({
        value: item.id,
        label: item.stockName,
      }));
  }, [optionStock]);

  const optionStockId = useMemo(() => {
    const result = optionStock.map((item) => ({
      value: item.id,
      label: item.stockName,
    }));
    if (moveType === TransferMoveTypeEnum.INTERNAL) return stockSaleInternal;
    else if (moveType === TransferMoveTypeEnum.OTHER)
      return stockSpecific.concat(stockSaleInternal);
    return result;
  }, [optionStock, stockId, moveType, stockSaleInternal, stockSpecific]);

  const optionIeStockId = useMemo(() => {
    if (moveType && moveType === TransferMoveTypeEnum.INTERNAL) {
      return stockSaleInternal.filter((item) => item.value !== stockId);
    } else if (moveType && moveType === TransferMoveTypeEnum.OTHER) {
      const checkStock = optionStock.find((item) => item.id === stockId);
      if (checkStock && checkStock.stockType === NumberStockTypes.SPECIFIC) {
        return stockSpecific
          .concat(stockSaleInternal)
          .filter((item) => item.value !== stockId);
      } else if (checkStock && checkStock.stockType === NumberStockTypes.SALE) {
        return stockSpecific.filter((item) => item.value !== stockId);
      }
    }
    return optionStock
      .map((item) => ({
        value: item.id,
        label: item.stockName,
      }))
      .filter((item) => item.value !== stockId);
  }, [optionStock, moveType, stockSaleInternal, stockSpecific, stockId]);

  const items: ItemFilter[] = useMemo(() => {
    return [
      {
        label: 'Loại điều chuyển',
        value: (
          <Form.Item name="moveType" className="!w-40">
            <CSelect
              options={TRANSFER_MOVE_TYPE_OPTION}
              placeholder="Chọn loại điều chuyển"
              onChange={() => {
                form.setFieldValue('stockId', null);
                form.setFieldValue('ieStockId', null);
              }}
            />
          </Form.Item>
        ),
      },
      {
        label: 'Kiểu điều chuyển',
        value: (
          <Form.Item name="processType" className="!w-40">
            <CSelect
              options={OPTION_NUMBER_PROCESS_TYPE}
              placeholder="Chọn kiểu điều chuyển"
              onChange={setFilterMoveType}
            />
          </Form.Item>
        ),
      },
      {
        label: 'Kho xuất',
        value: (
          <Form.Item name="stockId" className="!w-40">
            <CSelect options={optionStockId} placeholder="Kho xuất" />
          </Form.Item>
        ),
      },
      {
        label: 'Kho nhận',
        value: (
          <Form.Item name="ieStockId" className="!w-40">
            <CSelect options={optionIeStockId} placeholder="Kho nhận" />
          </Form.Item>
        ),
      },
      {
        label: 'Từ ngày - Đến ngày',
        showDefault: true,
        value: (
          <Form.Item name="time">
            <CRangePicker allowClear={false} />
          </Form.Item>
        ),
      },
    ];
  }, [optionStock, moveType, stockId]);

  const handleDownloadFileOnTable = useCallback((file?: IFileInfo) => {
    handleDownloadFile({
      uri: file?.fileUrl ?? '',
    });
  }, []);
  const onViewProcessApproval = useCallback((id: number) => {
    setOpenModal(true);
    setRecordId(id);
  }, []);
  const handleCancelRequest = useCallback((id: number) => {
    handleCancel(id);
  }, []);
  const handleView = useCallback((id: number) => {
    navigate(pathRoutes.transferNumberView(id));
  }, []);

  const columns: ColumnsType<INumberTransactionDetail> = getColumns(
    handleDownloadFileOnTable,
    onViewProcessApproval,
    handleCancelRequest,
    handleView
  );

  return (
    <Wrapper>
      <TitleHeader>Danh sách điều chuyển số</TitleHeader>
      <RowHeader style={{ width: '100%' }}>
        <Form
          form={form}
          onFinish={onFinish}
          validateTrigger={['onSubmit', 'onBlur']}
        >
          <Row style={{ width: '100%' }} gutter={[16, 32]}>
            <Col>
              <CFilter
                items={items}
                validQuery={QUERY_KEY.GET_STOCK_TRANSFER_NUMBER}
              />
            </Col>
          </Row>
        </Form>
        {includes(actionByRole, ActionsTypeEnum.CREATE) && (
          <CButtonAdd onClick={handleAdd} />
        )}
      </RowHeader>
      <Row>
        <CTable
          dataSource={stockTransferNumber?.content ?? []}
          columns={columns}
          loading={loading}
          pagination={{
            total: stockTransferNumber?.totalElements,
          }}
        />
      </Row>
      <ModalViewApprovalProcess
        open={openModal}
        onClose={handleCloseModal}
        objectName="ISDN_TRANSACTION"
        id={recordId}
      />
    </Wrapper>
  );
};
export default NumberTransferList;
