import CInput from '@react/commons/Input';
import { Card, Col, Form, Row, Tooltip } from 'antd';
import { useState } from 'react';
import NoteModal from './NoteModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencil } from '@fortawesome/free-solid-svg-icons';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import CSelect from '@react/commons/Select';
import { useIsAdmin } from '../hooks/useIsAdmin';
import IdentificationModal from './IdentificationModal';
import useSubscriptionStore from '../store';
import { useDetailSubscriptionQuery } from '../hooks/useDetailSubscriptionQuery';
import { useParams } from 'react-router-dom';

const Customer: React.FC = () => {
  const isAdmin = useIsAdmin();
  const { id } = useParams();
  const { isIdentification } = useSubscriptionStore();
  const [isOpenIdentification, setIsOpenIdentification] = useState(false);
  const [isOpenNote, setIsOpenNote] = useState(false);

  const { data } = useDetailSubscriptionQuery(id ?? '', isAdmin);
  const { data: sexData } = useGetApplicationConfig('SEX');
  const { data: idTypeData } = useGetApplicationConfig('ID_TYPE');

  return (
    <Card>
      <legend className="!mb-5">
        Thông tin khách hàng
        {!isAdmin && !isIdentification && (
          <FontAwesomeIcon
            icon={faEye}
            className="cursor-pointer"
            onClick={() => setIsOpenIdentification(true)}
          />
        )}
      </legend>
      {!isAdmin && !isIdentification && (
        <Row gutter={24}>
          <Col span={8}>
            <Tooltip title={data?.description}>
              <Form.Item label="Ghi chú" name="description">
                <CInput
                  disabled
                  styles={{ input: { textOverflow: 'ellipsis' } }}
                />
              </Form.Item>
            </Tooltip>
          </Col>
        </Row>
      )}
      {(isAdmin || isIdentification) && (
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="Họ và tên" name="name">
              <CInput disabled />
            </Form.Item>
            <Form.Item label="Loại GTTT" name="idType">
              <CSelect
                disabled
                title=""
                suffixIcon={null}
                options={idTypeData?.map(({ name, value }) => ({
                  label: name,
                  value,
                }))}
              />
            </Form.Item>
            <Tooltip title={data?.idIssuePlace} placement="topRight">
              <Form.Item label="Nơi cấp" name="idIssuePlace">
                <CInput
                  disabled
                  styles={{ input: { textOverflow: 'ellipsis' } }}
                />
              </Form.Item>
            </Tooltip>
            <Form.Item label="Đối tượng sử dụng" name="appObject">
              <CInput disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Ngày sinh" name="birthDate">
              <CInput disabled />
            </Form.Item>
            <Form.Item label="Số GTTT" name="idNo">
              <CInput disabled />
            </Form.Item>
            <Form.Item label="Ngày hết hạn" name="idExpireDate">
              <CInput disabled />
            </Form.Item>
            <Tooltip title={data?.description} placement="topRight">
              <Form.Item label="Ghi chú" name="description">
                <CInput
                  disabled
                  styles={{ input: { textOverflow: 'ellipsis' } }}
                  suffix={
                    isAdmin && (
                      <FontAwesomeIcon
                        icon={faPencil}
                        className="cursor-pointer text-black"
                        onClick={() => setIsOpenNote(true)}
                      />
                    )
                  }
                />
              </Form.Item>
            </Tooltip>
          </Col>
          <Col span={8}>
            <Form.Item label="Giới tính" name="sex">
              <CSelect
                disabled
                title=""
                suffixIcon={null}
                options={sexData?.map(({ name, value }) => ({
                  label: name,
                  value,
                }))}
              />
            </Form.Item>
            <Form.Item label="Ngày cấp" name="idIssueDate">
              <CInput disabled />
            </Form.Item>
            <Tooltip title={data?.address} placement="topRight">
              <Form.Item label="Địa chỉ thường trú" name="address">
                <CInput
                  disabled
                  styles={{ input: { textOverflow: 'ellipsis' } }}
                />
              </Form.Item>
            </Tooltip>
          </Col>
        </Row>
      )}
      <IdentificationModal
        isOpen={isOpenIdentification}
        setIsOpen={setIsOpenIdentification}
      />
      <NoteModal isOpen={isOpenNote} setIsOpen={setIsOpenNote} />
    </Card>
  );
};

export default Customer;
