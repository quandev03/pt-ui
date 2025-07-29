import { faAnglesDown, faAnglesUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import validateForm from '@react/utils/validator';
import { Col, Collapse, Form, Row } from 'antd';
import { FC } from 'react';
import { PanelStyled } from '../../page/styles';
import useOwnershipTransferStore from '../../store';
import UploadItemFileList from './UploadItem';

const FileList: FC = () => {
  const { isSuccessIsdn } = useOwnershipTransferStore();

  return (
    <Collapse
      defaultActiveKey={['1']}
      ghost
      expandIconPosition="end"
      expandIcon={({ isActive }) => (
        <FontAwesomeIcon icon={isActive ? faAnglesUp : faAnglesDown} />
      )}
    >
      <PanelStyled header="Thông tin chuyển chủ quyền" key="1">
        <Row>
          <Col span={12}>
            <Form.Item
              rules={[validateForm.required]}
              name={'file'}
              label="File căn cứ"
            >
              <UploadItemFileList
                required
                accept={[
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
                ]}
                disabled={!isSuccessIsdn}
              />
            </Form.Item>
          </Col>
        </Row>
      </PanelStyled>
    </Collapse>
  );
};

export default FileList;
