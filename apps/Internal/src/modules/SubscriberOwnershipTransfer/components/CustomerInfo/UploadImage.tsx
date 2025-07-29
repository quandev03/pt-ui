import { faCamera, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, NotificationError } from '@react/commons/index';
import { ImageFileType } from '@react/constants/app';
import { MESSAGE } from '@react/utils/message';
import { useIsMutating } from '@tanstack/react-query';
import { Flex, Form, Spin, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import ModalImage from 'apps/Internal/src/modules/ActivateSubscription/components/ModalImage';
import imageCompression from 'browser-image-compression';
import React, { useEffect, useMemo, useState } from 'react';
import Webcam from 'react-webcam';
import { queryKeyIsdnOwnerShip } from '../../hooks/useCheckIsdnOwnerShip';
import { base64ImageToBlob } from '@react/helpers/utils';

interface CUploadProps {
  name: string;
  label: string;
  disabled?: boolean;
}

export const CUpload: React.FC<CUploadProps> = ({ name, label, disabled }) => {
  const form = Form.useFormInstance();
  const [image, setImage] = useState<string>('');
  const [isEnabledCam, setIsEnabledCam] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [progressLoading, setProgressLoading] = useState<boolean>(false);
  const webcamRef = React.useRef(null);
  const isdn = Form.useWatch('isdn', form);
  const cardFront = Form.useWatch('cardFront', form);
  const cardBack = Form.useWatch('cardBack', form);
  const portrait = Form.useWatch('portrait', form);

  const isLoadingIsdn = !!useIsMutating({
    mutationKey: [queryKeyIsdnOwnerShip],
  });

  const isDisabled = useMemo(() => {
    const isdnErr = form.getFieldError('isdn');
    return !isdn || (isdn && isdnErr.length);
  }, [isdn]);

  useEffect(() => {
    if (cardFront?.includes?.('base64')) {
      // image created by camera
      form.setFieldValue('cardFront', base64ImageToBlob(cardFront));
      return;
    }
    if (cardBack?.includes?.('base64')) {
      form.setFieldValue('cardBack', base64ImageToBlob(cardBack));
      return;
    }
    if (portrait?.includes?.('base64')) {
      form.setFieldValue('portrait', base64ImageToBlob(portrait));
      return;
    }
    if (name === 'cardFront') {
      setImage(cardFront ? URL.createObjectURL(cardFront) : '');
    }
    if (name === 'cardBack') {
      setImage(cardBack ? URL.createObjectURL(cardBack) : '');
    }
    if (name === 'portrait')
      setImage(portrait ? URL.createObjectURL(portrait) : '');
    if (
      ['cardFront', 'cardBack', 'portrait'].includes(name) &&
      !(cardFront || cardBack || portrait)
    )
      setImage('');
  }, [cardFront, cardBack, portrait, isLoadingIsdn]);

  const beforeUpload = async (compressedFile: RcFile) => {
    if (!ImageFileType.includes(compressedFile.type || '')) {
      form.setFields([
        {
          name: name,
          errors: [MESSAGE.G31],
        },
      ]);
      return;
    }
    const options = {
      maxSizeMB: 0.488,
      useWebWorker: true,
      maxWidthOrHeight: 1024,
      onProgress: (progressNumber: number) => setProgress(progressNumber),
    };

    const p1 = new Promise(function (resolve, reject) {
      setTimeout(resolve, 10000, compressedFile);
    });

    const race = Promise.race([p1, imageCompression(compressedFile, options)]);
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
      const fileFormBlob = new File([file], file.name, { type: file.type });
      form.resetFields([name]);
      form.setFieldValue(name, fileFormBlob);
      form.validateFields([name]);
      setImage(url);
      if (name === 'cardFront' && cardFront && cardBack) {
        form.setFieldValue('cardBack', undefined);
      } else if (name === 'cardBack' && cardFront && cardBack) {
        form.setFieldValue('cardFront', undefined);
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

  return (
    <Flex justify="center">
      <Form.Item
        label={label}
        name={name}
        labelCol={{
          prefixCls: 'flex justify-center',
        }}
        wrapperCol={{
          flex: 'auto',
        }}
        layout="vertical"
        className="w-[360px]"
        rules={[
          {
            required: true,
            message: MESSAGE.G06,
          },
        ]}
      >
        <Spin spinning={progress > 0 && progress < 100 && progressLoading}>
          {image ? (
            <img
              title={'Cập nhật ảnh'}
              alt="avatar"
              src={image}
              className="max-w-[360px] ml-auto mr-auto border-2 rounded-2xl -mt-1 mb-3 object-cover aspect-[16/10] cursor-pointer w-full"
              onClick={handlePreview}
            />
          ) : isEnabledCam ? (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: 'user',
              }}
              className="max-w-full ml-auto mr-auto border-2 rounded-2xl -mt-1 mb-3 object-cover	aspect-[16/10]"
            />
          ) : (
            <div className="max-w-[360px] ml-auto mr-auto border-2 flex items-center justify-center rounded-2xl  -mt-1 mb-3 object-cover aspect-[16/10]"></div>
          )}
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
            <Button
              type="dashed"
              icon={<FontAwesomeIcon icon={faUpload} size="lg" />}
              title="Tải ảnh lên"
              disabled={isDisabled}
            />
          </Upload>

          <Button
            type="dashed"
            icon={<FontAwesomeIcon icon={faCamera} size="lg" />}
            onClick={(e) => captureCam(e)}
            title={!isEnabledCam ? 'Bật cam' : 'Chụp ảnh'}
            disabled={isDisabled}
          />
        </Flex>

        <ModalImage isOpen={isOpen} setIsOpen={setIsOpen} src={image} />
      </Form.Item>
    </Flex>
  );
};

export default CUpload;
