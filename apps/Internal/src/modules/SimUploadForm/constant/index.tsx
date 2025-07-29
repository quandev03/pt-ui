import { CButtonDetail } from '@react/commons/Button';
import { CInput, CNumberInput } from '@react/commons/index';
import CTag from '@react/commons/Tag';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { ACTION_MODE_ENUM } from '@react/commons/types';
import { ActionsTypeEnum } from '@react/constants/app';
import { formatDate } from '@react/constants/moment';
import { MESSAGE } from '@react/utils/message';
import { Dropdown, Form, Row, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FormInstance } from 'antd/lib';
import { IOption } from 'apps/Internal/src/components/layouts/types';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { FormattedMessage } from 'react-intl';
import {
  ApprovedStatusEnum,
  FormStatusEnum,
  IProductItem,
  ISimUploadFormItem,
  ISimUploadFormParams,
} from '../types';
import { ColorList } from '@react/constants/color';

export const COLOR_APPROVED_STATUS = {
  [ApprovedStatusEnum.PENDING]: ColorList.WAITING,
  [ApprovedStatusEnum.APPROVING]: ColorList.PROCESSING,
  [ApprovedStatusEnum.APPROVED]: ColorList.SUCCESS,
  [ApprovedStatusEnum.REJECT]: ColorList.FAIL,
};

export const COLOR_FORM_STATUS = {
  [FormStatusEnum.PENDING]: ColorList.WAITING,
  [FormStatusEnum.PROCESSING]: ColorList.PROCESSING,
  [FormStatusEnum.SUCCESS]: ColorList.SUCCESS,
  [FormStatusEnum.CANCEL]: ColorList.FAIL,
};

export const getColumnsTableSimUpload = (
  params: ISimUploadFormParams,
  optionApprovalStatus: IOption[],
  optionOrderStatus: IOption[],
  listRoles: ActionsTypeEnum[],
  onAction: (type: ACTION_MODE_ENUM, record: ISimUploadFormItem) => void
): ColumnsType<ISimUploadFormItem> => {
  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      render(_, __, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },
    {
      title: 'Mã đơn upload',
      dataIndex: 'uploadOrderNo',
      width: 150,
      align: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Số PO',
      dataIndex: 'deliveryOrderNo',
      width: 150,
      align: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'amountNumber',
      width: 100,
      align: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 210,
      align: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      width: 130,
      align: 'left',
      render(value) {
        const renderedValue = dayjs(value).format(formatDate);
        return (
          <Tooltip title={renderedValue} placement="topLeft">
            <Text>{renderedValue}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái phê duyệt',
      dataIndex: 'approvalStatus',
      width: 130,
      align: 'left',
      render(value) {
        const color = COLOR_APPROVED_STATUS[value as ApprovedStatusEnum];
        const text =
          optionApprovalStatus.find((item) => item.value == value)?.label ?? '';
        return (
          <Tooltip title={text} placement="topLeft">
            <CTag bordered={false} color={color}>
              {text}
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái đơn',
      dataIndex: 'orderStatus',
      width: 130,
      align: 'left',
      render(value) {
        const color = COLOR_FORM_STATUS[value as ApprovedStatusEnum];
        const text =
          optionOrderStatus.find((item) => item.value == value)?.label ?? '';
        return (
          <Tooltip title={text} placement="topLeft">
            <CTag bordered={false} color={color}>
              {text}
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: <FormattedMessage id="common.action" />,
      align: 'center',
      width: 160,
      fixed: 'right',
      render(_, record) {
        const items = [];
        if (
          includes(listRoles, ActionsTypeEnum.CANCEL) &&
          record.approvalStatus === +ApprovedStatusEnum.PENDING
        ) {
          items.push({
            key: ActionsTypeEnum.CANCEL,
            onClick: () => {
              onAction(ACTION_MODE_ENUM.Cancel, record);
            },
            label: <Text type="danger">Hủy upload</Text>,
          });
        }
        if (includes(listRoles, ActionsTypeEnum.VIEW_APPROVAL_PROGRESS)) {
          items.push({
            key: ActionsTypeEnum.VIEW_APPROVAL_PROGRESS,
            onClick: () => {
              onAction(ACTION_MODE_ENUM.VIEW_APPROVAL_PROGRESS, record);
            },
            label: <Text>Tiến độ phê duyệt</Text>,
          });
        }

        return (
          <WrapperActionTable>
            {includes(listRoles, ActionsTypeEnum.READ) && (
              <CButtonDetail
                onClick={() => {
                  onAction(ACTION_MODE_ENUM.VIEW, record);
                }}
              />
            )}
             <div className="w-5">
              {(includes(listRoles, ActionsTypeEnum.READ) ||
                includes(listRoles, ActionsTypeEnum.CANCEL)) && (
                <Dropdown
                  menu={{ items: items }}
                  placement="bottom"
                  trigger={['click']}
                >
                  <IconMore className="iconMore" />
                </Dropdown>
              )}

             </div>
          </WrapperActionTable>
        );
      },
    },
  ];
};

export const getColumnsTableProduct = (
  unitOptions: IOption[],
  handleChangeAmount: (index: number, value: number) => void,
  orderLineForm: FormInstance,
  isViewDetail: boolean
): ColumnsType<IProductItem> => {
  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      render(_, __, index) {
        return <Text>{index + 1}</Text>;
      },
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'productCode',
      width: 150,
      align: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Loại sản phẩm',
      dataIndex: 'categoryName',
      width: 150,
      align: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      width: 150,
      align: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'productUom',
      width: 150,
      align: 'left',
      render(value) {
        const renderedValue = unitOptions.find(
          (item) => item.value == value
        )?.label;
        return (
          <Tooltip title={renderedValue} placement="topLeft">
            <Text>{renderedValue}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Số lượng chưa upload',
      dataIndex: 'remainingAmount',
      width: 150,
      align: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Số lượng upload',
      dataIndex: 'amountNumber',
      width: 150,
      align: 'left',
      render(value, _, index) {
        const keyAllowed = [
          'ArrowRight',
          'ArrowLeft',
          'Backspace',
          'Delete',
          'Tab',
          'Enter',
        ];
        const handleKeyDown = (
          event: React.KeyboardEvent<HTMLInputElement>
        ) => {
          const { key, ctrlKey } = event;
          if (ctrlKey && (key === 'c' || key === 'v')) {
            return;
          }
          if (!/^[0-9]$/.test(key) && !includes(keyAllowed, key)) {
            event.preventDefault();
          }
        };
        return (
          <Form form={orderLineForm} disabled={isViewDetail}>
            <Form.Item
              name={[index, 'amountNumber']}
              rules={[
                {
                  required: true,
                  message: MESSAGE.G06,
                },
              ]}
              className="text-wrap"
            >
              <CInput
                value={value}
                onChange={(e) =>
                  handleChangeAmount(index, Number(e.target?.value))
                }
                onKeyDown={handleKeyDown}
                maxLength={9}
              />
            </Form.Item>
          </Form>
        );
      },
    },
  ];
};
