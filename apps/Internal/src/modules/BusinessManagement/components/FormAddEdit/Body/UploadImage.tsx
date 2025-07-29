import { Flex, Form, Spin, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { faCamera, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, NotificationError } from '@react/commons/index';
import { MESSAGE } from '@react/utils/message';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { ActionType, ImageFileType } from '@react/constants/app';
import imageCompression from 'browser-image-compression';
import { base64ImageToBlob } from '@react/helpers/utils';
import ModalImage from '../../../../ActivateSubscription/components/ModalImage';
import validateForm from '@react/utils/validator';
import { useGetImage } from 'apps/Internal/src/components/layouts/queryHooks';
import useStoreBusinessManagement from '../../../store';

interface CUploadProps {
  name: string;
  label: string;
  urlView?: string;
  typeModal: ActionType;
  changedFieldName?: string;
}

export const CUpload: React.FC<CUploadProps> = ({
  name,
  label,
  urlView,
  typeModal,
  changedFieldName,
}) => {
  const form = Form.useFormInstance();
  const { changedFields } = useStoreBusinessManagement();
  const [image, setImage] = useState<string>('');
  const [count, setCount] = useState<number>(0);
  const [isEnabledCam, setIsEnabledCam] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [progressLoading, setProgressLoading] = useState<boolean>(false);
  const webcamRef = React.useRef(null);
  const { data: imageBlobUrl, isLoading: isLoadingImage } = useGetImage(
    urlView || '',
    false,
    true
  );

  useEffect(() => {
    if (imageBlobUrl) {
      const fileFormBlob = new File([imageBlobUrl], name, {
        type: (imageBlobUrl as any).type,
      });
      form.setFieldValue(name, fileFormBlob);
      form.validateFields([name]);
      setImage(window.URL.createObjectURL(imageBlobUrl as Blob));
    }
  }, [imageBlobUrl]);

  const cardFront = Form.useWatch('cardFront', form);
  const cardBack = Form.useWatch('cardBack', form);
  const portrait = Form.useWatch('portrait', form);
  const idEkyc = Form.useWatch('idEkyc', form);

  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (idEkyc) return;
    if (['cardBack'].includes(name)) setIsDisabled(!cardFront);
    if (name === 'cardFront') setIsDisabled(!!cardBack);
    if (name === 'portrait') setIsDisabled(!cardFront || !cardBack);
    if (!(cardFront || cardBack || portrait)) setImage('');
  }, [cardFront, cardBack, portrait, idEkyc]);

  useEffect(() => {
    if (
      cardFront &&
      name !== 'cardFront' &&
      typeModal !== ActionType.VIEW &&
      typeModal !== ActionType.VIEW_ENTERPRISE_HISTORY &&
      count > 1
    ) {
      setImage('');
    } else {
      setCount(count + 1);
    }
  }, [cardFront]);

  useEffect(() => {
    if (idEkyc) {
      if (name === 'cardFront') {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    }
  }, [idEkyc]);

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
      if (name === 'cardFront') {
        form.resetFields([
          'cardFront',
          'cardBack',
          'portrait',
          'representativeIdType',
          'representativeIdNumber',
          'representativeIdIssueDate',
          'representativeGender',
          'representativeName',
          'representativeIdIssuePlace',
          'representativeBirthDate',
          'representativePermanentAddress',
          'representativeProvince',
          'representativeDistrict',
          'representativePrecinct',
          'representativeNationality',
          'idExpiryDate',
          'idExpiryDateNote',
          'idEkyc',
          'isDisableButtonCheck',
        ]);
      } else {
        form.resetFields([name]);
      }

      form.setFieldValue(name, fileFormBlob);
      form.setFieldValue('isChangeUploadImage', true);
      form.validateFields([name]);
      form.resetFields(['cardFrontView']);
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
      rules={[validateForm.required]}
    >
      <Spin
        spinning={
          (progress > 0 && progress < 100 && progressLoading) || isLoadingImage
        }
      >
        {image ? (
          <img
            title={'Cập nhật ảnh'}
            alt="avatar"
            src={image}
            className={`border-2 rounded-2xl mt-1 mb-3 object-cover aspect-[4/3] cursor-pointer w-full ${
              typeModal === ActionType.VIEW_ENTERPRISE_HISTORY &&
              changedFieldName &&
              changedFields.includes(changedFieldName)
                ? 'border-[#496fb4]'
                : ''
            }`}
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
          <div className="border-2 flex items-center justify-center rounded-2xl  mt-1 mb-3 object-cover aspect-[4/3]"></div>
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
              typeModal === ActionType.VIEW_ENTERPRISE_HISTORY ||
              isDisabled ||
              typeModal === ActionType.VIEW
            }
          />
        </Upload>

        <Button
          type="dashed"
          icon={<FontAwesomeIcon icon={faCamera} size="lg" />}
          onClick={(e) => captureCam(e)}
          title={!isEnabledCam ? 'Bật cam' : 'Chụp ảnh'}
          disabled={
            typeModal === ActionType.VIEW_ENTERPRISE_HISTORY ||
            isDisabled ||
            typeModal === ActionType.VIEW
          }
        />
      </Flex>
      <ModalImage isOpen={isOpen} setIsOpen={setIsOpen} src={image} />
    </Form.Item>
  );
};

export default CUpload;
