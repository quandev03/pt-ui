import { CSelect, CViewLinkInput } from '@react/commons/index';
import CInput from '@react/commons/Input';
import { Card, Col, Form, Row, Tooltip, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useParameterQuery } from 'apps/Internal/src/hooks/useParameterQuery';
import CButton from '@react/commons/Button';
import { ActionsTypeEnum } from '@react/constants/app';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import { CriteriaType } from '@react/commons/types';
import { useDetailSubscriberQuery } from '../hooks/useDetailSubscriberQuery';
import { SimType } from 'apps/Internal/src/modules/SearchSubscription/types';
import FileModal from 'apps/Internal/src/modules/SearchSubscription/components/FileModal';
import EmailModal from './EmailModal';

const Subscriber: React.FC = () => {
  const actions = useRolesByRouter();
  const { id } = useParams();
  const { state } = useLocation();
  const [isOpenEmail, setIsOpenEmail] = useState(false);
  const [isOpenFile, setIsOpenFile] = useState(false);
  const { data } = useDetailSubscriberQuery(id, state.subId);

  const { data: activeStatusData } = useParameterQuery({
    'table-name': 'SUBSCRIBER',
    'column-name': 'ACTIVE_STATUS',
  });
  const { data: approvalStatusData } = useParameterQuery({
    'table-name': 'SUB_DOCUMENT',
    'column-name': 'APPROVAL_STATUS',
  });
  const { data: criterionData } = useGetApplicationConfig(
    'SUBSCRIBER_ACTIVE_REQUIREMENT'
  );

  const criterion = useMemo(() => {
    return criterionData
      ?.filter((item) => data?.reasonCriterion?.includes(item.code))
      ?.map(
        (item) =>
          `${CriteriaType[item.code as keyof typeof CriteriaType]}: ${item.name
          }`
      )
      .join('\n');
  }, [data?.reasonCriterion, criterionData]);

  return (
    <Card>
      <legend className="!mb-5">Thông tin thuê bao</legend>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="Số thuê bao" name="isdn">
            <CInput disabled />
          </Form.Item>
          <Form.Item label="Bộ KIT" name="kit">
            <CInput disabled />
          </Form.Item>
          <Form.Item label="Ngày kích hoạt" name="activeDate">
            <CInput disabled />
          </Form.Item>
          <Tooltip title={data?.reasonActiveStatus} placement="topRight">
            <Form.Item label="Tình trạng chặn cắt" name="activeStatus">
              <CSelect
                disabled
                title=""
                suffixIcon={null}
                options={activeStatusData?.map(({ label, value }) => ({
                  label,
                  value: Number(value),
                }))}
              />
            </Form.Item>
          </Tooltip>
          <Tooltip title={criterion} placement="topRight">
            <Form.Item
              label={
                <span
                  title="Tình trạng vi phạm 8 tiêu chí"
                  className="line-clamp-2"
                >
                  Tình trạng vi phạm 8 tiêu chí
                </span>
              }
              name="criterion"
            >
              <div className="bg-[#0000000a] border border-[#d9d9d9] rounded-md py-1.5 px-2.5">
                <Typography.Text
                  type={data?.criterion === 1 ? 'success' : 'danger'}
                >
                  {data?.criterion === 1 ? 'Không vi phạm' : 'Có vi phạm'}
                </Typography.Text>
              </div>
            </Form.Item>
          </Tooltip>
          <Form.Item label="Trạng thái đối soát C06" name="statusC06">
            <div className="bg-[#0000000a] border border-[#d9d9d9] rounded-md py-1.5 px-2.5">
              <Typography.Text
                type={data?.statusC06 === 1 ? 'success' : 'danger'}
              >
                {data?.statusC06 === 1 ? 'Đã đối soát' : 'Chưa đối soát'}
              </Typography.Text>
            </div>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Serial SIM" name="serial">
            <CInput disabled />
          </Form.Item>
          <Form.Item label="Ngày ghép KIT" name="kitDate">
            <CInput disabled />
          </Form.Item>
          <Form.Item label="Tuổi đời thuê bao" name="ageSub">
            <CInput disabled />
          </Form.Item>
          <Form.Item
            label={
              <span
                title="Trạng thái chuẩn hóa thông tin"
                className="line-clamp-2"
              >
                Trạng thái chuẩn hóa thông tin
              </span>
            }
            name="inforNormalizationStatus"
          >
            <CInput disabled />
          </Form.Item>
          <Form.Item label="Trạng thái đăng ký App" hidden name="appRegStatus">
            <CInput disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Loại SIM" name="simType">
            <CInput
              disabled
              addonAfter={
                actions.includes(ActionsTypeEnum.SEND_MAIL) &&
                data?.simType === SimType.ESIM &&
                data?.qrCode && (
                  <CButton size="small" onClick={() => setIsOpenEmail(true)}>
                    Gửi email eSIM
                  </CButton>
                )
              }
            />
          </Form.Item>
          <Tooltip title={data?.servicePackage} placement="topRight">
            <Form.Item label="Gói cước" name="servicePackage">
              <CInput
                disabled
                styles={{ input: { textOverflow: 'ellipsis' } }}
              />
            </Form.Item>
          </Tooltip>
          <Form.Item label="Tình trạng thuê bao" name="status">
            <CInput disabled />
          </Form.Item>
          <Form.Item label="Trạng thái kiểm duyệt" name="approvalStatus">
            <CSelect
              disabled
              title=""
              suffixIcon={null}
              options={approvalStatusData?.map(({ label, value }) => ({
                label,
                value: Number(value),
              }))}
            />
          </Form.Item>
          <Form.Item label="Nghị định 13" name="regulation13">
            <CViewLinkInput
              children="Biên bản xác nhận NĐ13"
              onView={() => setIsOpenFile(true)}
            />
          </Form.Item>
        </Col>
      </Row>
      <EmailModal isOpen={isOpenEmail} setIsOpen={setIsOpenEmail} />
      <FileModal
        isOpen={isOpenFile}
        setIsOpen={setIsOpenFile}
        name="regulation13"
      />
    </Card>
  );
};

export default Subscriber;
