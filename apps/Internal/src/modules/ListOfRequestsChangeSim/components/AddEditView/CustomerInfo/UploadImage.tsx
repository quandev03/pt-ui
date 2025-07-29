import { Flex, Form, Spin, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { faCamera, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, NotificationError } from '@react/commons/index';
import { MESSAGE } from '@react/utils/message';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import ModalImage from 'apps/Internal/src/modules/ActivateSubscription/components/ModalImage';
import { ImageFileType } from '@react/constants/app';
import ModalPdf from 'apps/Internal/src/modules/ActivateSubscription/components/ModalPdf';
import ImageHd from 'apps/Internal/src/modules/ActivateSubscription/components/hd3.png';
import imageCompression from 'browser-image-compression';
import useStoreListOfRequestsChangeSim from '../../../store';

interface CUploadProps {
  name: string;
  label: string;
}

export const CUpload: React.FC<CUploadProps> = ({ name, label }) => {
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
  const idEkyc = Form.useWatch('idEkyc', form);

  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const { isDisabledContract, isSignSuccess, checkSubInfoSuccess } =
    useStoreListOfRequestsChangeSim();
  const [isOpenPdf, setIsOpenPdf] = useState<boolean>(false);

  useEffect(() => {
    if (['cardBack'].includes(name)) setIsDisabled(!cardFront);
    if (name === 'cardFront') setIsDisabled(!!cardBack || !checkSubInfoSuccess);
    if (name === 'portrait') setIsDisabled(!cardFront || !cardBack);
    if (!(cardFront || cardBack || portrait || cardContract)) setImage('');
  }, [cardFront, cardBack, portrait, checkSubInfoSuccess]);

  useEffect(() => {
    if (!cardContract && name === 'cardContract') {
      setImage('');
    }
  }, [cardContract]);

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
    if (name === 'cardContract' && isSignSuccess) {
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
            name !== 'cardContract' || (!isDisabledContract && !isSignSuccess),
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
            {name === 'cardContract' && isSignSuccess && (
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
          <Button
            type="dashed"
            icon={<FontAwesomeIcon icon={faUpload} size="lg" />}
            title="Tải ảnh lên"
            disabled={
              name !== 'cardContract'
                ? isDisabled || idEkyc
                : isDisabledContract
            }
          />
        </Upload>

        <Button
          type="dashed"
          icon={<FontAwesomeIcon icon={faCamera} size="lg" />}
          onClick={(e) => captureCam(e)}
          title={!isEnabledCam ? 'Bật cam' : 'Chụp ảnh'}
          disabled={
            name !== 'cardContract' ? isDisabled || idEkyc : isDisabledContract
          }
        />
      </Flex>

      <ModalImage isOpen={isOpen} setIsOpen={setIsOpen} src={image} />
      {isOpenPdf && (
        <ModalPdf
          isOpen={isOpenPdf}
          setIsOpen={setIsOpenPdf}
          isSigned={false}
          title="Phiếu yêu cầu đổi SIM"
        />
      )}
    </Form.Item>
  );
};

export default CUpload;
