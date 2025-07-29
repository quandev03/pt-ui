import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonClose } from '@react/commons/Button';
import CInput from '@react/commons/Input';
import CModal from '@react/commons/Modal';
import { TextLink } from '@react/commons/Template/style';
import { FILE_TYPE } from '@react/constants/app';
import { getDate } from '@react/utils/datetime';
import { Col, Form, Row, Tooltip } from 'antd';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ModalImage from '../../BusinessManagement/components/ModalImage';
import ModalPdf from '../../BusinessManagement/components/ModalPdf';
import { getBase64 } from '../../BusinessManagement/components/UploadImage';
import { useDetailInfoChangeQuery } from '../hooks/useDetailInfoChangeQuery';
import { useGetFile } from '../hooks/useGetFile';
import useSubscriptionStore from '../store';
import { InfoChangeItem } from '../types';
import InformationChangeForm from './InformationChangeForm';
import InformationChangeImage from './InformationChangeImage';

export interface ModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  type: ModalType;
}

export enum ModalType {
  censor = 1,
  changeInformation = 2,
  ownershipTransfer = 3,
}

const InformationChangeModal: React.FC<ModalProps> = ({
  isOpen,
  setIsOpen,
  type,
}) => {
  const [form] = Form.useForm();
  const nd13Contract = Form.useWatch('nd13Contract', form);
  console.log(nd13Contract);
  const contract = Form.useWatch('contract', form);
  const ownershipCommitment = Form.useWatch('ownershipCommitment', form);
  const fileList = Form.useWatch('fileList', form);
  const statusOTP = Form.useWatch('statusOTP', form);
  const { id } = useParams();
  const { historyId, setHistoryId } = useSubscriptionStore();
  const { isFetching, data } = useDetailInfoChangeQuery(
    id ?? '',
    historyId,
    type
  );
  const { data: statusOTPData } = useGetApplicationConfig('OTP_STATUS');
  const { mutate: getAttachFile } = useGetFile(form);
  const idTimeOut = useRef<NodeJS.Timeout>();

  const [fileSrc, setFileSrc] = useState<string>('');
  const [isOpenImg, setIsOpenImg] = useState(false);
  const [isOpenPdf, setIsOpenPdf] = useState(false);

  const getFileName = (value: string) => {
    return value?.split('/').slice(-1)?.[0];
  };

  const handlePreview = async (value: string) => {
    const file = form.getFieldValue(value) || value;
    getAttachFile(file, {
      async onSuccess(data, variables) {
        const authorizedFileName = variables?.split('/').slice(-1)?.[0];
        const file = new File([data], authorizedFileName, {
          type: data.type,
        });
        if (file.type === FILE_TYPE.pdf) {
          const url = URL.createObjectURL(file);
          setFileSrc(url);
          setIsOpenPdf(true);
        } else if (
          file.type === FILE_TYPE.png ||
          file.type === FILE_TYPE.jpg ||
          file.type === FILE_TYPE.jpeg
        ) {
          const image = await getBase64(file as any);
          setFileSrc(image);
          setIsOpenImg(true);
        } else {
          const url = URL.createObjectURL(file);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.href = url;
          a.download = authorizedFileName;
          a.click();
          URL.revokeObjectURL(a.href);
          a.remove();
        }
      },
    });
  };

  const handleGenError = (data: InfoChangeItem) => {
    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith('status')) {
        const keySlice = key.slice(6);
        const name = keySlice.charAt(0).toLowerCase() + keySlice.slice(1);
        if (value) {
          form.setFields([{ name: ['news', name], errors: [''] }]);
          form.setFields([{ name: `${name}_news`, errors: [''] }]);
        }
      }
    });
  };

  useEffect(() => {
    if (data && isOpen) {
      form.setFieldsValue({
        ...data,
        olds: {
          ...data.olds,
          idIssueDate: getDate(data.olds.idIssueDate),
          birthDate: getDate(data.olds.birthDate),
        },
        news: {
          ...data.news,
          idIssueDate: getDate(data.news.idIssueDate),
          birthDate: getDate(data.news.birthDate),
        },
        province_olds: data.olds.province,
        district_olds: data.olds.district,
        precinct_olds: data.olds.precinct,
        province_news: data.news.province,
        district_news: data.news.district,
        precinct_news: data.news.precinct,
        reasonOTP: data.news.reasonOTP,
        statusOTP: statusOTPData?.find(
          (item) => item.code === data.news.statusOTP
        )?.name,
        nd13Contract: data.news.nd13Contract,
        contract: data.news.contract,
        ownershipCommitment: data.news.ownershipCommitment,
      });
      idTimeOut.current = setTimeout(() => {
        handleGenError(data.news);
      }, 10);
    } else {
      form.resetFields();
    }
    return () => {
      clearTimeout(idTimeOut.current);
    };
  }, [data, isOpen]);

  const handleCancel = () => {
    setIsOpen(false);
    setHistoryId('');
  };

  const renderTitle = () => {
    if (type === ModalType.censor) {
      return 'Xem chi tiết thay đổi thông tin kiểm duyệt';
    }
    if (type === ModalType.ownershipTransfer) {
      return 'Xem chi tiết chuyển chủ quyền';
    }
    if (type === ModalType.changeInformation) {
      return 'Xem chi tiết thay đổi thông tin khách hàng';
    }
  };
  return (
    <CModal
      open={isOpen}
      width={1000}
      title={renderTitle()}
      footer={[<CButtonClose onClick={handleCancel} />]}
      onCancel={handleCancel}
      loading={isFetching}
      destroyOnClose
    >
      <Form form={form} labelCol={{ span: 8 }} colon={false} labelWrap disabled>
        <legend className="!mb-3">Thông tin thuê bao</legend>
        <Row gutter={24} className="mb-5">
          <Col span={12}>
            <Form.Item label="Số thuê bao" name="isdn">
              <CInput />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Serial SIM" name="serial">
              <CInput />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <InformationChangeForm name="olds" />
            <InformationChangeImage
              label="Ảnh GTTT mặt trước"
              src={data?.olds.frontId ?? ''}
              date={data?.olds.timeFrontId}
            />
            <InformationChangeImage
              label="Ảnh GTTT mặt sau"
              src={data?.olds.backId ?? ''}
              date={data?.olds.timeBackId}
            />
            <InformationChangeImage
              label="Ảnh chân dung"
              src={data?.olds.portrait ?? ''}
              date={data?.olds.timePortrait}
            />
            {(type === ModalType.ownershipTransfer ||
              type === ModalType.changeInformation) && (
              // <Form.Item label="Ảnh capture từ video call" name="videoCallCaptureImage">
              //   <CInput />
              // </Form.Item>
              <InformationChangeImage
                label="Ảnh video call"
                src={data?.olds.videoCallCaptureImage ?? ''}
                date={data?.olds.timeVideoCallCaptureImage}
              />
            )}
          </Col>
          <Col span={12}>
            <InformationChangeForm name="news" />
            <InformationChangeImage
              label="Ảnh GTTT mặt trước"
              src={data?.news.frontId ?? ''}
              date={data?.news.timeFrontId}
              status={data?.news.statusFrontId}
            />
            <InformationChangeImage
              label="Ảnh GTTT mặt sau"
              src={data?.news.backId ?? ''}
              date={data?.news.timeBackId}
              status={data?.news.statusBackId}
            />
            <InformationChangeImage
              label="Ảnh chân dung"
              src={data?.news.portrait ?? ''}
              date={data?.news.timePortrait}
              status={data?.news.statusPortrait}
            />
            {(type === ModalType.ownershipTransfer ||
              type === ModalType.changeInformation) && (
              <>
                {statusOTP && (
                  <Form.Item label="Trạng thái xác thực OTP" name="statusOTP">
                    <CInput
                      suffix={
                        form.getFieldValue('reasonOTP') ? (
                          <Tooltip title={form.getFieldValue('reasonOTP')}>
                            <FontAwesomeIcon
                              className="text-red-500 text-lg"
                              icon={faExclamationCircle}
                            />
                          </Tooltip>
                        ) : null
                      }
                    />
                  </Form.Item>
                )}

                <Form.Item label="Nghị định 13" name="nd13Contract">
                  {nd13Contract && (
                    <TextLink onClick={() => handlePreview('nd13Contract')}>
                      {getFileName(nd13Contract)}
                    </TextLink>
                  )}
                </Form.Item>

                <Form.Item label="Biên bản xác nhận" name="contract">
                  {contract && (
                    <TextLink onClick={() => handlePreview('contract')}>
                      {getFileName(contract)}
                    </TextLink>
                  )}
                </Form.Item>

                <Form.Item label="Bản cam kết" name="ownershipCommitment">
                  {ownershipCommitment && (
                    <TextLink
                      onClick={() => handlePreview('ownershipCommitment')}
                    >
                      {getFileName(ownershipCommitment)}
                    </TextLink>
                  )}
                </Form.Item>
              </>
            )}
          </Col>
        </Row>
        {type === ModalType.ownershipTransfer && (
          <>
            <legend className="!mb-3">Thông tin chuyển chủ quyền</legend>
            <Row gutter={24} className="mb-5">
              <Col span={12}>
                <Form.Item label="File căn cứ" name="fileList">
                  {fileList?.map((items: string) => {
                    return (
                      <TextLink onClick={() => handlePreview(items)}>
                        {items?.split('/').slice(-1)}
                      </TextLink>
                    );
                  })}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Phiếu yêu cầu chuyển chủ quyền"
                  name="ownershipTransferContract"
                >
                  <TextLink
                    onClick={() => handlePreview('ownershipTransferContract')}
                  >
                    {getFileName(
                      form.getFieldValue('ownershipTransferContract')
                    )}
                  </TextLink>
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
        <Form.Item label="" name="reasonOTP" hidden />
        <Form.Item label="" name="statusOTP" hidden />
      </Form>
      <ModalImage src={fileSrc} isOpen={isOpenImg} setIsOpen={setIsOpenImg} />
      <ModalPdf
        src={fileSrc}
        isOpen={isOpenPdf}
        setIsOpen={setIsOpenPdf}
        title="File"
      />
    </CModal>
  );
};

export default InformationChangeModal;
