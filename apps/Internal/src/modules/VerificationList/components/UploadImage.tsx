import { faCamera, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NotificationError } from '@react/commons/index';
import { ImageFileType } from '@react/constants/app';
import { MESSAGE } from '@react/utils/message';
import { Button, Flex, Form, Spin, Typography, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { useGetImage } from 'apps/Internal/src/components/layouts/queryHooks';
import imageCompression from 'browser-image-compression';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Webcam from 'react-webcam';
import useCensorshipStore from '../store';
import IframePdf from './Iframe';
import ModalImage from './ModalImage';
import ModalPdf from './ModalPdf';
import { base64ImageToBlob } from '@react/helpers/utils';
import { useDetailContract } from '../hooks/useDetailContract';

export const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
interface CUploadProps {
  name: string;
  isEditing?: boolean;
  label: string;
  imageUrl: string;
  isProfilePicture: boolean;
}

const UploadImage: React.FC<CUploadProps> = ({
  name,
  isEditing,
  label,
  imageUrl,
  isProfilePicture,
}) => {
  const form = Form.useFormInstance();
  const [image, setImage] = useState<string>('');
  const [errorText, setErrorText] = useState<string>('');
  const [isEnabledCam, setIsEnabledCam] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [progressLoading, setProgressLoading] = useState<boolean>(false);
  const webcamRef = React.useRef(null);
  const cardFront = Form.useWatch('cardFront', form);
  const cardBack = Form.useWatch('cardBack', form);
  const portrait = Form.useWatch('portrait', form);
  const cardContract = Form.useWatch('cardContract', form);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const isResetImage = form.getFieldValue('isResetImage');
  const {
    isDisabledContract,
    isSignSuccess,
    dataActivateInfo,
    isChangeImage,
    setIsChangeImage,
    iframeSrc,
    setIframeSrc,
    isOffSign,
    isDisUploadImage,
  } = useCensorshipStore();
  const [isOpenPdf, setIsOpenPdf] = useState<boolean>(false);
  const setImageHeight = () => {
    document.querySelectorAll('.image-frame').forEach((box: any) => {
      const width = box?.clientWidth;
      box.style.height = `${(width * 3) / 3.5}px`;
    });
  };
  useEffect(() => {
    if (['cardBack'].includes(name)) setIsDisabled(!cardFront);
    if (name === 'cardFront') setIsDisabled(!!cardBack);
    if (name === 'portrait') setIsDisabled(!cardFront || !cardBack);
    if (isDisUploadImage) setIsDisabled(false);
    if (!(cardFront || cardBack || portrait || cardContract)) setImage('');
  }, [cardFront, cardBack, portrait, isDisUploadImage]);
  const { data: imageBlobUrl, isLoading } = useGetImage(
    imageUrl,
    isProfilePicture
  );
  const isContractPdf = useMemo(() => {
    if (imageBlobUrl && typeof imageBlobUrl === 'object') {
      return imageBlobUrl.isPdf;
    }
    return false;
  }, [imageBlobUrl]);
  const pdfUrl = useMemo(() => {
    if (imageBlobUrl && typeof imageBlobUrl === 'object') {
      return (imageBlobUrl as any).url;
    }
    return imageBlobUrl;
  }, [imageBlobUrl]);
  useEffect(() => {
    setImageHeight();
  }, [imageBlobUrl, isSignSuccess, image, isContractPdf, isResetImage]);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setTimeout(() => {
        setImageHeight();
      }, 500);
    });
    return () => {
      window.removeEventListener('resize', setImageHeight);
    };
  }, []);

  useEffect(() => {
    if (isContractPdf && imageBlobUrl) {
      setIframeSrc(pdfUrl);
    }
    return () => {
      if (imageBlobUrl) {
        URL.revokeObjectURL(imageBlobUrl as string);
      }
    };
  }, [imageBlobUrl, isContractPdf]);
  console.log(iframeSrc, 'iframeSrc');
  const beforeUpload = async (file: RcFile) => {
    if (!ImageFileType.includes(file.type || '')) {
      setErrorText(`${MESSAGE.G31}`);
      return;
    }
    const options = {
      maxSizeMB: 0.488,
      useWebWorker: true,
      maxWidthOrHeight: 1024,
      onProgress: (progressNumber: number) => setProgress(progressNumber),
    };

    const p1 = new Promise(function (resolve, reject) {
      setTimeout(resolve, 10000, file);
    });

    const race = Promise.race([p1, imageCompression(file, options)]);
    setProgressLoading(true);
    race.then(async (response) => {
      const file: any = response;
      const url = await imageCompression.getDataUrlFromFile(file);
      form.setFieldValue(name, file);
      form.validateFields([name]);
      setImage(url);
      name !== 'cardContract' && setIsChangeImage(true);
      setProgressLoading(false);
    });
    return false;
  };
  const captureCam = (e: any) => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then(() => {
        form.resetFields([name]);
        e.preventDefault();
        setIsEnabledCam(!isEnabledCam);
        const src = (webcamRef.current as any)?.getScreenshot({
          width: 1280,
          height: 960,
        });
        if (src) {
          form.setFieldValue(name, base64ImageToBlob(src));
          form.validateFields([name]);
        }
        setImage(src);
        name !== 'cardContract' && setIsChangeImage(true);
      })
      .catch((err) => {
        NotificationError(MESSAGE.G38);
      });
  };

  const handlePreview = () => {
    if (
      ((name === 'cardContract' && isSignSuccess) ||
        (isContractPdf && name === 'cardContract')) &&
      !isOffSign
    ) {
      setIsOpenPdf(true);
      return;
    }
    setIsOpen(true);
  };
  const { data: newContract } = useDetailContract({
    id: form.getFieldValue('contractId') || '',
    isSigned: isSignSuccess,
    isIframePdf: true,
  });
  useEffect(() => {
    if (isSignSuccess && newContract) {
      debugger;
      const blob = new Blob([newContract], {
        type: 'application/pdf',
      });
      const url = URL.createObjectURL(blob);
      setIframeSrc(url);
      form.setFieldValue('cardContract', blob);
    }
  }, [isSignSuccess, newContract]);

  const renderImage = () => {
    if (
      (isResetImage && !image && name !== 'videoCall') ||
      (isOffSign && !isProfilePicture && !image)
    ) {
      return (
        <div className="border-2 flex items-center justify-center rounded-2xl  mt-1 mb-3 object-cover image-frame"></div>
      );
    } else if (image) {
      return (
        <img
          title={'Cập nhật ảnh'}
          alt="avatar"
          src={image}
          className="border-2 rounded-2xl mt-1 mb-3 object-cover image-frame cursor-pointer w-full"
          onClick={handlePreview}
        />
      );
    } else if (imageBlobUrl) {
      if (
        (isSignSuccess && name === 'cardContract') ||
        (isContractPdf && name === 'cardContract')
      ) {
        return (
          <div
            className="border-2 flex items-center justify-center rounded-2xl  mt-1 mb-3 object-cover image-frame overflow-hidden"
            onClick={handlePreview}
          >
            {iframeSrc && <IframePdf iframeUrl={pdfUrl} />}
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-transparent cursor-pointer" />
          </div>
        );
      }
      return (
        <img
          title={'Cập nhật ảnh'}
          alt="avatar"
          src={imageBlobUrl as string}
          className="border-2 rounded-2xl mt-1 mb-3 object-cover image-frame cursor-pointer w-full"
          onClick={handlePreview}
        />
      );
    } else if (isEnabledCam) {
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          facingMode: 'user',
        }}
        className="border-2 rounded-2xl  mt-1 mb-3 object-cover	image-frame"
      />;
    } else {
      return (
        <div className="border-2 flex items-center justify-center rounded-2xl  mt-1 mb-3 object-cover image-frame"></div>
      );
    }
  };
  const isRequiredImage = useMemo(() => {
    if (name !== 'cardContract') return isChangeImage;
    else if (isOffSign && name === 'cardContract') return true;
    return false;
  }, [name, isOffSign]);
  return (
    <Form.Item
      label={label}
      name={name}
      labelCol={{
        flex: 'auto',
      }}
      wrapperCol={{
        flex: 'auto',
      }}
      layout="vertical"
      className="w-full"
      rules={[
        {
          required: isRequiredImage,
          message: MESSAGE.G06,
        },
      ]}
    >
      <Spin
        spinning={
          (progress > 0 && progress < 100 && progressLoading) || isLoading
        }
      >
        {renderImage()}
      </Spin>
      <Flex justify="center" gap={16}>
        <Upload
          accept={ImageFileType.join(',')}
          showUploadList={false}
          disabled={false}
          beforeUpload={beforeUpload}
          multiple={false}
          maxCount={1}
        >
          {isEditing && (
            <Button
              type="dashed"
              icon={<FontAwesomeIcon icon={faUpload} size="lg" />}
              title="Tải ảnh lên"
              disabled={
                name !== 'cardContract'
                  ? isDisabled || !!dataActivateInfo.id_ekyc
                  : isDisabledContract
              }
            />
          )}
        </Upload>
        {isEditing && (
          <Button
            type="dashed"
            icon={<FontAwesomeIcon icon={faCamera} size="lg" />}
            onClick={(e) => captureCam(e)}
            title={!isEnabledCam ? 'Bật cam' : 'Chụp ảnh'}
            disabled={
              name !== 'cardContract'
                ? isDisabled || !!dataActivateInfo.id_ekyc
                : isDisabledContract
            }
          />
        )}
      </Flex>
      {!!errorText && (
        <Typography.Text type="danger">{errorText}</Typography.Text>
      )}

      <ModalImage
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        src={image || (imageBlobUrl as string)}
        isProfilePicture={isProfilePicture}
      />
      {isOpenPdf && (
        <ModalPdf
          isOpen={isOpenPdf}
          setIsOpen={setIsOpenPdf}
          isSigned={false}
          pdfUrl={isContractPdf ? pdfUrl : undefined}
        />
      )}
    </Form.Item>
  );
};

export default React.memo(UploadImage);
