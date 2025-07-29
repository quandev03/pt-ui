import CButton, { CButtonClose } from '@react/commons/Button';
import { TitleHeader } from '@react/commons/Template/style';
import { Form, Row, Space, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import Subscriber from '../components/Subscriber';
import Customer from '../components/Customer';
import Contract from '../components/Contract';
import { useDetailSubscriptionQuery } from '../hooks/useDetailSubscriptionQuery';
import { useEffect, useState } from 'react';
import { ActionsTypeEnum, DateFormat } from '@react/constants/app';
import { ModelStatus } from '@react/commons/types';
import ImpactModal from '../components/ImpactModal';
import ZoneModal from '../components/ZoneModal';
import PackageModal from '../components/PackageModal';
import ServiceModal from '../components/ServiceModal';
import PromotionModal from '../components/PromotionModal';
import SubscriberModal from '../components/SubscriberModal';
import { useIsAdmin } from '../hooks/useIsAdmin';
import useSubscriptionStore from '../store';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { getDate } from '@react/utils/datetime';
import { ImpactStatus, PromotionStatus } from '../types';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import NotFoundPage from '../../NotFound/page';
import CancelSubscriberModal from '../components/CancelSubscriberModal';
import FeedbackHistory from '../components/FeedbackHistory';
import Enterprise from '../components/Enterprise';
import { pathRoutes } from 'apps/Internal/src/constants/routes';

const ViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const isAdmin = useIsAdmin();
  const actions = useRolesByRouter();
  const feedbackActions = useRolesByRouter(pathRoutes.feedbackCSKH);
  const [isOpenImpact, setIsOpenImpact] = useState(false);
  const [isOpenZone, setIsOpenZone] = useState(false);
  const [isOpenPackage, setIsOpenPackage] = useState(false);
  const [isOpenService, setIsOpenService] = useState(false);
  const [isOpenPromotion, setIsOpenPromotion] = useState(false);
  const [isOpenSubscriber, setIsOpenSubscriber] = useState(false);
  const [isOpenCancelSubscriber, setIsOpenCancelSubscriber] = useState(false);
  const { setIsIdentification, setSubscriberId } = useSubscriptionStore();
  const { isLoading, data } = useDetailSubscriptionQuery(id ?? '', isAdmin);
  const { data: simTypeData } = useGetApplicationConfig('SIM_TYPE');
  const disabled =
    data?.status === ModelStatus.INACTIVE ||
    data?.actionAllow !== ImpactStatus.OPEN;

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        birthDate: getDate(data.birthDate),
        idExpireDate: getDate(data.idExpireDate),
        idIssueDate: getDate(data.idIssueDate),
        kitDate: getDate(data.kitDate),
        activeDate: getDate(data.activeDate, DateFormat.DATE_TIME),
        description: data.description?.replace(/\n/g, ' '),
        simType: simTypeData?.find((item) => item.code === data.simType)?.name,
        status:
          data.status === ModelStatus.ACTIVE ? 'Đang hoạt động' : 'Đã hủy',
        inforNormalizationStatus:
          data.inforNormalizationStatus === 2
            ? 'Đã chuẩn hóa'
            : 'Chưa chuẩn hóa',
        orgCode: 'Chưa có thông tin',
        hlr: 'Chưa có thông tin',
        hlrReset: 'Chưa có thông tin',
        pinAndPuk: 'Chưa có thông tin',
        device: 'Chưa có thông tin',
        accountBalanceChange: 'Chưa có thông tin',
        GTGTService: 'Chưa có thông tin',
        pinChange: 'Chưa có thông tin',
        serviceChange: 'Chưa có thông tin',
        serviceTermination: 'Chưa có thông tin',
        topUpErrorRemoval: 'Chưa có thông tin',
        userFeedback: 'Chưa có thông tin',
        messageHistory1414: 'Chưa có thông tin',
        harassmentHistory: 'Chưa có thông tin',
        bandwidthReductionHistory: 'Chưa có thông tin',
        billAdjustmentHistory: 'Chưa có thông tin',
        serviceRegistrationHistory: 'Chưa có thông tin',
        topUpHistory: 'Chưa có thông tin',
        vasService: 'Chưa có thông tin',
        promotionHistory: data.promotionHistory ?? 'Chưa có thông tin',
      });
    }

    return () => setIsIdentification(false);
  }, [data, simTypeData]);

  if (!isAdmin && data?.status === ModelStatus.INACTIVE) {
    return <NotFoundPage />;
  }

  return (
    <>
      <TitleHeader>
        <Space>
          Thông tin chi tiết thuê bao
          {!isLoading && data?.actionAllow !== ImpactStatus.OPEN && (
            <span className="text-red-500 text-base">
              (Số thuê bao đang bị cấm tác động)
            </span>
          )}
        </Space>
      </TitleHeader>
      <Spin spinning={isLoading}>
        <Form form={form} labelCol={{ span: 8 }} colon={false} labelWrap>
          <Row justify="end" className="mb-5">
            <Space wrap>
              {actions.includes(ActionsTypeEnum.PROHIBIT_IMPACT) && (
                <CButton
                  disabled={data?.status === ModelStatus.INACTIVE}
                  onClick={() => setIsOpenImpact(true)}
                >
                  {data?.actionAllow === ImpactStatus.OPEN ? 'Cấm' : 'Mở'} tác
                  động
                </CButton>
              )}
              {actions.includes(ActionsTypeEnum.CHANGE_ZONE) && (
                <CButton
                  disabled={disabled}
                  onClick={() => {
                    setIsOpenZone(true);
                    setSubscriberId(id);
                  }}
                >
                  Đổi Zone
                </CButton>
              )}
              {actions.includes(
                ActionsTypeEnum.SUBCRIBE_UNSUBCRIBE_PACKAGE
              ) && (
                  <CButton
                    disabled={disabled}
                    onClick={() => {
                      setIsOpenPackage(true);
                      setSubscriberId(id);
                    }}
                  >
                    Đăng ký/Hủy gói cước
                  </CButton>
                )}
              {actions.includes(ActionsTypeEnum.SUBCRIBE_UNSUBCRIBE) && (
                <CButton
                  disabled={disabled}
                  onClick={() => setIsOpenService(true)}
                >
                  Đăng ký/Hủy dịch vụ
                </CButton>
              )}
              {actions.includes(ActionsTypeEnum.CANCEL_CTKM) && (
                <CButton
                  disabled={disabled}
                  onClick={() => {
                    setIsOpenPromotion(true);
                    setSubscriberId(id);
                  }}
                >
                  {data?.registerPromStatus === PromotionStatus.REGISTER
                    ? 'Hủy CTKM'
                    : 'Đăng ký lại CTKM'}
                </CButton>
              )}
              {actions.includes(ActionsTypeEnum['BLOCK/UNBLOCK_SUBCRIBER']) && (
                <CButton
                  disabled={disabled}
                  onClick={() => {
                    setIsOpenSubscriber(true);
                    setSubscriberId(id);
                  }}
                >
                  Chặn/Mở thuê bao
                </CButton>
              )}
              {actions.includes(ActionsTypeEnum.CANCEL_SUBSCRIPTION) && (
                <CButton
                  disabled={disabled}
                  onClick={() => {
                    setIsOpenCancelSubscriber(true);
                    setSubscriberId(id);
                  }}
                >
                  Hủy thuê bao
                </CButton>
              )}
            </Space>
          </Row>
          <Space direction="vertical" size="middle" className="w-full mb-5">
            <Customer />
            <Subscriber />
            {feedbackActions.length !== 0 && <FeedbackHistory />}
            <Contract />
            {data?.enterpriseName && <Enterprise />}
          </Space>
          <Row justify="end">
            <CButtonClose onClick={() => navigate(-1)} disabled={false} />
          </Row>
        </Form>
      </Spin>
      <ImpactModal isOpen={isOpenImpact} setIsOpen={setIsOpenImpact} />
      <ZoneModal isOpen={isOpenZone} setIsOpen={setIsOpenZone} />
      <PackageModal isOpen={isOpenPackage} setIsOpen={setIsOpenPackage} />
      <ServiceModal isOpen={isOpenService} setIsOpen={setIsOpenService} />
      <PromotionModal isOpen={isOpenPromotion} setIsOpen={setIsOpenPromotion} />
      <SubscriberModal
        isOpen={isOpenSubscriber}
        setIsOpen={setIsOpenSubscriber}
      />
      <CancelSubscriberModal
        isOpen={isOpenCancelSubscriber}
        setIsOpen={setIsOpenCancelSubscriber}
      />
    </>
  );
};

export default ViewPage;
