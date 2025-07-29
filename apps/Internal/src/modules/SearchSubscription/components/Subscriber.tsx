import { CSelect, CViewInput, CViewLinkInput } from '@react/commons/index';
import CInput from '@react/commons/Input';
import { Card, Col, Form, Row, Tooltip, Typography } from 'antd';
import { useMemo, useState } from 'react';
import SubscriberStatusModal from './SubscriberStatusModal';
import { useNavigate, useParams } from 'react-router-dom';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useParameterQuery } from 'apps/Internal/src/hooks/useParameterQuery';
import FileModal from './FileModal';
import useSubscriptionStore from '../store';
import IdentificationModal from './IdentificationModal';
import CButton from '@react/commons/Button';
import EmailModal from './EmailModal';
import { useIsAdmin } from '../hooks/useIsAdmin';
import { SimType } from '../types';
import { useDetailSubscriptionQuery } from '../hooks/useDetailSubscriptionQuery';
import { ActionsTypeEnum } from '@react/constants/app';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import { CriteriaType } from '@react/commons/types';
import SearchImageModal from './SearchImageModal';
import LastFiveCallModal from './LastFiveCallModal';

const Subscriber: React.FC = () => {
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  const actions = useRolesByRouter();
  const { id } = useParams();
  const { isIdentification } = useSubscriptionStore();
  const [isOpenSubscriberStatus, setIsOpenSubscriberStatus] = useState(false);
  const [isOpenIdentification, setIsOpenIdentification] = useState(false);
  const [isOpenEmail, setIsOpenEmail] = useState(false);
  const [isOpenSearchImage, setIsOpenSearchImage] = useState(false);
  const [isOpenLastFiveCall, setIsOpenLastFiveCall] = useState(false);
  const [isOpenFile, setIsOpenFile] = useState(false);
  const { data } = useDetailSubscriptionQuery(id ?? '', isAdmin);

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
          `${CriteriaType[item.code as keyof typeof CriteriaType]}: ${
            item.name
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
          <Form.Item label="Serial SIM" name="serial">
            <CInput disabled />
          </Form.Item>
          <Form.Item label="Loại SIM" name="simType">
            <CInput
              disabled
              addonAfter={
                isAdmin &&
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
          <Form.Item label="Bộ KIT" name="kit">
            <CInput disabled />
          </Form.Item>
          <Tooltip title={data?.servicePackage} placement="topRight">
            <Form.Item label="Gói cước" name="servicePackage">
              <CInput
                disabled
                styles={{ input: { textOverflow: 'ellipsis' } }}
              />
            </Form.Item>
          </Tooltip>
          <Form.Item label="Ngày ghép KIT" name="kitDate">
            <CInput disabled />
          </Form.Item>
          <Form.Item label="Ngày kích hoạt" name="activeDate">
            <CInput disabled />
          </Form.Item>
          <Form.Item label="Tuổi đời thuê bao" name="ageSub">
            <CInput disabled />
          </Form.Item>
          <Form.Item label="Tình trạng thuê bao" name="status">
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
          <Form.Item label="Trạng thái đối soát C06" name="statusC06">
            <div className="bg-[#0000000a] border border-[#d9d9d9] rounded-md py-1.5 px-2.5">
              <Typography.Text
                type={data?.statusC06 === 1 ? 'success' : 'danger'}
              >
                {data?.statusC06 === 1 ? 'Đã đối soát' : 'Chưa đối soát'}
              </Typography.Text>
            </div>
          </Form.Item>
          <Form.Item
            label="Trạng thái xác thực videocall"
            name="videoCallStatus"
          >
            <div className="bg-[#0000000a] border border-[#d9d9d9] rounded-md py-1.5 px-2.5">
              <Typography.Text
                type={data?.videoCallStatus ? 'success' : 'danger'}
              >
                {data?.videoCallStatus ? 'Đã xác thực' : 'Chưa xác thực'}
              </Typography.Text>
            </div>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="OCS" name="ocs">
            <CViewInput onView={() => setIsOpenSubscriberStatus(true)} />
          </Form.Item>
          <Form.Item label="HLR" name="hlr">
            <CInput disabled />
          </Form.Item>
          <Form.Item label="Reset HLR" name="hlrReset">
            <CInput disabled />
          </Form.Item>
          <Form.Item label="PIN/PUK" name="pinAndPuk">
            <CViewInput />
          </Form.Item>
          <Form.Item label="Thiết bị KH đang sử dụng" name="device">
            <CInput disabled />
          </Form.Item>
          <Form.Item label="Biến động tài khoản" name="accountBalanceChange">
            <CViewInput />
          </Form.Item>
          <Form.Item label="Dịch vụ GTGT" name="GTGTService">
            <CInput disabled />
          </Form.Item>
          <Form.Item label="Đổi mã PIN" name="pinChange">
            <CViewInput />
          </Form.Item>
          <Form.Item label="Đổi dịch vụ" name="serviceChange">
            <CInput disabled />
          </Form.Item>
          <Form.Item label="Chặn cắt dịch vụ" name="serviceTermination">
            <CViewInput />
          </Form.Item>
          <Form.Item label="Xóa lỗi nạp tiền" name="topUpErrorRemoval">
            <CViewInput />
          </Form.Item>
          <Form.Item label="Tra cứu ảnh" name="imageInquiry">
            <CViewInput onView={() => setIsOpenSearchImage(true)} />
          </Form.Item>
          <Form.Item label="Feedback tập trung" name="userFeedback">
            <CViewInput />
          </Form.Item>
          <Form.Item label="Trạng thái đăng ký App" hidden name="appRegStatus">
            <CInput disabled />
          </Form.Item>
          <Form.Item label="Lịch sử tác động" name="actionHistory">
            <CViewInput
              onView={() =>
                navigate(
                  isAdmin
                    ? pathRoutes.searchSubscriptionImpactHistory(id)
                    : pathRoutes.searchSubscriptionStaffImpactHistory(id)
                )
              }
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={
              <span title="Tra cứu thông tin gói cước" className="line-clamp-2">
                Tra cứu thông tin gói cước
              </span>
            }
            name="packCapacity"
          >
            <CViewInput
              onView={() =>
                navigate(
                  isAdmin
                    ? pathRoutes.searchSubscriptionPackageCapacity(id)
                    : pathRoutes.searchSubscriptionStaffPackageCapacity(id)
                )
              }
            />
          </Form.Item>
          <Form.Item
            label={
              <span title="Tra cứu 5 SĐT đã liên lạc" className="line-clamp-2">
                Tra cứu 5 SĐT đã liên lạc
              </span>
            }
            name="recentContacts"
          >
            <CViewInput onView={() => setIsOpenLastFiveCall(true)} />
          </Form.Item>
          <Form.Item
            label={
              <span title="Tra cứu lịch sử khuyến mại" className="line-clamp-2">
                Tra cứu lịch sử khuyến mại
              </span>
            }
            name="promotionHistory"
          >
            <CViewInput />
          </Form.Item>
          <Form.Item
            label={
              <span
                title="Tra cứu lịch sử nhắn tin 1414"
                className="line-clamp-2"
              >
                Tra cứu lịch sử nhắn tin 1414
              </span>
            }
            name="messageHistory1414"
          >
            <CViewInput />
          </Form.Item>
          <Form.Item label="Tra cứu lịch sử quấy rối" name="harassmentHistory">
            <CViewInput />
          </Form.Item>
          <Form.Item
            label={
              <span
                title="Tra cứu lịch sử hạ băng thông"
                className="line-clamp-2"
              >
                Tra cứu lịch sử hạ băng thông
              </span>
            }
            name="bandwidthReductionHistory"
          >
            <CViewInput />
          </Form.Item>
          <Form.Item label="Lịch sử bù cước" name="billAdjustmentHistory">
            <CViewInput />
          </Form.Item>
          <Form.Item
            label="Lịch sử đăng ký gói cước"
            name="packageRegistrationHistory"
          >
            <CViewInput
              onView={() =>
                navigate(
                  isAdmin
                    ? pathRoutes.searchSubscriptionPackageHistory(id)
                    : pathRoutes.searchSubscriptionStaffPackageHistory(id)
                )
              }
            />
          </Form.Item>
          <Form.Item
            label="Lịch sử đăng ký dịch vụ"
            name="serviceRegistrationHistory"
          >
            <CViewInput />
          </Form.Item>
          <Form.Item label="Lịch sử SMS" name="smsHistory">
            <CViewInput
              onView={() =>
                navigate(
                  isAdmin
                    ? pathRoutes.searchSubscriptionSmsHistory(id)
                    : pathRoutes.searchSubscriptionStaffSmsHistory(id)
                )
              }
            />
          </Form.Item>
          <Form.Item label="Lịch sử nạp tiền" name="topUpHistory">
            <CViewInput />
          </Form.Item>
          <Form.Item label="Lịch sử dịch vụ GTGT(VAS)" name="vasService">
            <CViewInput />
          </Form.Item>
          <Form.Item label="Zone hiện tại" name="zoneChangeHistory">
            <CInput disabled />
          </Form.Item>
          <Form.Item label="Nghị định 13" name="regulation13">
            <CViewLinkInput
              children="Biên bản xác nhận NĐ13"
              onView={() =>
                isAdmin || isIdentification
                  ? setIsOpenFile(true)
                  : setIsOpenIdentification(true)
              }
            />
          </Form.Item>
        </Col>
      </Row>
      <SubscriberStatusModal
        isOpen={isOpenSubscriberStatus}
        setIsOpen={setIsOpenSubscriberStatus}
      />
      <IdentificationModal
        isOpen={isOpenIdentification}
        setIsOpen={setIsOpenIdentification}
        callback={() => setIsOpenFile(true)}
      />
      <EmailModal isOpen={isOpenEmail} setIsOpen={setIsOpenEmail} />
      <SearchImageModal
        isOpen={isOpenSearchImage}
        setIsOpen={setIsOpenSearchImage}
      />
      <LastFiveCallModal
        isOpen={isOpenLastFiveCall}
        setIsOpen={setIsOpenLastFiveCall}
      />
      <FileModal
        isOpen={isOpenFile}
        setIsOpen={setIsOpenFile}
        name="regulation13"
      />
    </Card>
  );
};

export default Subscriber;
