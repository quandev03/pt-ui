import {
  Button,
  NotificationError,
  NotificationSuccess,
} from '@react/commons/index';
import { AnyElement } from '@react/commons/types';
import { Flex, Form, Spin, Typography } from 'antd';
import { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { useDownloadFilePdfMutation } from '../../ActivateSubscription/hooks/useDownloadFilePdfMutation';
import { base64ImageToBlob } from '../../ActivateSubscription/pages/SignPdf';
import {
  BackgroundsLayers,
  Layers,
} from '../../ActivateSubscription/pages/styles';
import {
  ContractTypeEnum,
  useDetailPublicContract,
  useMutateDetailContract,
} from '../hooks/useDetailContract';
import { useSubmitContract } from '../hooks/useSubmitContract';
import { ElementsSign } from './styles';

const Document = ({ title, file, signPng, code }: any) => {
  if (!file) return;
  const location = useLocation();
  const type = new URLSearchParams(location.search)?.get('type');
  const customerType = new URLSearchParams(location.search)?.get(
    'customerType'
  );
  if (['XAC_NHAN', 'CAM_KET'].includes(code) && customerType === 'old') return;
  return (
    <Layers>
      {customerType !== 'old' && (
        <div className="text-lg mx-auto w-fit text-[#1482e9] mt-1">{title}</div>
      )}
      <BackgroundsLayers>
        <img src={URL.createObjectURL(file)} alt={code.toLowerCase()} />
      </BackgroundsLayers>
      <ElementsSign type={Number(type)} code={code} customerType={customerType}>
        {signPng.length > 0 && <img src={signPng} alt="Signature" />}
      </ElementsSign>
    </Layers>
  );
};

const SignPdf: React.FC<any> = ({ isND13 = false }) => {
  const [form] = Form.useForm();
  const [signPng, setSignPng] = useState('');
  const sigRef = useRef(null);
  const location = useLocation();
  const id = new URLSearchParams(location.search)?.get('id');
  const customerType = new URLSearchParams(location.search)?.get(
    'customerType'
  );
  const prefixParams = { id, isSign: false, isND13 };
  const { mutate: mutateDownloadFilePdf } = useDownloadFilePdfMutation();
  const [disableSubmit, setDisableSubmit] = useState(false);
  const { mutate: mutateDetailContract, isPending: isLoadingND13 } =
    useMutateDetailContract();
  const { data: xacNhanImg, isFetching: isLoadingXacNhan } =
    useDetailPublicContract({
      ...prefixParams,
      typeContract: ContractTypeEnum.XAC_NHAN,
      id: customerType === 'new' ? id : null,
    });
  const { data: yeuCauImg, isFetching: isLoadingYeuCau } =
    useDetailPublicContract({
      ...prefixParams,
      typeContract: ContractTypeEnum.YEU_CAU,
    });
  const { data: camKetImg, isFetching: isLoadingCamKet } =
    useDetailPublicContract({
      ...prefixParams,
      typeContract: ContractTypeEnum.CAM_KET,
      id: customerType === 'new' ? id : null,
    });
  const { mutate: mutateSubmit, isPending: isLoadingSubmit } =
    useSubmitContract();

  const handleFinish = () => {
    if (disableSubmit) return;
    const sigURL = (sigRef.current as any).getTrimmedCanvas().toDataURL();
    setSignPng(sigURL);
  };
  const handleSubmit = (values: AnyElement) => {
    if (!id) return;
    if (!signPng) {
      return NotificationError(
        'Thông tin chữ ký của khách hàng không được để trống'
      );
    }
    let base64str = signPng.substr(22);
    let decoded = atob(base64str);
    if (decoded.length < 1000) {
      return NotificationError('Chữ ký ngắn hoặc quá nhỏ');
    }

    mutateSubmit(
      {
        contractId: id,
        file: base64ImageToBlob(signPng),
        customerType,
      },
      {
        onSuccess: () => {
          NotificationSuccess('Ký thành công'), setDisableSubmit(true);
        },
      }
    );
  };
  if (
    !id ||
    (customerType === 'old' && !yeuCauImg) ||
    (customerType !== 'old' && (!xacNhanImg || !yeuCauImg || !camKetImg))
  )
    return;
  return (
    <Spin
      spinning={
        isLoadingXacNhan || isLoadingYeuCau || isLoadingCamKet || isLoadingND13
      }
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Flex vertical gap={0}>
          <Document
            title="Biên bản xác nhận"
            file={xacNhanImg}
            signPng={signPng}
            code={'XAC_NHAN'}
          />
          <Document
            title="Phiếu yêu cầu chuyển chủ quyền"
            file={yeuCauImg}
            signPng={signPng}
            code={'YEU_CAU'}
          />
          <Document
            title="Bản cam kết chính chủ"
            file={camKetImg}
            signPng={signPng}
            code={'CAM_KET'}
          />
        </Flex>
        <div className="sticky z-10 bg-gray-200 bottom-0">
          <div className="flex flex-col justify-center mx-auto w-[400px] gap-2 py-4 relative">
            <div
              className="w-fit"
              onClick={() =>
                mutateDownloadFilePdf({
                  uri: '/file/template/noi_dung_chi_tiet_nd13.pdf',
                  filename: 'chinh_sach_VBCT',
                })
              }
            >
              <Typography.Link underline target="_blank">
                Biểu mẫu chính sách/VBCT Nghị định 13
              </Typography.Link>
            </div>
            <div
              className="w-fit"
              onClick={() =>
                mutateDetailContract({
                  ...prefixParams,
                  typeContract: ContractTypeEnum.ND13,
                  fileName: 'Bien_ban_xac_nhan_ND13',
                })
              }
            >
              <Typography.Link underline target="_blank">
                Biên bản xác nhận NĐ13
              </Typography.Link>
            </div>
            <div className="bg-white border-current rounded-lg relative	mb-1">
              {signPng.length === 0 && (
                <div className="absolute top-20 left-20 text-slate-500 cursor-default">
                  Thực hiện ký ở đây
                </div>
              )}
              <SignatureCanvas
                velocityFilterWeight={1}
                ref={sigRef}
                onEnd={() => handleFinish()}
                canvasProps={{
                  height: 200,
                  width: 400,
                  className: 'sigCanvas',
                }}
              />
            </div>

            <div className="flex gap-2 justify-center">
              <Button
                className="w-40"
                type="default"
                disabled={!signPng || disableSubmit}
                onClick={() => {
                  (sigRef.current as any).clear();
                  setSignPng('');
                }}
              >
                Xoá
              </Button>
              <Button
                htmlType="submit"
                className="w-40"
                disabled={!signPng || disableSubmit}
                loading={isLoadingSubmit}
              >
                Xác nhận ký
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </Spin>
  );
};

export default SignPdf;
