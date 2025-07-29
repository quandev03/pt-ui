import { Col, Form, Row } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getColumnsTableUploadNumber } from '../constants';
import { AnyElement } from '@react/commons/types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import CTable from '@react/commons/Table';
import {
  BtnGroupFooter,
  RowHeader,
  WrapperButton,
} from '@react/commons/Template/style';
import CButton from '@react/commons/Button';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import useUploadNumberStore from '../store';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useGetListUploadNumber from '../hook/useGetListUploadNumber';
import useCancelUpload from '../hook/useCancelUpload';
import dayjs from 'dayjs';
import { formatDate } from '@react/constants/moment';
import { CModalConfirm, CRangePicker } from '@react/commons/index';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import ModalViewApprovalProcess from 'apps/Internal/src/components/ModalViewApprovalProcess';
import { useDownloadResourceFile } from 'apps/Internal/src/hooks/useGetFileDownload';
import { INumberTransactionDetail } from 'apps/Internal/src/app/types';
import { PlusOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import { DateFormat } from '@react/constants/app';

const Container = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const [form] = Form.useForm();
  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.GET_LIST_UPLOAD_NUMBER
  );
  const items: ItemFilter[] = [
    {
      label: 'Ngày tạo',
      value: (
        <Form.Item name="rangePicker">
          <CRangePicker allowClear={false} />
        </Form.Item>
      ),
      showDefault: true,
    },
  ];
  const { data: dataUploadNumber, isPending: loadingUploadNumber } =
    useGetListUploadNumber(queryParams(params));
  const listUploadDigitalResources = useMemo(() => {
    if (!dataUploadNumber) return [];
    return dataUploadNumber;
  }, [dataUploadNumber]);
  const [recordId, setRecordId] = useState<number>(0);
  const { setIsOpenModalApprovalProgress, isOpenModalApprovalProgress } =
    useUploadNumberStore();
  const handleAction = useCallback(
    (id: number) => {
      setRecordId(id);
      setIsOpenModalApprovalProgress(true);
    },
    [setIsOpenModalApprovalProgress, recordId]
  );
  const handleView = useCallback(
    (id: number) => {
      navigate(pathRoutes.uploadNumberView(id));
    },
    [navigate]
  );
  const { mutate: cancelUpload } = useCancelUpload();
  const handleCancelUpload = useCallback(
    (id: number) => {
      CModalConfirm({
        message: 'Bạn có chắc chắn hủy upload tài nguyên số không?',
        onOk: () => id && cancelUpload(id),
      });
    },
    [cancelUpload]
  );
  const { mutate: handleDownloadFile } = useDownloadResourceFile();
  const columns: ColumnsType<INumberTransactionDetail> = useMemo(() => {
    return getColumnsTableUploadNumber(params, {
      onView: handleView,
      onAction: handleAction,
      onCancelUpload: handleCancelUpload,
      onDownload: (record) => {
        handleDownloadFile({
          uri: record?.fileUrl ?? '',
        });
      },
    });
  }, [params, handleAction, handleCancelUpload]);
  useEffect(() => {
    if (params) {
      const { from, to, ...rest } = params;
      const fromDate = from
        ? dayjs(from, formatDate)
        : dayjs().subtract(29, 'day');
      const toDate = to ? dayjs(to, formatDate) : dayjs();
      form.setFieldsValue({
        ...rest,
        rangePicker: [fromDate, toDate],
      });
    }
  }, [params]);
  const handleSubmit = async (values: AnyElement) => {
    const { rangePicker, ...rest } = values;
    const errors = form.getFieldsError();
    const rangePickerErrors = errors.find(
      (error) => error.name[0] === 'rangePicker'
    );
    if (rangePickerErrors && rangePickerErrors.errors.length > 0) {
      return;
    }
    const [fromDate, toDate] = rangePicker || [dayjs(), dayjs()];
    setSearchParams({
      ...params,
      ...rest,
      from: fromDate.format(formatDate),
      to: toDate.format(formatDate),
      page: 0,
      queryTime: dayjs().format(DateFormat.TIME),
    });
    handleSearch(params);
  };

  const handleRefresh = () => {
    form.resetFields();
    setSearchParams({
      ...params,
      page: 0,
      queryTime: dayjs().format(DateFormat.TIME),
      from: dayjs().subtract(29, 'day').format(formatDate),
      to: dayjs().format(formatDate),
    });
  };

  return (
    <div>
      <RowHeader style={{ width: '100%' }}>
        <Form
          onFinish={handleSubmit}
          form={form}
          initialValues={{
            rangePicker: [dayjs().subtract(29, 'day'), dayjs()],
          }}
        >
          <Row style={{ width: '100%' }} gutter={[16, 32]}>
            <Col>
              <Form.Item name="rangePicker">
                <CRangePicker allowClear={false} />
              </Form.Item>
            </Col>
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
                onClick={handleRefresh}
                title="Làm mới"
              />
            </WrapperButton>
            <BtnGroupFooter>
              <CButton
                onClick={() => navigate(pathRoutes.uploadNumberAdd)}
                icon={<PlusOutlined />}
              >
                Thêm mới
              </CButton>
            </BtnGroupFooter>
          </Row>
        </Form>
      </RowHeader>
      <Row>
        <CTable
          loading={loadingUploadNumber}
          rowKey={'id'}
          columns={columns}
          dataSource={listUploadDigitalResources.content}
          pagination={{
            current: params.page + 1,
            pageSize: params.size,
            total: listUploadDigitalResources.totalElements,
          }}
        />
      </Row>
      <ModalViewApprovalProcess
        open={isOpenModalApprovalProgress}
        onClose={() => setIsOpenModalApprovalProgress(false)}
        objectName="ISDN_TRANSACTION"
        id={recordId}
      />
    </div>
  );
};

export default Container;
