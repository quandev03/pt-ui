import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { RowHeader } from '@react/commons/Template/style';
import { ModelStatus } from '@react/commons/types';
import { decodeSearchParams } from '@react/helpers/utils';
import { Form, Row, Space, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CRangePicker } from '@react/commons/DatePicker';
import useSearchHandler from '@react/hooks/useSearchHandler';
import dayjs from 'dayjs';
import { ActionsTypeEnum, DateFormat } from '@react/constants/app';
import { useParameterQuery } from 'apps/Internal/src/hooks/useParameterQuery';
import { SubscriberType } from '../types';
import CButton from '@react/commons/Button';
import useSubscriberStore from '../store';
import SubscriberModal from './SubscriberModal';
import SubscriberByListModal from './SubscriberByListModal';
import SubscriberByFileModal from './SubscriberByFileModal';
import CancelSubscriberByListModal from './CancelSubscriberByListModal';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { uniqBy } from 'lodash';

const Header = () => {
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const actions = useRolesByRouter();
  const { subIds } = useSubscriberStore();
  const [isOpenSubscriber, setIsOpenSubscriber] = useState(false);
  const [isOpenSubscriberByList, setIsOpenSubscriberByList] = useState(false);
  const [isOpenSubscriberByFile, setIsOpenSubscriberByFile] = useState(false);
  const [isOpenCancelSubscriberByList, setIsOpenCancelSubscriberByList] =
    useState(false);
  const { handleSearch } = useSearchHandler('GET_LIST_SUBSCRIBER_ENTERPRISE');
  const { data: activeStatusData } = useParameterQuery({
    'table-name': 'SUBSCRIBER',
    'column-name': 'ACTIVE_STATUS',
  });

  useEffect(() => {
    if (params) {
      form.setFieldsValue({
        ...params,
        rangePicker: [
          params.fromDate
            ? dayjs(params.fromDate, DateFormat.DEFAULT)
            : dayjs().subtract(6, 'M'),
          params.toDate ? dayjs(params.toDate, DateFormat.DEFAULT) : dayjs(),
        ],
      });
    }
  }, [params]);

  const handleFinish = (values: any) => {
    handleSearch(
      {
        textSearch: values.textSearch,
        subType: values.subType,
        status: values.status,
        activeStatus: values.activeStatus,
        dateType: '1',
        fromDate: values.rangePicker
          ? dayjs(values.rangePicker[0]).format(DateFormat.DEFAULT)
          : dayjs().subtract(6, 'M').format(DateFormat.DEFAULT),
        toDate: values.rangePicker
          ? dayjs(values.rangePicker[1]).format(DateFormat.DEFAULT)
          : dayjs().format(DateFormat.DEFAULT),
      },
      { replace: true }
    );
  };

  const handleRefresh = () => {
    form.resetFields();
    setSearchParams(
      {
        tab: 'subscriber',
        filters: '1',
        queryTime: dayjs().format(DateFormat.TIME),
      },
      { replace: true }
    );
  };

  const items: ItemFilter[] = [
    {
      label: 'Loại thuê bao',
      value: (
        <Form.Item name="subType" className="w-40">
          <CSelect
            placeholder="Loại thuê bao"
            showSearch={false}
            options={[
              { value: SubscriberType.M2M },
              { value: SubscriberType.H2H },
            ]}
          />
        </Form.Item>
      ),
    },
    {
      showDefault: true,
      label: 'Trạng thái thuê bao',
      value: (
        <Form.Item name="status" className="w-44">
          <CSelect
            placeholder="Trạng thái thuê bao"
            showSearch={false}
            options={[
              {
                label: 'Đang hoạt động',
                value: ModelStatus.ACTIVE,
              },
              {
                label: 'Đã hủy',
                value: ModelStatus.INACTIVE,
              },
            ]}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Trạng thái chặn cắt',
      value: (
        <Form.Item name="activeStatus" className="w-44">
          <CSelect
            placeholder="Trạng thái chặn cắt"
            showSearch={false}
            options={uniqBy(activeStatusData, 'label')?.map(
              ({ label, value }) => ({ label, value })
            )}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Ngày kích hoạt',
      value: (
        <>
          <Form.Item name="dateType">
            <CSelect
              placeholder="Ngày kích hoạt"
              showSearch={false}
              allowClear={false}
              options={[{ label: 'Ngày kích hoạt', value: '1' }]}
            />
          </Form.Item>
          <Form.Item
            name="rangePicker"
            className="w-72"
            rules={[
              {
                validator: (_, value) => {
                  if (value) {
                    const toDate = dayjs(value[1]).subtract(6, 'M');
                    if (toDate.isAfter(value[0], 'D')) {
                      return Promise.reject(
                        'Thời gian tìm kiếm không được vượt quá 6 tháng'
                      );
                    }
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <CRangePicker allowClear={false} />
          </Form.Item>
        </>
      ),
    },
  ];

  return (
    <RowHeader>
      <Form
        form={form}
        onFinish={handleFinish}
        initialValues={{
          dateType: '1',
          rangePicker: [dayjs().subtract(6, 'M'), dayjs()],
        }}
      >
        <CFilter
          items={items}
          onRefresh={handleRefresh}
          searchComponent={
            <Tooltip
              title="Nhập Số thuê bao hoặc Người/Thiết bị SD"
              placement="topLeft"
            >
              <Form.Item name="textSearch" className="w-52">
                <CInput placeholder="Nhập điều kiện tìm kiếm" maxLength={100} />
              </Form.Item>
            </Tooltip>
          }
        />
      </Form>
      <Row justify="end" className="w-full">
        <Space>
          {actions.includes(ActionsTypeEnum['BLOCK/UNBLOCK_SUBCRIBER']) && (
            <CButton
              disabled={!subIds.length}
              onClick={() => setIsOpenSubscriberByList(true)}
            >
              Chặn/Mở thuê bao
            </CButton>
          )}
          {actions.includes(ActionsTypeEnum.CANCEL_SUBSCRIPTION) && (
            <CButton
              disabled={!subIds.length}
              onClick={() => setIsOpenCancelSubscriberByList(true)}
            >
              Hủy thuê bao
            </CButton>
          )}
          {actions.includes(ActionsTypeEnum['BLOCK/UNBLOCK_SUBCRIBER']) && (
            <CButton onClick={() => setIsOpenSubscriberByFile(true)}>
              Chặn/Mở theo file
            </CButton>
          )}
        </Space>
      </Row>
      <SubscriberModal
        isOpen={isOpenSubscriber}
        setIsOpen={setIsOpenSubscriber}
      />
      <SubscriberByListModal
        isOpen={isOpenSubscriberByList}
        setIsOpen={setIsOpenSubscriberByList}
      />
      <SubscriberByFileModal
        isOpen={isOpenSubscriberByFile}
        setIsOpen={setIsOpenSubscriberByFile}
      />
      <CancelSubscriberByListModal
        isOpen={isOpenCancelSubscriberByList}
        setIsOpen={setIsOpenCancelSubscriberByList}
      />
    </RowHeader>
  );
};

export default Header;
