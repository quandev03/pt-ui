import {
  AnyElement,
  CButton,
  MESSAGE,
  UploadFileMax,
} from '@vissoft-react/common';
import { Form, Spin } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { RcFile } from 'antd/es/upload';
import imageCompression from 'browser-image-compression';
import { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import useCamera from '../../../../src/assets/images/userCamera.png';
import { useCheckFace } from '../hooks';
import { useCameraStatus } from '../hooks/useCameraStatus';
import { StyledUpload } from '../pages/styled';
import { useUpdateSubscriberInfoStore } from '../store';
import { StepEnum } from '../type';
import { base64ToFile } from '../utils';
import ViewImages from './ViewImages';
import { blobToFile } from '../../../../src/services';

const VerifyFace = () => {
  const form = useFormInstance();
  const webcamRef = useRef<Webcam>(null);
  const { hasCamera, blockCamera } = useCameraStatus();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [progressLoading, setProgressLoading] = useState<boolean>(false);
  const { setStep, ocrResponse } = useUpdateSubscriberInfoStore();
  const ImageFileType = ['image/png', 'image/jpeg', 'image/jpg'];
  const [errMessage, setErrMessage] = useState<string | undefined>();
  const { mutate: checkFace, isPending: loadingCheckFace } = useCheckFace(
    (data) => {
      if (data.status === 1) setStep(StepEnum.STEP4);
      else {
        setErrMessage(data.message);
      }
    }
  );
  const handleCapture = () => {
    const img = webcamRef.current?.getScreenshot();
    if (img) {
      const unCompressedFile = base64ToFile(img, 'image.jpg');
      handlePressFile(unCompressedFile);
    }
  };
  const handleResetImage = () => {
    setImageSrc(null);
    setErrMessage(undefined);
  };
  const handlePressFile = (unCompressedFile: File) => {
    const options = {
      maxSizeMB: 0.488,
      useWebWorker: true,
      maxWidthOrHeight: 1024,
    };
    const p1 = new Promise(function (resolve) {
      setTimeout(resolve, 10000, unCompressedFile);
    });
    const race = Promise.race([
      p1,
      imageCompression(unCompressedFile, options),
    ]);
    setProgressLoading(true);
    race.then(async (response) => {
      const file: AnyElement = response;
      if (file.size && file.size > UploadFileMax) {
        form.setFields([
          {
            name: 'portrait',
            errors: ['Nén không thành công'],
          },
        ]);
        return;
      }
      const url = await imageCompression.getDataUrlFromFile(file);
      form.setFields([
        {
          name: 'portrait',
          errors: [],
        },
      ]);
      form.setFieldValue('portrait', blobToFile(file, 'portrait.jpg'));
      form.setFieldValue('portraitUrl', url);
      setImageSrc(url);
      setProgressLoading(false);
    });
  };
  const beforeUpload = async (unCompressedFile: RcFile) => {
    if (!ImageFileType.includes(unCompressedFile.type || '')) {
      form.setFields([
        {
          name: 'portrait',
          errors: [MESSAGE.G31],
        },
      ]);
      return;
    }
    handlePressFile(unCompressedFile);
    return false;
  };

  const renderImage = () => {
    if (!hasCamera && !imageSrc) {
      return (
        <div className="w-full border-dotted border-[8px] aspect-[4/4] border-[##D5DDEF] flex justify-center items-center rounded-full">
          <div className="w-[96%] aspect-[4/4] bg-[#F3F3F3] flex justify-center items-center rounded-full">
            <div className="w-1/2">
              <img src={useCamera} alt="user camera icon" />
            </div>
          </div>
        </div>
      );
    } else {
      if (imageSrc) {
        return (
          <div className="mt-1 mb-3 w-full overflow-hidden rounded-full aspect-[4/4]">
            <img
              src={imageSrc}
              alt="ảnh được tải lên"
              className="rounded-full w-full h-full object-cover"
            />
          </div>
        );
      }
      return (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: 'user',
          }}
          className="rounded-full w-full mt-1 mb-3 object-cover aspect-[4/4]"
        />
      );
    }
  };
  const handleCheckFace = () => {
    const transactionId = ocrResponse?.transactionId || '';
    const portrait = form.getFieldValue('portrait');
    checkFace({ portrait: portrait, transactionId: transactionId });
  };
  const renderedGuideMessage = () => {
    if (errMessage)
      return (
        <p className="text-center text-[#E92429] mb-7 mt-4 font-medium">
          {errMessage}
        </p>
      );
    if (blockCamera) {
      return (
        <p className={`text-center ${imageSrc ? 'mb-6' : 'mb-3'} mt-4`}>
          Bạn đã chặn quyền camera. Vui lòng bật lại trong cài đặt trình duyệt.
        </p>
      );
    }
    return (
      <p className={`text-center mb-6 mt-4`}>
        {imageSrc
          ? 'Kiểm tra hình ảnh và nhấn '
          : 'Vui lòng điều chỉnh sao cho khuôn mặt của bạn nằm trong vòng tròn'}
        <span className="text-[#1062AD]">{imageSrc ? 'Xác nhận' : ''}</span>
      </p>
    );
  };
  return (
    <div className="flex items-center flex-col justify-between min-h-[72vh] gap-5">
      <div className="flex items-center flex-col  w-full">
        <p className="text-lg font-semibold mt-2">Xác thực khuôn mặt</p>
        {renderedGuideMessage()}
        {errMessage ? (
          <ViewImages />
        ) : (
          <div className="w-4/5">
            <Form.Item name="image">
              <Spin spinning={progressLoading}>{renderImage()}</Spin>
            </Form.Item>
            <Form.Item hidden name="portraitUrl"></Form.Item>
          </div>
        )}
      </div>
      {errMessage ? (
        <div className="w-full">
          <CButton
            className="rounded-full w-full py-6 mb-4 flex-1"
            onClick={handleResetImage}
            type="primary"
          >
            Chụp lại
          </CButton>
        </div>
      ) : imageSrc ? (
        <div className="flex justify-between gap-5 w-full">
          <CButton
            className="rounded-full w-full py-6 mb-4 flex-1"
            onClick={handleResetImage}
            type="default"
          >
            Quay lại
          </CButton>
          <CButton
            className="rounded-full w-full py-6 flex-1"
            onClick={handleCheckFace}
            loading={loadingCheckFace}
          >
            Kiểm tra
          </CButton>
        </div>
      ) : (
        <div className="flex justify-between gap-5 w-full">
          <div className="flex-1">
            <CButton
              className="rounded-full w-full py-6 mb-4"
              onClick={handleCapture}
              disabled={!hasCamera}
            >
              Chụp ảnh
            </CButton>
          </div>
          <div className="flex-1">
            <StyledUpload
              accept={ImageFileType.join(',')}
              showUploadList={false}
              multiple={false}
              beforeUpload={beforeUpload}
            >
              <CButton className="rounded-full w-full py-6">Upload ảnh</CButton>
            </StyledUpload>
          </div>
        </div>
      )}
    </div>
  );
};
export default VerifyFace;
