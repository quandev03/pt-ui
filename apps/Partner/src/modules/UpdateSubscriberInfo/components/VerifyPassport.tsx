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
import captureNote1 from '../../../../src/assets/images/captureImageNote1.png';
import captureNote2 from '../../../../src/assets/images/captureImageNote2.png';
import captureNote3 from '../../../../src/assets/images/captureImageNote3.png';
import useCamera from '../../../../src/assets/images/userCamera.png';
import { useCheckOcr } from '../hooks';
import { useCameraStatus } from '../hooks/useCameraStatus';
import { StyledUpload } from '../pages/styled';
import { useUpdateSubscriberInfoStore } from '../store';
import { StepEnum } from '../type';
import { base64ToFile } from '../utils';
import CaptureNote from './CaptureNote';

const VerifyPassport = () => {
  const form = useFormInstance();
  const webcamRef = useRef<Webcam>(null);
  const { hasCamera } = useCameraStatus();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [progressLoading, setProgressLoading] = useState<boolean>(false);
  const { setStep, setOcrResponse, ocrResponse } =
    useUpdateSubscriberInfoStore();
  const ImageFileType = ['image/png', 'image/jpeg', 'image/jpg'];
  const { mutate: checkOcrPassport, isPending: loadingCheckOcr } = useCheckOcr(
    (data) => {
      if (data.status === 1) setStep(StepEnum.STEP3);
      setOcrResponse(data);
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
    setOcrResponse(undefined);
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
            name: 'passport',
            errors: ['Nén không thành công'],
          },
        ]);
        return;
      }
      const url = await imageCompression.getDataUrlFromFile(file);
      form.setFields([
        {
          name: 'passport',
          errors: [],
        },
      ]);
      form.setFieldValue('passport', file);
      form.setFieldValue('passportUrl', url);
      setImageSrc(url);
      setProgressLoading(false);
    });
  };
  const beforeUpload = async (unCompressedFile: RcFile) => {
    if (!ImageFileType.includes(unCompressedFile.type || '')) {
      form.setFields([
        {
          name: 'passport',
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
        <div className="w-full  bg-[#F3F3F3] flex justify-center items-center rounded-2xl py-5 aspect-[4/3]">
          <div className="w-1/2">
            <img src={useCamera} alt="user camera icon" />
          </div>
        </div>
      );
    } else {
      if (imageSrc) {
        return (
          <div className="mt-1 mb-3 w-full overflow-hidden rounded-2xl aspect-[4/3]">
            <img
              src={imageSrc}
              alt="ảnh được tải lên"
              className="rounded-2xl w-full h-full object-cover"
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
          className="rounded-2xl w-full mt-1 mb-3 object-cover aspect-[4/3]"
        />
      );
    }
  };
  const handleCheckPassport = () => {
    const serial = form.getFieldValue('serial');
    const passport = form.getFieldValue('passport');
    checkOcrPassport({ serial: serial, passport: passport });
  };
  return (
    <div className="flex items-center flex-col justify-between min-h-[72vh] gap-5">
      <div className="flex items-center flex-col w-full">
        <p className="text-lg font-semibold mt-2">Xác thực hộ chiếu</p>
        {ocrResponse && ocrResponse.status === 0 ? (
          <p className="text-center text-[#E92429] mb-7 mt-4 font-medium">
            {ocrResponse.message}
          </p>
        ) : (
          <p className={`text-center ${imageSrc ? 'mb-6' : 'mb-3'} mt-4`}>
            {imageSrc
              ? 'Kiểm tra hình ảnh và nhấn '
              : 'Đặt trang thông tin cá nhân của hộ chiếu vào khung bên dưới và nhấn '}
            <span className="text-[#1062AD]">
              {imageSrc ? 'Xác nhận' : 'Chụp ảnh'}
            </span>
          </p>
        )}
        <Form.Item name="passport" className="w-full">
          <Spin spinning={progressLoading}>{renderImage()}</Spin>
        </Form.Item>
        <Form.Item hidden name="passportUrl"></Form.Item>

        {hasCamera && !imageSrc && (
          <div className="flex justify-center gap-3 mt-2">
            <CaptureNote imageUrl={captureNote1} desc="Hiển thị đầy đủ 4 góc" />
            <CaptureNote imageUrl={captureNote2} desc="Hình chụp phải rõ nét" />
            <CaptureNote
              imageUrl={captureNote3}
              desc="Không để lóa bởi ánh sáng"
            />
          </div>
        )}
      </div>
      {imageSrc ? (
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
            onClick={handleCheckPassport}
            loading={loadingCheckOcr}
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
export default VerifyPassport;
