import { Button, NotificationError } from '@react/commons/index';
import { Form } from 'antd';
import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useDetailContract } from '../queryHook/useDetailContract';
import { BackgroundsLayers, ElementsSign, Layers } from './style';
import { useSubmitContract } from '../queryHook/useSubmitContract';
import { useLocation } from 'react-router-dom';

export function base64ImageToBlob(str: string) {
  // extract content type and base64 payload from original string
  let pos = str.indexOf(';base64,');
  let type = str.substring(5, pos);
  let b64 = str.substr(pos + 8);

  // decode base64
  let imageContent = atob(b64);

  // create an ArrayBuffer and a view (as unsigned 8-bit)
  let buffer = new ArrayBuffer(imageContent.length);
  let view = new Uint8Array(buffer);

  // fill the view, using the decoded base64
  for (let n = 0; n < imageContent.length; n++) {
    view[n] = imageContent.charCodeAt(n);
  }

  // convert ArrayBuffer to Blob
  let blob = new Blob([buffer], { type: type });

  return blob;
}

const SignPdf: React.FC<any> = ({ isNotSigned = true }) => {
  const [form] = Form.useForm();
  const [signPng, setSignPng] = useState('');
  const sigRef = useRef(null);
  const location = useLocation();
  const id = new URLSearchParams(location.search)?.get('id');

  const { data: dataDetail, isFetching: isLoadingDetail } = useDetailContract(
    id,
    isNotSigned
  );
  const { mutate: mutateSubmit, isPending: isLoadingSubmit } =
    useSubmitContract();

  const handleFinish = () => {
    const sigURL = (sigRef.current as any).toDataURL();
    setSignPng(sigURL);
  };
  const handleSubmit = () => {
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
    const fileImage = new File([signPng], 'File image', { type: 'image/png' });

    mutateSubmit({
      contractNo: id,
      signature: base64ImageToBlob(signPng),
    });
  };
  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <div className="h-[1428px] w-[528px]">
        {dataDetail && (
          <Layers>
            <BackgroundsLayers>
              <img src={URL.createObjectURL(dataDetail)} alt="Card" />
            </BackgroundsLayers>

            <ElementsSign>
              {signPng.length > 0 && <img src={signPng} alt="Signature" />}
            </ElementsSign>
          </Layers>
        )}
      </div>
      <div className="flex flex-col justify-center m-auto w-[30rem] gap-2 my-4 bg-white relative z-10">
        <div className="border-2 border-current rounded-lg 	mb-1">
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
        <div className="flex gap-2">
          <Button
            className="w-1/2"
            type="default"
            onClick={() => {
              (sigRef.current as any).clear();
              setSignPng('');
            }}
          >
            Xoá
          </Button>
          <Button
            htmlType="submit"
            className="w-1/2"
            onClick={handleSubmit}
            loading={isLoadingSubmit}
          >
            Xác nhận ký
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default SignPdf;
