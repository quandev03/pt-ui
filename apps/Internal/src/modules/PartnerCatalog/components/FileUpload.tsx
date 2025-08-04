import {
  base64ImageToBlob,
  ImageFileType,
  IModeAction,
  MESSAGE,
  NotificationError,
  PreviewPDF,
  useActionMode,
} from '@vissoft-react/common';
import { Button, Form, Upload } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { RcFile } from 'antd/es/upload';
import { UploadProps } from 'antd/lib';
import { Camera, UploadCloud } from 'lucide-react';
import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import Webcam from 'react-webcam';
import { ChildRef } from '../types';
import ModalImage from './ModalImage';

type Props = {
  name: string;
  label: string;
  imageUrl?: Blob;
  fileAccess?: string[];
  disabled?: boolean;
  required?: boolean;
  showIconRequired?: boolean;
  messageErrorFormat?: string;
  messageErrorFileSize?: string;
  mimeType?: string;
};
export const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const FileUpload = forwardRef<ChildRef, Props>(
  (
    {
      imageUrl,
      label,
      name,
      fileAccess = ImageFileType,
      disabled,
      showIconRequired = true,
      required = true,
      messageErrorFormat = MESSAGE.G31,
      messageErrorFileSize = 'Kích thước tệp tối đa: 500KB',
      mimeType = 'application/octet-stream',
    },
    ref
  ) => {
    const [image, setImage] = useState<string>('');
    const actionMode = useActionMode();
    const webcamRef = React.useRef(null);
    const form = Form.useFormInstance();
    const nameForm = useWatch(name, form);
    const [openPreviewImage, setOpenPreviewImage] = useState<boolean>(false);
    const [openPreviewPDF, setOpenPreviewPDF] = useState<boolean>(false);
    const [isEnabledCam, setIsEnabledCam] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
      clearImage: () => {
        setImage('');
      },
    }));

    const captureCam = (e: any) => {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then(() => {
          form.resetFields([name]);
          e.preventDefault();
          setIsEnabledCam((old) => !old);
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
          NotificationError({ message: MESSAGE.G38 });
        });
    };

    useEffect(() => {
      let url = '';
      if (imageUrl) {
        // const blob = base64ToBlob(
        //   imageUrl,
        //   mimeType === 'application/pdf' ? mimeType : undefined
        // );
        url = URL.createObjectURL(imageUrl);
        setImage(url);
        return () => {
          URL.revokeObjectURL(url);
        };
      }
    }, [imageUrl, mimeType]);

    const PreViewImage = useMemo(() => {
      if (image) {
        const isHiddenImageCreateAction =
          actionMode === IModeAction.CREATE && !nameForm;
        if (isHiddenImageCreateAction) {
          return (
            <div
              className="border-2 flex items-center justify-center rounded-2xl mt-1 mb-3 object-cover"
              style={{ aspectRatio: '16 / 9' }}
            ></div>
          );
        }
        if (
          (nameForm && nameForm.type === 'application/pdf') ||
          mimeType === 'application/pdf'
        ) {
          return (
            <div
              className="border-2 flex items-center justify-center rounded-2xl mt-1 mb-3 object-cover image-frame"
              style={{ aspectRatio: '16 / 9' }}
              onClick={() => {
                setOpenPreviewPDF(true);
              }}
            >
              <div
                className="absolute top-0 left-0 h-full bg-transparent cursor-pointer"
                style={{ width: 'calc(100% - 20px)' }}
              />
              <iframe
                width="100%"
                src={image}
                title="title"
                height={'100%'}
                key={Math.random()}
              />
            </div>
          );
        }
        return (
          <img
            title={'Xem hình ảnh'}
            alt="avatar"
            src={image}
            className="border-2 rounded-2xl mt-1 mb-3 object-cover cursor-pointer w-full"
            style={{ aspectRatio: '16 / 9' }}
            onClick={() => {
              setOpenPreviewImage(true);
            }}
          />
        );
      }
      if (isEnabledCam) {
        return (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              facingMode: 'user',
            }}
            className="border-2 rounded-2xl mt-1 mb-3 object-cover	"
            style={{ aspectRatio: '16 / 9' }}
          />
        );
      }
      return (
        <div
          className="border-2 flex items-center justify-center rounded-2xl mt-1 mb-3 object-cover"
          style={{ aspectRatio: '16 / 9' }}
        />
      );
    }, [image, isEnabledCam, actionMode, nameForm]);

    const beforeUpload: UploadProps['beforeUpload'] = async (file) => {
      setImage('');
      if (!fileAccess.some((item) => file.type === item)) {
        form.setFields([
          {
            name: name,
            errors: [messageErrorFormat],
          },
        ]);
        return;
      } else if (
        file.size &&
        file.size > 500 * 1024 &&
        file.type !== 'application/pdf'
      ) {
        form.setFields([
          {
            name: name,
            errors: [messageErrorFileSize],
          },
        ]);
        return;
      } else if (
        file.size &&
        file.size > 5 * 1024 * 1024 &&
        file.type === 'application/pdf'
      ) {
        form.setFields([
          {
            name: name,
            errors: [MESSAGE.G13],
          },
        ]);
        return;
      }
      form.setFields([
        {
          name: name,
          errors: [],
        },
      ]);
      if (image) {
        URL.revokeObjectURL(image);
      }
      return false;
    };

    const handleChangeFileLoad: UploadProps['onChange'] = async ({
      file,
      fileList,
    }) => {
      if (fileList && fileList.length > 0) {
        let url = '';
        if (
          fileList[0].type !== 'application/pdf' &&
          fileList[0].originFileObj
        ) {
          url = await getBase64(fileList[0].originFileObj);
        } else if (
          fileList[0].type === 'application/pdf' &&
          fileList[0].originFileObj
        ) {
          url = URL.createObjectURL(fileList[0].originFileObj);
        }
        setImage(url);
      }
      form.setFieldValue(name, file);
    };

    return (
      <Form.Item
        name={name}
        label={label}
        required={showIconRequired}
        labelCol={{
          flex: 'auto',
        }}
        wrapperCol={{
          flex: 'auto',
        }}
        layout="vertical"
        className="w-full"
        rules={
          !imageUrl && required
            ? [
                {
                  required: true,
                  message: MESSAGE.G06,
                },
              ]
            : undefined
        }
      >
        <div>
          {PreViewImage}
          <div className="flex justify-center items-center gap-5">
            <Upload
              accept={fileAccess.join(',')}
              showUploadList={false}
              disabled={false}
              beforeUpload={beforeUpload}
              onChange={handleChangeFileLoad}
              multiple={false}
              maxCount={1}
            >
              <Button
                type="dashed"
                icon={<UploadCloud size={16} />}
                title="Tải ảnh lên"
                disabled={disabled}
              />
            </Upload>
            <Button
              type="dashed"
              icon={<Camera size={16} />}
              onClick={(e) => captureCam(e)}
              title={!isEnabledCam ? 'Bật cam' : 'Chụp ảnh'}
              disabled={disabled}
            />
          </div>
          <ModalImage
            isOpen={openPreviewImage}
            onCancel={() => {
              setOpenPreviewImage(false);
            }}
            src={image ?? ''}
          />
          <PreviewPDF
            file={image}
            open={openPreviewPDF}
            title="Upload file hợp đồng"
            onClose={() => setOpenPreviewPDF(false)}
          />
        </div>
      </Form.Item>
    );
  }
);

export default memo(FileUpload);
