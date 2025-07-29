import { CButtonAdd } from '@react/commons/Button';
import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import CTable from '@react/commons/Table';
import {
  BtnGroupFooter,
  RowHeader,
  TitleHeader,
} from '@react/commons/Template/style';
import { ACTION_MODE_ENUM, AnyElement } from '@react/commons/types';
import { formatDate } from '@react/constants/moment';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Flex, Form, Row, Tooltip } from 'antd';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ModalProcess from '../components/ModalProgress';
import { getColumnsTableSimUpload } from '../constant';
import { useGetUploadFormList } from '../queryHook/useGetUploadFormList';
import { ISimUploadFormItem } from '../types';
import { useCancelUploadForm } from '../queryHook/useCancelUploadForm';
import { useGetApprovalProcess } from '../queryHook/useGetApprovalProcess';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const UploadFormList = () => {
  const navigate = useNavigate();
  const listRoles = useRolesByRouter();
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const [isOpenModalProgress, setIsOpenModalProgress] = useState(false);
  const { STOCK_PRODUCT_UPLOAD_ORDER_APPROVAL_STATUS = [] } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  const { STOCK_PRODUCT_UPLOAD_ORDER_ORDER_STATUS = [] } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  const { mutate: getApprovalData, data: approvalProcessData } =
    useGetApprovalProcess();
  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.GET_UPLOAD_SIM_FORM_LIST
  );
  const { mutate: cancelUploadForm } = useCancelUploadForm();
  const items: ItemFilter[] = [
    {
      label: 'Trạng thái phê duyệt',
      value: (
        <Form.Item label="" name="approvalStatus" className="w-52 mb-0">
          <CSelect
            options={STOCK_PRODUCT_UPLOAD_ORDER_APPROVAL_STATUS}
            placeholder="Trạng thái phê duyệt"
            showSearch={false}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Trạng thái đơn',
      value: (
        <Form.Item label="" name="orderStatus" className="w-48 mb-0">
          <CSelect
            options={STOCK_PRODUCT_UPLOAD_ORDER_ORDER_STATUS}
            placeholder="Trạng thái đơn"
            showSearch={false}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Thời gian',
      value: (
        <Form.Item name="rangePicker">
          <CRangePicker />
        </Form.Item>
      ),
      showDefault: true,
    },
  ];
  useEffect(() => {
    if (!params.startDate) {
      setSearchParams({
        startDate: dayjs().subtract(30, 'day').format(formatDate),
        endDate: dayjs().format(formatDate),
        filters: '2',
      });
    }
  }, [params.startDate]);
  useEffect(() => {
    if (params) {
      form.setFieldsValue({
        approvalStatus: params.approvalStatus,
        orderStatus: params.orderStatus,
        searchValue: params.searchValue,
        rangePicker: [
          dayjs(params.startDate, formatDate),
          dayjs(params.endDate, formatDate),
        ],
      });
    }
  }, [params]);
  const { data: dataTable, isLoading } = useGetUploadFormList(
    queryParams(params)
  );
  const handleAction = useCallback(
    (action: ACTION_MODE_ENUM, record: ISimUploadFormItem) => {
      switch (action) {
        case ACTION_MODE_ENUM.VIEW_APPROVAL_PROGRESS:
          setIsOpenModalProgress(true);
          getApprovalData(record.id);
          return;
        case ACTION_MODE_ENUM.Cancel:
          ModalConfirm({
            message: 'Bạn có chắc muốn hủy đơn upload này không?',
            handleConfirm: () => {
              cancelUploadForm(record.id);
            },
          });
          return;
        case ACTION_MODE_ENUM.VIEW:
          return navigate(pathRoutes.viewUploadSimForm(record.id));
        default:
          break;
      }
    },
    []
  );
  const handleClickAdd = () => {
    navigate(pathRoutes.addUploadSimForm);
  };
  const handleFinish = (values: AnyElement) => {
    const { rangePicker, ...rest } = values;
    const [startDate, endDate] = rangePicker;
    handleSearch({
      ...params,
      ...rest,
      startDate: startDate.format(formatDate),
      endDate: endDate.format(formatDate),
      page: 0,
    });
  };
  return (
    <div>
      <TitleHeader>Danh sách đơn upload</TitleHeader>
      <RowHeader>
        <Form form={form} onFinish={handleFinish}>
          <Row gutter={[10, 10]}>
            <Flex gap={8}>
              <CFilter
                items={items}
                searchComponent={
                  <Tooltip
                    title="Nhập mã đơn upload hoặc số PO"
                    placement="right"
                  >
                    <Form.Item name="searchValue" className="w-[260px]">
                      <CInput
                        placeholder="Nhập mã đơn upload hoặc số PO"
                        maxLength={100}
                        prefix={<FontAwesomeIcon icon={faSearch} />}
                      />
                    </Form.Item>
                  </Tooltip>
                }
              />
            </Flex>
            <BtnGroupFooter>
              <CButtonAdd onClick={handleClickAdd} />
            </BtnGroupFooter>
          </Row>
        </Form>
      </RowHeader>
      <CTable
        columns={getColumnsTableSimUpload(
          params,
          STOCK_PRODUCT_UPLOAD_ORDER_APPROVAL_STATUS,
          STOCK_PRODUCT_UPLOAD_ORDER_ORDER_STATUS,
          listRoles,
          handleAction
        )}
        dataSource={dataTable?.content || []}
        pagination={{
          current: params.page + 1,
          pageSize: params.size,
          total: dataTable?.totalElements || 0,
        }}
        loading={isLoading}
      />
      <ModalProcess
        isOpen={isOpenModalProgress}
        setIsOpen={setIsOpenModalProgress}
        dataTable={approvalProcessData || []}
      />
    </div>
  );
};
export default UploadFormList;
