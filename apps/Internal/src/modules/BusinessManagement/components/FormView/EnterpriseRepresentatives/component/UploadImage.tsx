import { faCamera, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NotificationError } from '@react/commons/index';
import { ImageFileType } from '@react/constants/app';
import { MESSAGE } from '@react/utils/message';
import { Button, Flex, Form, Spin, Typography, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { useGetImage } from 'apps/Internal/src/components/layouts/queryHooks';
import imageCompression from 'browser-image-compression';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import ModalImage from '../../../ModalImage';

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
  imageUrl?: string;
}

const UploadImage: React.FC<CUploadProps> = ({
  name,
  isEditing = true,
  label,
  imageUrl,
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
  const setImageHeight = () => {
    document.querySelectorAll('.image-frame').forEach((box: any) => {
      const width = box?.clientWidth;
      box.style.height = `${(width * 3) / 4}px`;
    });
  };

  useEffect(() => {
    if (cardFront && cardBack && portrait) {
      if (name === 'cardFront') setIsDisabled(false);
      if (name === 'cardBack') setIsDisabled(true);
      if (name === 'portrait') setIsDisabled(true);
    } else {
      if (['cardBack'].includes(name)) setIsDisabled(!cardFront);
      if (name === 'cardFront') setIsDisabled(!!cardBack);
      if (name === 'portrait') setIsDisabled(!cardFront || !cardBack);
      if (!(cardFront || cardBack || portrait || cardContract)) setImage('');
    }
  }, [cardFront, cardBack, portrait]);

  const { data: imageBlobUrl, isLoading } = useGetImage(imageUrl || '');
  useEffect(() => {
    setImageHeight();
  }, [imageBlobUrl, image]);

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
    return () => {
      if (imageBlobUrl) {
        URL.revokeObjectURL(imageBlobUrl as string);
      }
    };
  }, [imageBlobUrl]);
  useEffect(() => {
    if (cardFront && !cardBack) {
      form.setFieldsValue({
        idType: undefined,
        name: undefined,
        idNo: undefined,
        idIssuePlace: undefined,
        idIssueDate: undefined,
        birthday: undefined,
        sex: undefined,
        address: undefined,
        province: undefined,
        district: undefined,
        precinct: undefined,
        nationality: undefined,
        idExpiry: undefined,
        idEkyc: undefined,
      });
      if (name === 'cardBack' || name === 'portrait') {
        setImage('');
      }
    }
  }, [cardFront, cardBack]);

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
      // if (file.size && file.size > UploadFileMax) {
      //   form.setFields([
      //     {
      //       name: name,
      //       errors: ['Nén không thành công'],
      //     },
      //   ]);
      //   setProgressLoading(false);
      //   return;
      // }
      const url = await imageCompression.getDataUrlFromFile(file);
      form.setFieldValue(name, file);
      form.validateFields([name]);
      setImage(url);
      if (name === 'cardFront') {
        form.setFieldValue('cardBack', undefined);
        form.setFieldValue('portrait', undefined);
      }
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
        e.preventDefault();
        setIsEnabledCam(!isEnabledCam);
        const src = (webcamRef.current as any)?.getScreenshot();
        form.setFieldValue(name, src);
        form.validateFields([name]);
        setImage(src);
      })
      .catch((err) => {
        NotificationError(MESSAGE.G38);
      });
  };

  const handlePreview = () => {
    setIsOpen(true);
  };
  const renderImage = () => {
    if (image) {
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
      return (
        <img
          title={'Cập nhật ảnh'}
          alt="avatar"
          src={(imageBlobUrl as string) || image}
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
          required: isEditing,
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
              disabled={isDisabled}
            />
          )}
        </Upload>
        {isEditing && (
          <Button
            type="dashed"
            icon={<FontAwesomeIcon icon={faCamera} size="lg" />}
            onClick={(e) => captureCam(e)}
            title={!isEnabledCam ? 'Bật cam' : 'Chụp ảnh'}
            disabled={isDisabled}
          />
        )}
      </Flex>
      {!!errorText && (
        <Typography.Text type="danger">{errorText}</Typography.Text>
      )}

      <ModalImage
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        src={(imageBlobUrl as string) || image}
      />
    </Form.Item>
  );
};

export default React.memo(UploadImage);
