import { faCamera, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, NotificationError } from '@react/commons/index';
import { ImageFileType } from '@react/constants/app';
import { MESSAGE } from '@react/utils/message';
import { Flex, Form, Spin, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import ModalImage from 'apps/Internal/src/modules/ActivateSubscription/components/ModalImage';
import ImageHd from './HDTT.png';
import imageCompression from 'browser-image-compression';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Webcam from 'react-webcam';
import useStoreListOfRequestsChangeSim from '../../../ListOfRequestsChangeSim/store';
import useStoreOwnershipTransferStore from '../../store';
import { debounce } from 'lodash';
import ModalPdf from '../ModalPdf';
import { ContractTypeEnum } from '../../hooks/useDetailContract';
import { base64ImageToBlob } from '@react/helpers/utils';

interface CUploadProps {
  name: string;
  label: string;
  disabled?: boolean;
}

const getContractType = (name: string) => {
  switch (name) {
    case 'cardContract':
      return ContractTypeEnum.XAC_NHAN;
    case 'requestFormCCQ':
      return ContractTypeEnum.YEU_CAU;
    case 'ownerCommit':
      return ContractTypeEnum.CAM_KET;
    default:
      return ContractTypeEnum.XAC_NHAN;
  }
};

export const CUpload: React.FC<CUploadProps> = ({ name, label, disabled }) => {
  const form = Form.useFormInstance();
  const [image, setImage] = useState<string>('');
  const [isEnabledCam, setIsEnabledCam] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [progressLoading, setProgressLoading] = useState<boolean>(false);
  const webcamRef = React.useRef(null);
  const isdn = Form.useWatch('isdn', form);
  const cardFront = Form.useWatch('transfereeCardFront', form);
  const cardBack = Form.useWatch('transfereeCardBack', form);
  const portrait = Form.useWatch('transfereePortrait', form);
  const { cardContract, requestFormCCQ, ownerCommit } =
    Form.useWatch((e) => e, form) ?? {};
  const [isOpenPdf, setIsOpenPdf] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const { offlineCreatedList, isSignSuccess, isTransfereeSignSuccess } =
    useStoreOwnershipTransferStore();
  const isDisabledContract = !offlineCreatedList.includes(
    getContractType(name)
  );

  const IsInvalidIsdn = useMemo(() => {
    const isdnErr = form.getFieldError('isdn');
    return !isdn || (isdn && isdnErr.length);
  }, [isdn]);

  useEffect(() => {
    if (
      (name === 'cardContract' && !cardContract) ||
      (name === 'requestFormCCQ' && !requestFormCCQ) ||
      (name === 'ownerCommit' && !ownerCommit)
    )
      setImage('');
  }, [cardContract, requestFormCCQ, ownerCommit]);

  useEffect(() => {
    if (cardFront?.includes?.('base64')) {
      // image created by camera
      form.setFieldValue('transfereeCardFront', base64ImageToBlob(cardFront));
      return;
    }
    if (cardBack?.includes?.('base64')) {
      form.setFieldValue('transfereeCardBack', base64ImageToBlob(cardBack));
      return;
    }
    if (portrait?.includes?.('base64')) {
      form.setFieldValue('transfereePortrait', base64ImageToBlob(portrait));
      return;
    }
    if (name === 'transfereeCardFront')
      setIsDisabled(!!cardBack || IsInvalidIsdn);
    if (name === 'transfereeCardBack') setIsDisabled(!cardFront || !!portrait);
    if (name === 'transfereePortrait') setIsDisabled(!cardBack);
    if (
      [
        'transfereeCardFront',
        'transfereeCardBack',
        'transfereePortrait',
      ].includes(name) &&
      !(cardFront || cardBack || portrait)
    )
      setImage('');
  }, [cardFront, cardBack, portrait, IsInvalidIsdn]);

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
    if (
      ['cardContract', 'requestFormCCQ', 'ownerCommit'].includes(name) &&
      isSignSuccess
    ) {
      setIsOpenPdf(true);
      return;
    }
    setIsOpen(true);
  };

  const getShowResult = () => {
    if (['cardContract', 'ownerCommit'].includes(name)) {
      return isSignSuccess || isTransfereeSignSuccess;
    } else if (name === 'requestFormCCQ') {
      return isSignSuccess;
    } else return false;
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
            required:
              !['cardContract', 'requestFormCCQ', 'ownerCommit'].includes(
                name
              ) ||
              (!isDisabledContract && !isSignSuccess),
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
              className="max-w-full ml-auto mr-auto border-2 rounded-2xl  -mt-1 mb-3 object-cover	aspect-[16/10]"
            />
          ) : (
            <div className="max-w-[360px] ml-auto mr-auto border-2 flex items-center justify-center rounded-2xl  -mt-1 mb-3 object-cover aspect-[16/10]">
              {getShowResult() && (
                <img
                  title="Hợp đồng"
                  alt="avatar"
                  src={ImageHd}
                  className="max-w-[360px] ml-auto mr-auto border-2 rounded-2xl mt-0 mb-0 object-cover object-top	blur-[1.5px] aspect-[16/10] cursor-pointer w-full"
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
                !['cardContract', 'requestFormCCQ', 'ownerCommit'].includes(
                  name
                )
                  ? isDisabled
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
              !['cardContract', 'requestFormCCQ', 'ownerCommit'].includes(name)
                ? isDisabled
                : isDisabledContract
            }
          />
        </Flex>
        <ModalImage isOpen={isOpen} setIsOpen={setIsOpen} src={image} />
        {isOpenPdf && (
          <ModalPdf
            isOpen={isOpenPdf}
            setIsOpen={setIsOpenPdf}
            isSign={true}
            contractType={getContractType(name)}
          />
        )}
      </Form.Item>
    </Flex>
  );
};

export default CUpload;
