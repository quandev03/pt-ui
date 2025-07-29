import { CButtonDetail } from '@react/commons/Button';
import CTable from '@react/commons/Table';
import CTag from '@react/commons/Tag';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { TotalTableMessage } from '@react/commons/Template/TotalTableMessage';
import { ActionsTypeEnum } from '@react/constants/app';
import { formatDate, formatDateTime } from '@react/constants/moment';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { Dropdown, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { MenuProps } from 'antd/lib';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useExportMutation } from 'apps/Internal/src/hooks/useExportMutation';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCancel } from '../hooks/useCancel';
import { useGetAttachment } from '../hooks/useGetAttachmentFile';
import { useList } from '../hooks/useList';
import {
  ISimReplacementItem,
  ProcessStatus,
  ProcessStatusEnum,
  SimTypeEnum,
} from '../types';
import Header from './Header';
import ModalImage from './ModalImage';
import ModalPdf from './ModalPdf';
import SendEmailModal from './SendEmailModal';

const ListBody = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const actionByRole = useRolesByRouter();
  const navigate = useNavigate();
  const [isOpenSendEmail, setIsOpenSendEmail] = useState(false);
  const [emailDefault, setEmailDefault] = useState('');
  const { data: simReplacementItems, isFetching } = useList(
    queryParams(params)
  );
  const { COMBINE_KIT_SIM_TYPE = [] } = useGetDataFromQueryKey<ParamsOption>([
    REACT_QUERY_KEYS.GET_PARAMS,
  ]);
  const { CHANGE_SIM_BULK_PROCESS_STATUS = [] } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  const [attachmentSrc, setAttachmentSrc] = useState('');
  const { mutate: downloadFile } = useExportMutation();
  const { mutate: getAttachmentFile, data: fileSrc } = useGetAttachment();
  const { mutate: cancelChangeSim } = useCancel();
  const [isOpenImage, setIsOpenImage] = useState(false);
  const [isOpenPdf, setIsOpenPdf] = useState(false);
  const [recordId, setRecordId] = useState<number>();
  const getDownloadUrl = (id: number, fileType: string) => {
    return `${prefixCustomerService}/change-sim-bulk/download-file?fileType=${fileType}&id=${id}`;
  };
  const handleCancel = (id: number) => {
    ModalConfirm({
      message: 'Bạn có chắc muốn dừng đổi SIM không?',
      handleConfirm() {
        cancelChangeSim(id);
      },
    });
  };
  const handleClickSendEmail = (id: number, email: string) => {
    setEmailDefault(email);
    setIsOpenSendEmail(true);
    setRecordId(id);
  };
  const renderMenuItemsMore = (
    record: ISimReplacementItem
  ): MenuProps['items'] => {
    return [
      ...(record.processStatus === ProcessStatusEnum.PROCESSING
        ? [
            {
              key: ActionsTypeEnum.CANCEL,
              label: <Text onClick={() => handleCancel(record.id)}>Hủy</Text>,
            },
          ]
        : []),
      ...(record.simType === SimTypeEnum.ESIM && record.succeededNumber > 0
        ? [
            {
              key: ActionsTypeEnum.SEND_MAIL,
              label: (
                <Text
                  onClick={() => handleClickSendEmail(record.id, record.email)}
                >
                  Gửi lại email
                </Text>
              ),
            },
          ]
        : []),
    ].filter((item: { key: ActionsTypeEnum; label: JSX.Element }) =>
      includes(actionByRole, item?.key)
    );
  };
  const handleDownloadResult = (record: ISimReplacementItem) => {
    const index = record.filename.lastIndexOf('.');
    const fileName =
      index > 0 ? record.filename.substring(0, index) : record.filename;
    downloadFile({
      uri: getDownloadUrl(record.id, 'RESULT'),
      filename: `${fileName}-${dayjs().format('DDMMYYYYHHmmss')}.xlsx`,
    });
  };
  const handleViewAttachment = (record: ISimReplacementItem) => {
    const type = record.fileAttachmentName.endsWith('.pdf') ? 'PDF' : 'IMAGE';
    getAttachmentFile({
      url: getDownloadUrl(record.id, 'ATTACHMENT'),
      type,
    });
    type === 'PDF' ? setIsOpenPdf(true) : setIsOpenImage(true);
  };
  useEffect(() => {
    if (fileSrc) {
      setAttachmentSrc(fileSrc);
    }
  }, [fileSrc]);
  const columns: ColumnsType<ISimReplacementItem> = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render(_, __, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },
    {
      title: 'Tên file',
      dataIndex: 'filename',
      width: 180,
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
      title: 'Loại mặt hàng',
      dataIndex: 'simType',
      width: 130,
      align: 'left',
      render(value) {
        const itemType = COMBINE_KIT_SIM_TYPE?.find(
          (item) => item.value === value
        )?.label;
        return (
          <Tooltip title={itemType} placement="topLeft">
            <Text>{itemType}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'User đổi SIM',
      dataIndex: 'createdBy',
      width: 180,
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
      title: 'Trạng thái xử lý',
      dataIndex: 'processStatus',
      width: 130,
      align: 'left',
      render(value) {
        const renderedValue = CHANGE_SIM_BULK_PROCESS_STATUS.find(
          (item) => item.value == value
        )?.label;
        return (
          <Tooltip title={renderedValue} placement="topLeft">
            <CTag color={ProcessStatus[value as keyof typeof ProcessStatus]}>
              {renderedValue}
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thời gian thực hiện đổi SIM',
      dataIndex: 'processDate',
      width: 200,
      align: 'left',
      render(value) {
        return (
          <Tooltip
            title={value && dayjs(value).format(formatDateTime)}
            placement="topLeft"
          >
            <Text>{value && dayjs(value).format(formatDate)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'NPP yêu cầu',
      dataIndex: 'partnerName',
      width: 140,
      align: 'left',
      render(value, record) {
        const text = record.clientId ? '' : value;
        return (
          <Tooltip title={text} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'NPP thực hiện đổi SIM',
      dataIndex: 'partnerCode',
      width: 200,
      align: 'left',
      render(_, record) {
        const text = record.clientId ? record.partnerName : '';
        return (
          <Tooltip title={text} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'File đính kèm',
      dataIndex: 'fileAttachmentName',
      width: 180,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Typography.Link onClick={() => handleViewAttachment(record)}>
              {value}
            </Typography.Link>
          </Tooltip>
        );
      },
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: 180,
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
      title: 'Kết quả',
      width: 180,
      align: 'left',
      render(_, record) {
        const renderedValue = `Số lượng thành công: ${
          record.succeededNumber
        }\nSố lượng thất bại: ${record.failedNumber}\nFile kết quả: ${
          record.fileResultUrl ? record.fileResultUrl : ''
        }`;
        return (
          <Tooltip title={renderedValue} placement="topLeft">
            <Text>{`Số lượng thành công: ${record.succeededNumber}`}</Text>
            <Text>{`Số lượng thất bại: ${record.failedNumber}`}</Text>
            <Text>
              File kết quả:{' '}
              {record.fileResultUrl ? (
                <Typography.Link onClick={() => handleDownloadResult(record)}>
                  File
                </Typography.Link>
              ) : (
                ''
              )}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 180,
      align: 'left',
      render(value, record) {
        const renderedValue =
          record.simType === SimTypeEnum.ESIM ? value : null;
        return (
          <Tooltip title={renderedValue} placement="topLeft">
            <Text>{renderedValue}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 150,
      fixed: 'right',
      render(_, record) {
        return (
          <WrapperActionTable>
            {includes(actionByRole, ActionsTypeEnum.READ) && (
              <CButtonDetail
                onClick={() =>
                  navigate(pathRoutes.simReplacementDetail(record.id + ''))
                }
              />
            )}
            <div className="w-5">
              {(includes(actionByRole, ActionsTypeEnum.CANCEL) ||
                includes(actionByRole, ActionsTypeEnum.SEND_MAIL)) && (
                <Dropdown
                  menu={{ items: renderMenuItemsMore(record) }}
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
  const intl = useIntl();
  return (
    <>
      <Header />
      <CTable
        columns={columns}
        loading={isFetching}
        dataSource={simReplacementItems?.content || []}
        pagination={{
          current: params.page + 1,
          pageSize: params.size,
          total: simReplacementItems?.totalElements || 0,
          showQuickJumper: true,
          showTotal: TotalTableMessage,
          locale: {
            jump_to: intl.formatMessage({ id: 'common.jump_to' }),
            page: '',
          },
        }}
      />
      <SendEmailModal
        isOpen={isOpenSendEmail}
        setIsOpen={setIsOpenSendEmail}
        recordId={recordId}
        emailDefault={emailDefault}
      />
      <ModalImage
        src={attachmentSrc}
        isOpen={isOpenImage}
        setIsOpen={setIsOpenImage}
      />
      <ModalPdf
        src={attachmentSrc}
        isOpen={isOpenPdf}
        setIsOpen={setIsOpenPdf}
      />
    </>
  );
};
export default ListBody;
