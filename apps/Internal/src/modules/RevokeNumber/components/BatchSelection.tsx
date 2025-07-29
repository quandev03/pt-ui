import { CUploadFileTemplate } from '@react/commons/index';
import { Col, Form, Row } from 'antd';
import { useDownloadResourceFile } from 'apps/Internal/src/hooks/useGetFileDownload';
import { useGetFileTemplate } from '../queryHook/useGetFileTemplate';
import { urlRevokeNumber } from '../services';

type BatchSelectionProps = {
  disabled: boolean;
};
const BatchSelection: React.FC<BatchSelectionProps> = ({ disabled }) => {
  const form = Form.useFormInstance();
  const { mutate: exportMutate } = useGetFileTemplate();
  const handleExportData = () => {
    exportMutate({
      uri: `${urlRevokeNumber}/samples/xlsx`,
    });
  };

  const { mutate: handleDownloadFile } = useDownloadResourceFile();
  const handleDownloadUploadFile = () => {
    handleDownloadFile({
      uri: form.getFieldValue('numberFile')?.fileUrl ?? '',
    });
  };
  return (
    <CUploadFileTemplate
      required
      onDownloadTemplate={handleExportData}
      onDownloadFile={disabled ? handleDownloadUploadFile : undefined}
      accept={[
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ]}
      label="Danh sách số"
      name={'numberFile'}
    />
  );
};

export default BatchSelection;
