import { Flex, Form, Spin, Typography, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { faCamera, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, NotificationError } from '@react/commons/index';
import { MESSAGE } from '@react/utils/message';
import React, { memo, useEffect, useMemo, useState } from 'react';
import Webcam from 'react-webcam';
import ModalImage from './ModalImage';
import { useActiveSubscriptStore } from '../store';
import { ActionType, ImageFileType } from '@react/constants/app';
import ModalPdf from './ModalPdf';
import {
  useGetImage,
  useGetPdf,
} from 'apps/Internal/src/components/layouts/queryHooks';
import imageCompression from 'browser-image-compression';
import IframePdf from './Iframe';
import { base64ImageToBlob } from '@react/helpers/utils';

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
  url: string;
  typeModal: ActionType;
  isRefresh: boolean;
  isCheckUpdateSuccess?: boolean;
}

export const CUpload: React.FC<CUploadProps> = ({
  name,
  isEditing = true,
  label,
  url,
  typeModal,
  isRefresh,
}) => {
  const form = Form.useFormInstance();

  const [image, setImage] = useState<string>('');
  const [errorText] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [progressLoading, setProgressLoading] = useState<boolean>(false);
  const [iframeUrl, setIframeUrl] = useState('');
  const [isEnabledCam, setIsEnabledCam] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const webcamRef = React.useRef(null);
  const { cardFront, cardBack, portrait, cardContract } =
    Form.useWatch((value) => value, form) ?? {};

  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const {
    isDisabledContract,
    isSignSuccess,
    dataActivateInfo,
    isShowContract,
    isCheckUpdateSuccess,
  } = useActiveSubscriptStore();
  const [isOpenPdf, setIsOpenPdf] = useState<boolean>(false);
  const id = form.getFieldValue('contractNo');
  const urlPdf = isCheckUpdateSuccess ? `contract/${id}` : url;
  const { data: imageBlobUrl, isLoading } = useGetImage(url);
  const { data: pdfBlobUrl } = useGetPdf(urlPdf);
  const isContractPdf = useMemo(() => {
    if (imageBlobUrl && typeof imageBlobUrl === 'object') {
      return imageBlobUrl.isPdf;
    }
    return false;
  }, [imageBlobUrl]);
  const setImageHeight = () => {
    document.querySelectorAll('.image-frame').forEach((box: any) => {
      const width = box?.clientWidth;
      box.style.height = `${(width * 3) / 4}px`;
    });
  };

  useEffect(() => {
    setImageHeight();
    window.addEventListener('resize', setImageHeight);
    return () => {
      window.removeEventListener('resize', setImageHeight);
    };
  });

  useEffect(() => {
    if (['cardBack'].includes(name)) setIsDisabled(!cardFront);
    if (name === 'cardFront') setIsDisabled(!!cardBack);
    if (name === 'portrait') setIsDisabled(!cardFront || !cardBack);
    if (!(cardFront || cardBack || portrait || cardContract)) setImage('');
  }, [cardFront, cardBack, portrait]);

  useEffect(() => {
    setImageHeight();
  }, [image]);

  useEffect(() => {
    if (isContractPdf && imageBlobUrl) {
      setIframeUrl((imageBlobUrl as any).url);
    }
    return () => {
      if (imageBlobUrl) {
        URL.revokeObjectURL(imageBlobUrl as string);
      }
    };
  }, [imageBlobUrl, isContractPdf]);

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
    if (
      (name === 'cardContract' && isSignSuccess) ||
      (isContractPdf && name === 'cardContract')
    ) {
      setIsOpenPdf(true);
      return;
    }
    setIsOpen(true);
  };

  const renderImgs = () => {
    if (image) {
      return (
        <img
          title={'Cập nhật ảnh'}
          alt=""
          src={image}
          className="border-2 rounded-2xl mt-1 mb-3 object-cover image-frame cursor-pointer w-full"
          onClick={handlePreview}
        />
      );
    } else if (imageBlobUrl) {
      if (isContractPdf && !isShowContract) {
        return (
          <div className="border-2 flex items-center justify-center rounded-2xl  mt-1 mb-3 object-cover image-frame"></div>
        );
      }
      if (
        // ((isSignSuccess && name === 'cardContract') ||
        isContractPdf &&
        name === 'cardContract' &&
        (!isRefresh || (isRefresh && isSignSuccess))
        // && isShowContract
      ) {
        return (
          <div
            className="border-2 flex items-center justify-center rounded-2xl mt-1 mb-3 object-cover image-frame"
            onClick={handlePreview}
          >
            {iframeUrl && <IframePdf iframeUrl={(imageBlobUrl as any).url} />}
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-transparent cursor-pointer" />
          </div>
        );
      }
      return (
        <img
          title={'Cập nhật ảnh'}
          alt=""
          src={imageBlobUrl as string}
          className="border-2 rounded-2xl mt-1 mb-3 object-cover image-frame cursor-pointer w-full"
          onClick={handlePreview}
        />
      );
    } else if (isEnabledCam) {
      return (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: 'user',
          }}
          className="border-2 rounded-2xl  mt-1 mb-3 object-cover	image-frame"
        />
      );
    } else
      return (
        <div className="border-2 flex items-center justify-center rounded-2xl  mt-1 mb-3 object-cover image-frame"></div>
      );
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
          required: (isRefresh && !isContractPdf) || !isDisabledContract,
          message: MESSAGE.G06,
        },
      ]}
    >
      <Spin
        spinning={
          (progress > 0 && progress < 100 && progressLoading) || isLoading
        }
      >
        {renderImgs()}
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
                typeModal === ActionType.EDIT && name !== 'cardContract'
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
              typeModal === ActionType.EDIT && name !== 'cardContract'
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
      />
      {isOpenPdf && (
        <ModalPdf
          isOpen={isOpenPdf}
          setIsOpen={setIsOpenPdf}
          isSigned={false}
          pdfUrl={isContractPdf ? (pdfBlobUrl as any) : undefined}
        />
      )}
    </Form.Item>
  );
};

export default memo(CUpload);
