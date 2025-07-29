import { UploadOutlined } from '@ant-design/icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NotificationError } from '@react/commons/Notification';
import { Text } from '@react/commons/Template/style';
import { RcFile } from '@react/commons/types';
import {
  Button,
  Flex,
  FormItemProps,
  Tooltip,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';

const FILE_SIZE_MAX_DEFAULT = 10 * 1024 * 1024; //10mb

const FileType = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'video/avi',
  'video/x-flv',
  'video/x-ms-wmv',
  'video/quicktime',
  'video/mp4',
  'video/x-sony-avchd',
  'video/webm',
  'video/x-matroska',
  'video/vnd.dlna.mpeg-tts',
  '.mts',
  '.flv',
  '.wmv',
] as const;

type AcceptType = (typeof FileType)[number];

const convertAcceptToExtensions = (accept: AcceptType[]): string => {
  const acceptMapping: Record<AcceptType, string> = {
    'image/png': '.png',
    'image/jpeg': '.jpeg',
    'image/jpg': '.jpg',
    'video/avi': '.avi',
    'video/x-flv': '.flv',
    'video/x-ms-wmv': '.wmv',
    'video/quicktime': '.mov',
    'video/mp4': '.mp4',
    'video/x-sony-avchd': '.avchd',
    'video/webm': '.webm',
    'video/x-matroska': '.mkv',
    'video/vnd.dlna.mpeg-tts': '.mts',
    '.mts': '.mts',
    '.flv': '.flv',
    '.wmv': '.wmv',
  };

  return accept.map((type) => acceptMapping[type]).join(', ');
};

type Props = FormItemProps & {
  onDownloadTemplate?: () => void;
  onDownloadFile?: () => void;
  onPreview?: () => void;
  accept?: AcceptType[];
  disabled?: boolean;
  value?: UploadFile[];
  onChange?: (value: UploadFile[]) => void;
};

const UploadItemFileList = ({
  onPreview,
  accept,
  name,
  disabled,
  value = [],
  onChange,
  ...props
}: Props) => {
  const beforeUploadHandler: UploadProps['beforeUpload'] = (
    file: RcFile,
    newFileList: RcFile[]
  ) => {
    console.log(file);
    if (file.uid === newFileList[newFileList.length - 1].uid) {
      let tempFileList: UploadFile[] = newFileList;
      const isInCorrectFormat = newFileList.some((e) => {
        const isFlv = e.name.endsWith('.flv') && e?.type === '';
        return isFlv ? false : !accept?.includes(e?.type as AcceptType);
      });
      const isExceededSize = newFileList.some(
        (e) => e?.size > FILE_SIZE_MAX_DEFAULT
      );
      if (isInCorrectFormat) {
        NotificationError('File tải lên không đúng định dạng');
      } else if (isExceededSize) {
        NotificationError('File tải lên vượt quá 10MB');
      }
      newFileList.forEach((item: UploadFile) => {
        const isFlv = item.name.endsWith('.flv') && item?.type === '';

        if ((accept && !accept.includes(item?.type as AcceptType)) || isFlv) {
          tempFileList = tempFileList.filter((e) => {
            const isFlv = e.name.endsWith('.flv') && e?.type === '';
            return isFlv ? true : e.uid !== item.uid;
          });
        } else if (item.size && item.size > FILE_SIZE_MAX_DEFAULT) {
          tempFileList = tempFileList.filter((e) => e.uid !== item.uid);
        }
      });
      onChange?.([...value, ...tempFileList]);
    }
    return false;
  };

  const handleRemove = (file: UploadFile) => {
    const updatedFileList = value.filter((item) => item.uid !== file.uid);
    onChange?.(updatedFileList);
  };

  return (
    <div className="flex flex-col justify-start items-start gap-3">
      <div
        className={`flex gap-3 w-full ${
          value.length < 2 ? 'items-center' : ''
        }`}
      >
        <Upload
          accept={accept?.join(',')}
          multiple
          fileList={value}
          beforeUpload={beforeUploadHandler}
          onRemove={handleRemove}
          itemRender={() => null}
          disabled={disabled}
          {...props}
        >
          <Tooltip
            title={accept && `Định dạng ${convertAcceptToExtensions(accept)}`}
            placement="topLeft"
          >
            <Button
              type="primary"
              icon={<UploadOutlined />}
              className="w-[124px] h-[35px] "
              disabled={disabled}
            >
              Chọn file
            </Button>
          </Tooltip>
        </Upload>
        <div>
          {value.map((file: UploadFile) => (
            <Flex align="center" gap={8}>
              <Text>{file?.name}</Text>
              <FontAwesomeIcon
                icon={faXmark}
                onClick={() => handleRemove(file)}
                className="cursor-pointer"
                size="lg"
                color="#fd5050"
                title="Xóa"
              />
            </Flex>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadItemFileList;
