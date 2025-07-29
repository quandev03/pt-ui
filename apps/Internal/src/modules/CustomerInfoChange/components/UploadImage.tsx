import { Flex, Form, Spin, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { faCamera, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, NotificationError } from '@react/commons/index';
import { MESSAGE } from '@react/utils/message';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import ModalImage from './ModalImage';
import useActiveSubscriptStore from '../store';
import { ImageFileType } from '@react/constants/app';
import ModalPdf from './ModalPdf';
import ImageHd from './hd3.png';
import imageCompression from 'browser-image-compression';
import { base64ImageToBlob } from '@react/helpers/utils';

interface CUploadProps {
  name: string;
  isEditing?: boolean;
  label: string;
}

export const CUpload: React.FC<CUploadProps> = ({
  name,
  isEditing = true,
  label,
}) => {
  const form = Form.useFormInstance();
  const [image, setImage] = useState<string>('');
  const [isEnabledCam, setIsEnabledCam] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [progressLoading, setProgressLoading] = useState<boolean>(false);
  const webcamRef = React.useRef(null);

  const cardFront = Form.useWatch('cardFront', form);
  const cardBack = Form.useWatch('cardBack', form);
  const portrait = Form.useWatch('portrait', form);
  const cardContract = Form.useWatch('cardContract', form);
  const cardCommit = Form.useWatch('cardCommit', form);
  const phone = Form.useWatch('phone', form);

  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const {
    isDisabledContract,
    isSignSuccess,
    dataActivateInfo,
    isdnSuccess,
    setSuccessIsdn,
    isDisabledCommit,
    isEnableCommit,
    isEnableContract,
  } = useActiveSubscriptStore();
  const [isOpenPdf, setIsOpenPdf] = useState<boolean>(false);

  useEffect(() => {
    if (['cardBack'].includes(name)) setIsDisabled(!cardFront);
    if (name === 'cardFront') setIsDisabled(!!cardBack || !isdnSuccess);
    if (name === 'portrait') setIsDisabled(!cardFront || !cardBack);
    if (!(cardFront || cardBack || portrait || cardContract || cardCommit))
      setImage('');
  }, [cardFront, cardBack, portrait, isdnSuccess]);

  useEffect(() => {
    if (
      (!cardContract && name === 'cardContract') ||
      (!cardCommit && name === 'cardCommit')
    ) {
      setImage('');
    }
  }, [cardContract, cardCommit]);

  useEffect(() => {
    if (!phone) {
      setSuccessIsdn(false);
    }
  }, [phone]);

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
      maxSizeMB: 0.488, // 0.5 sẽ là 512kb không phải 500kb theo như srs. sửa lại thành 0.488 sẽ = 500kb
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
      })
      .catch((err) => {
        NotificationError(MESSAGE.G38);
      });
  };

  const handlePreview = () => {
    if ((name === 'cardContract' || name === 'cardCommit') && isSignSuccess) {
      setIsOpenPdf(true);
      return;
    }
    setIsOpen(true);
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
          required:
            (name !== 'cardContract' ||
              (!isDisabledContract && !isSignSuccess)) &&
            (name !== 'cardCommit' || (!isDisabledCommit && !isSignSuccess)),
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
            className="border-2 rounded-2xl mt-1 mb-3 object-cover aspect-[4/3] cursor-pointer w-full"
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
            className="border-2 rounded-2xl  mt-1 mb-3 object-cover	aspect-[4/3]"
          />
        ) : (
          <div className="border-2 flex items-center justify-center rounded-2xl  mt-1 mb-3 object-cover aspect-[4/3]">
            {(name === 'cardContract' || name === 'cardCommit') &&
              isSignSuccess && (
                <img
                  title="Hợp đồng"
                  alt="avatar"
                  src={ImageHd}
                  className="border-2 rounded-2xl mt-1 mb-3 object-cover aspect-[4/3] cursor-pointer w-full"
                  onClick={handlePreview}
                />
              )}
          </div>
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
          {isEditing && (
            <Button
              type="dashed"
              icon={<FontAwesomeIcon icon={faUpload} size="lg" />}
              title="Tải ảnh lên"
              disabled={
                (name === 'cardContract' && !isEnableContract) ||
                (name === 'cardCommit' && !isEnableCommit) ||
                (name === 'cardContract' && isDisabledContract) ||
                (name === 'cardCommit' && isDisabledCommit) ||
                ((isDisabled || !!dataActivateInfo.id_ekyc) &&
                  name !== 'cardContract' &&
                  name !== 'cardCommit')
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
              (name === 'cardContract' && !isEnableContract) ||
              (name === 'cardCommit' && !isEnableCommit) ||
              (name === 'cardContract' && isDisabledContract) ||
              (name === 'cardCommit' && isDisabledCommit) ||
              ((isDisabled || !!dataActivateInfo.id_ekyc) &&
                name !== 'cardContract' &&
                name !== 'cardCommit')
            }
          />
        )}
      </Flex>

      <ModalImage isOpen={isOpen} setIsOpen={setIsOpen} src={image} />
      {isOpenPdf && (
        <ModalPdf
          isOpen={isOpenPdf}
          setIsOpen={setIsOpenPdf}
          isSigned={isSignSuccess}
          isCommit={name === 'cardContract' ? false : name === 'cardCommit'}
        />
      )}
    </Form.Item>
  );
};

export default CUpload;
