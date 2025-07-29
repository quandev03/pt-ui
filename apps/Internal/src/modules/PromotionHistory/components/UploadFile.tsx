import {
  Button,
  Form,
  FormItemProps,
  Tooltip,
  Upload,
  UploadProps,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { RcFile } from '@react/commons/types';
import { MESSAGE } from '@react/utils/message';
import React from 'react';
import { Text, TextLink } from '@react/commons/Template/style';

const FileType = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/csv',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;
type AcceptType = (typeof FileType)[number];

const convertAcceptToExtensions = (accept: AcceptType[]): string => {
  const acceptMapping: Record<AcceptType, string> = {
    'image/png': '.png',
    'image/jpeg': '.jpeg',
    'image/jpg': '.jpg',
    'application/pdf': '.pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      '.xlsx',
    'application/vnd.ms-excel': '.xls',
    'text/csv': '.csv',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      '.docx',
  };

  return accept.map((type) => acceptMapping[type]).join(', ');
};

type PropsUploadComponent = {
  onDownloadTemplate?: () => void;
  onDownloadFile?: () => void;
  onPreview?: () => void;
  accept?: AcceptType[];
  id?: string;
  fileName: string;
};

const UploadComponent = ({
  onDownloadTemplate,
  onDownloadFile,
  onPreview,
  accept,
  id,
  fileName
}: PropsUploadComponent) => {
  const form = Form.useFormInstance();
  // check field name of form list yes or no
  const field = id?.includes('_')
    ? id?.split('_').map((i) => (isNaN(+i) ? i : +i))
    : id;
  const fileNumbers = Form.useWatch(field, form);
  
  const beforeUploadHandler: UploadProps['beforeUpload'] = (file) => {
    form.setFieldValue(field, file);
    form.validateFields([field]);
    return false;
  };

  return (
    <div className="flex flex-col justify-start items-start gap-3">
      <div className="flex items-center gap-3 w-full">
        <Upload
          accept={accept?.join(',')}
          multiple={false}
          maxCount={1}
          showUploadList={false}
          beforeUpload={beforeUploadHandler}
        >
          <Tooltip
            title={accept && `Định dạng ${convertAcceptToExtensions(accept)}`}
            placement="topLeft"
          >
            <Button
              type="primary"
              icon={<UploadOutlined />}
              className="w-[124px] h-[35px] "
            >
              Chọn file
            </Button>
          </Tooltip>
        </Upload>
        <Tooltip title={fileNumbers?.name ?? fileName} placement="topLeft">
          <TextLink onClick={onDownloadFile || onPreview}>
            {fileNumbers?.name ?? fileName}
          </TextLink>
        </Tooltip>
      </div>
      {onDownloadTemplate && (
        <div className="flex items-center flex-col italic">
          {onDownloadTemplate && (
            <div
              onClick={onDownloadTemplate}
              className="underline text-[#41CE6E] cursor-pointer"
            >
              (*) Tải file mẫu
            </div>
          )}
        </div>
      )}
    </div>
  );
};

type Props = FormItemProps & {
  onDownloadTemplate?: () => void;
  onDownloadFile?: () => void;
  onPreview?: () => void;
  accept?: AcceptType[];
  fileName: string;
};

const UploadFileTemplate = ({
  onDownloadTemplate,
  onDownloadFile,
  onPreview,
  accept,
  fileName,
  ...props
}: Props) => {
  return (
    <Form.Item
      rules={[
        {
          validator(_, file?: RcFile) {
            if (props.required && !file) {
              return Promise.reject(MESSAGE.G06);
            }
            if (file && accept && !accept.includes(file?.type as AcceptType)) {
              return Promise.reject(
                'File dữ liệu tải lên sai định dạng. Vui lòng kiểm tra lại!'
              );
            }
            return Promise.resolve();
          },
        },
      ]}
      required={true}
      {...props}
    >
      <UploadComponent
        onDownloadTemplate={onDownloadTemplate}
        onDownloadFile={onDownloadFile}
        accept={accept}
        onPreview={onPreview}
        fileName={fileName}
      />
    </Form.Item>
  );
};

export default UploadFileTemplate;
