import { RowHeader, Text, WrapperButton } from '@react/commons/Template/style';
import type { TablePaginationConfig } from 'antd';
import { Col, Form, Row, Space, Tooltip } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSearchParams } from 'react-router-dom';
import { useList } from '../queryHook/useList';
import { ContentItem } from '../types';
import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import CButton, { CButtonExport } from '@react/commons/Button';
import CTableSearch, { ExtendedColumnsType } from '@react/commons/TableSearch';
import CTag from '@react/commons/Tag';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { formatDate, formatDateTime } from '@react/constants/moment';
import dayjs from 'dayjs';
import Header from './Header';
import CInputNumber from '@react/commons/InputNumber';
import { StyledButton } from '../page/style';
import { useExportList } from '../queryHook/useExport';
import {
  ActiveStatus,
  ApproveStatus,
  idType,
} from '../../ActivationRequestList/types';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { includes } from 'lodash';
import { ActionsTypeEnum } from '@react/constants/app';
import { ColorList } from '@react/constants/color';
import { useActivationAssignedStore } from '../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Body: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [paramsTab, setParamsTab] = useState({ page: 0, size: 20 });
  const params = decodeSearchParams(searchParams);
  const [formSelect] = Form.useForm();
  const [disableSelectBtn, setDisableSelectBtn] = useState(true);
  const listRoleByRouter = useRolesByRouter();
  const intl = useIntl();
  const { clickSearch, setClickSearch } = useActivationAssignedStore();
  const recordFrom = Form.useWatch('recordFrom', formSelect);
  const recordTo = Form.useWatch('recordTo', formSelect);
  const { isLoading: loadingTable, data: dataTable } = useList(
    queryParams(params)
  );
  const { mutateAsync: mutateExport } = useExportList();

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const onSelectChange = useCallback((newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  }, []);

  const [setHeightTable] = useState(0);

  useEffect(() => {
    const id = setTimeout(changeHeightTable, 500);
    return () => {
      clearTimeout(id);
    };
  }, []);

  useEffect(() => {
    if (clickSearch === true) {
      setSelectedRowKeys([]);
      formSelect.resetFields();
    }
  }, [clickSearch]);

  useEffect(() => {
    if (recordFrom && recordTo) {
      setDisableSelectBtn(false);
    } else {
      setDisableSelectBtn(true);
    }
    if (recordFrom === 0) {
      formSelect.setFields([
        {
          name: 'recordFrom',
          errors: ['Dữ liệu không hợp lệ'],
        },
      ]);
    } else {
      formSelect.setFields([
        {
          name: 'recordFrom',
          errors: [],
        },
      ]);
    }
    if (recordTo === 0) {
      formSelect.setFields([
        {
          name: 'recordTo',
          errors: ['Dữ liệu không hợp lệ'],
        },
      ]);
    } else {
      formSelect.setFields([
        {
          name: 'recordTo',
          errors: [],
        },
      ]);
    }
  }, [recordFrom, recordTo]);

  const handleFinishSelect = () => {
    setClickSearch(false);
    if (recordFrom > recordTo) {
      formSelect.setFields([
        {
          name: 'recordFrom',
          errors: ['Dữ liệu không hợp lệ'],
        },
      ]);
      return;
    } else {
      formSelect.setFields([
        {
          name: 'recordFrom',
          errors: [],
        },
      ]);
    }

    const selectedKeys = dataTable?.content
      .slice(recordFrom - 1, recordTo)
      .filter(
        (item: any) => item.approveStatus !== 1 && item.approveStatus !== 2
      )
      .map((item: any) => item.id);

    setSelectedRowKeys(selectedKeys);
  };

  const onDownload = () => {
    mutateExport(params);
  };

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange: onSelectChange,
      getCheckboxProps: (record: ContentItem) => ({
        disabled: record.approveStatus === 2 || record.approveStatus === 1,
      }),
    }),
    [onSelectChange, selectedRowKeys]
  );

  const handleChangeTable = useCallback(
    (pagination: TablePaginationConfig) => {
      // setParamsFake({
      //   page: (pagination.current as number) - 1,
      //   size: pagination.pageSize,
      // });
      setParamsTab({
        ...paramsTab,
        page: (pagination.current as number) - 1,
        size: pagination.pageSize as number,
      });
    },
    [paramsTab]
  );

  const columns: ExtendedColumnsType<ContentItem> = [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      searchDisiable: true,
      render(_, record, index) {
        const stt = index + 1 + paramsTab.page * paramsTab.size;
        return <Text>{stt}</Text>;
      },
    },
    {
      title: 'Nhân viên phát triển',
      dataIndex: 'empCode',
      width: 180,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        );
      },
    },
    {
      title: 'Tên đối tác',
      dataIndex: 'distributor',
      width: 120,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        );
      },
    },
    {
      title: 'Số hợp đồng',
      dataIndex: 'contractNo',
      width: 140,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày tạo yêu cầu',
      dataIndex: 'requestDate',
      width: 160,
      align: 'left',
      values: (value) => dayjs(value).format(formatDate),
      render(value, record) {
        return (
          <Tooltip
            title={dayjs(value).format(formatDateTime)}
            placement="topLeft"
          >
            {dayjs(value).format(formatDate)}
          </Tooltip>
        );
      },
    },
    {
      title: 'Số thuê bao',
      dataIndex: 'isdn',
      width: 120,
      align: 'left',
      values: (value) => value,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        );
      },
    },
    {
      title: 'Tên KH',
      dataIndex: 'name',
      width: 120,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthDate',
      width: 120,
      align: 'left',
      values: (value) => dayjs(value).format(formatDate),
      render(value, record) {
        return (
          <Tooltip title={dayjs(value).format(formatDate)} placement="topLeft">
            {dayjs(value).format(formatDate)}
          </Tooltip>
        );
      },
    },
    {
      title: 'Loại GTTT',
      dataIndex: 'idType',
      width: 120,
      align: 'left',
      values: (value) => idType[value as keyof typeof idType],
      render(value, record) {
        return (
          <Tooltip
            title={idType[value as keyof typeof idType]}
            placement="topLeft"
          >
            {idType[value as keyof typeof idType]}
          </Tooltip>
        );
      },
    },
    {
      title: 'Số GTTT',
      dataIndex: 'idNo',
      width: 120,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        );
      },
    },
    {
      title: 'Loại KH',
      dataIndex: 'custType',
      width: 120,
      align: 'left',
      render(value, record) {
        let text = value;
        if (value === 'VNS') {
          text = 'Cá nhân';
        } else if (value === 'DN') {
          text = 'Doanh nghiệp';
        }
        return (
          <Tooltip title={text} placement="topLeft">
            {text}
          </Tooltip>
        );
      },
    },
    {
      title: 'User tiền kiểm',
      dataIndex: 'approveUser',
      width: 140,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày tiền kiểm',
      dataIndex: 'approveDate',
      width: 140,
      align: 'left',
      values: (value) => dayjs(value).format(formatDate),
      render(value, record) {
        return (
          <Tooltip
            title={value === null ? value : dayjs(value).format(formatDateTime)}
            placement="topLeft"
          >
            {value === null ? value : dayjs(value).format(formatDate)}
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái tiền kiểm',
      dataIndex: 'approveStatus',
      width: 180,
      align: 'center',
      values: (value) => ApproveStatus[value as keyof typeof ApproveStatus],
      render(value, record) {
        return (
          <Tooltip
            title={ApproveStatus[value as keyof typeof ApproveStatus]}
            placement="top"
          >
            <CTag
              color={
                value === 0 //Cho xu ly
                  ? 'yellow'
                  : value === 1 //Duyệt
                    ? 'green'
                    : value === 2
                      ? 'red' //Từ chối
                      : 'blue'
              }
            >
              <FormattedMessage
                id={ApproveStatus[value as keyof typeof ApproveStatus]}
              />
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái KH',
      dataIndex: 'activeStatus',
      width: 150,
      align: 'center',
      values: (value) => ActiveStatus[value as keyof typeof ActiveStatus],
      render(value, record) {
        return (
          <Tooltip
            title={ActiveStatus[value as keyof typeof ActiveStatus]}
            placement="top"
          >
            <CTag
              color={
                value === 0 //Cho xu ly
                  ? ColorList.WAITING
                  : value === 1 //Thanh cong
                    ? ColorList.SUCCESS
                    : value === 2
                      ? ColorList.FAIL
                      : ColorList.DEFAULT //That bai
              }
            >
              <FormattedMessage
                id={ActiveStatus[value as keyof typeof ActiveStatus]}
              />
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái phân công tiền kiểm',
      dataIndex: 'approveStatusCheck',
      width: 250,
      align: 'center',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        );
      },
    },
  ];

  const changeHeightTable = () => {
    const heightWrapper =
      document.getElementById('wrapperUserGroup')?.offsetHeight;
    setHeightTable((heightWrapper ?? 0) - 205);
  };

  return (
    <div>
      <Header
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      ></Header>
      <RowHeader className={'!justify-end'}>
        <Form form={formSelect} onFinish={handleFinishSelect}>
          <Row gutter={[5, 24]}>
            <Col span={4}>
              <Form.Item name={'recordFrom'}>
                <CInputNumber
                  type="number"
                  placeholder="Nhập số bản ghi từ"
                  min={1}
                  max={1000}
                  precision={0}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    ['-', '+', '.', 'e', ','].includes(e.key) &&
                    e.preventDefault()
                  }
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name={'recordTo'}>
                <CInputNumber
                  type="number"
                  placeholder="Nhập số bản ghi đến"
                  min={1}
                  max={1000}
                  precision={0}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    ['-', '+', '.', 'e', ','].includes(e.key) &&
                    e.preventDefault()
                  }
                />
              </Form.Item>
            </Col>
            <Col span={1.5}>
              <CButton htmlType="submit" disabled={disableSelectBtn}>
                Chọn
              </CButton>
            </Col>
            <Col span={8}>
              <div className="font-medium text-[#ff4d4f] mt-1.5">
                Số bản ghi thực tế khi tìm kiếm: {dataTable?.totalElements ?? 0}
              </div>
            </Col>
          </Row>
        </Form>
        <WrapperButton>
          {includes(listRoleByRouter, ActionsTypeEnum.ASSIGN) && (
            <StyledButton
              disableStyle={selectedRowKeys.length === 0}
              disabled={selectedRowKeys.length === 0}
              onClick={() => setIsOpenModal(true)}
              icon={<FontAwesomeIcon icon={faUser} />}
            >
              {intl.formatMessage({ id: 'Phân công' })}
            </StyledButton>
          )}
          {includes(listRoleByRouter, ActionsTypeEnum.EXPORT_EXCEL) && (
            <CButtonExport onClick={onDownload}></CButtonExport>
          )}
        </WrapperButton>
      </RowHeader>
      {!loadingTable && (
        <>
          <Space style={{ marginBottom: 16 }}></Space>
          <CTableSearch
            columns={columns}
            rowKey={'id'}
            rowSelection={rowSelection}
            dataSource={dataTable?.content}
            pagination={{
              current: paramsTab.page + 1,
              pageSize: paramsTab.size,
              total: dataTable?.totalElements,
            }}
            onChange={handleChangeTable}
            loading={loadingTable}
          />
        </>
      )}
    </div>
  );
};

export default Body;
