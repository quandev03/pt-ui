import {
  Button,
  NotificationError,
  NotificationSuccess,
} from '@react/commons/index';
import { Form, Typography } from 'antd';
import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useDetailContract } from '../hooks/useDetailContract';
import { BackgroundsLayers, ElementsSign, Layers } from './styles';
import { useSubmitContract } from '../hooks/useSubmitContract';
import { useLocation } from 'react-router-dom';
import { useDownloadFilePdfMutation } from '../hooks/useDownloadFilePdfMutation';
import { AnyElement } from '@react/commons/types';

export function base64ImageToBlob(str: string) {
  // extract content type and base64 payload from original string
  const pos = str.indexOf(';base64,');
  const type = str.substring(5, pos);
  const b64 = str.substr(pos + 8);

  // decode base64
  const imageContent = atob(b64);

  // create an ArrayBuffer and a view (as unsigned 8-bit)
  const buffer = new ArrayBuffer(imageContent.length);
  const view = new Uint8Array(buffer);

  // fill the view, using the decoded base64
  for (let n = 0; n < imageContent.length; n++) {
    view[n] = imageContent.charCodeAt(n);
  }

  // convert ArrayBuffer to Blob
  const blob = new Blob([buffer], { type: type });

  return blob;
}

const SignPdf: React.FC<any> = ({ isND13 = false }) => {
  const [form] = Form.useForm();
  const [signPng, setSignPng] = useState('');
  const sigRef = useRef(null);
  const location = useLocation();
  const id = new URLSearchParams(location.search)?.get('id');
  const type = new URLSearchParams(location.search)?.get('type');
  const { mutate: mutateDownloadFilePdf } = useDownloadFilePdfMutation();
  const [disableSubmit, setDisableSubmit] = useState(false);
  const { data: dataDetail } = useDetailContract({
    id,
    isSigned: true,
    isND13,
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
    const base64str = signPng.substr(22);
    const decoded = atob(base64str);
    if (decoded.length < 1000) {
      return NotificationError('Chữ ký ngắn hoặc quá nhỏ');
    }

    mutateSubmit(
      {
        contractNo: id,
        signature: base64ImageToBlob(signPng),
      },
      {
        onSuccess: () => {
          NotificationSuccess('Ký thành công');
          setDisableSubmit(true);
        },
      }
    );
  };
  return (
    !!id &&
    dataDetail && (
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div>
          <Layers>
            <BackgroundsLayers>
              <img src={URL.createObjectURL(dataDetail)} alt="Card" />
            </BackgroundsLayers>

            <ElementsSign type={Number(type)}>
              {signPng.length > 0 && <img src={signPng} alt="Signature" />}
            </ElementsSign>
          </Layers>
        </div>
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
                mutateDownloadFilePdf({
                  uri: `/contract-decree/view-before/${id}`,
                  filename: 'Bien_ban_xac_nhan_ND13',
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
    )
  );
};

export default SignPdf;
