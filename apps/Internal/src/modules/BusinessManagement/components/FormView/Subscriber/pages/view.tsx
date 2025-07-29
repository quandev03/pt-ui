import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Form, Row, Space, Spin } from 'antd';
import { TitleHeader } from '@react/commons/Template/style';
import { useEffect, useState } from 'react';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import CButton, { CButtonClose } from '@react/commons/Button';
import { ModelStatus } from '@react/commons/types';
import { ActionsTypeEnum, DateFormat } from '@react/constants/app';
import useSubscriberStore from '../store';
import { useDetailSubscriberQuery } from '../hooks/useDetailSubscriberQuery';
import { ImpactStatus } from 'apps/Internal/src/modules/SearchSubscription/types';
import SubscriberModal from '../components/SubscriberModal';
import CancelSubscriberModal from '../components/CancelSubscriberModal';
import Customer from '../components/Customer';
import Subscriber from '../components/Subscriber';
import { getDate } from '@react/utils/datetime';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import Contract from '../components/Contract';
import ImpactModal from '../components/ImpactModal';
import Enterprise from '../components/Enterprise';

const ViewSubscriberPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const [form] = Form.useForm();
  const actions = useRolesByRouter();
  const [isOpenImpact, setIsOpenImpact] = useState(false);
  const [isOpenSubscriber, setIsOpenSubscriber] = useState(false);
  const [isOpenCancelSubscriber, setIsOpenCancelSubscriber] = useState(false);
  const { setSubId } = useSubscriberStore();
  const { isLoading, data } = useDetailSubscriberQuery(id, state.subId);
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
      });
    }
  }, [data, simTypeData]);

  return (
    <>
      <TitleHeader>
        Thông tin chi tiết thuê bao{' '}
        {!isLoading && data?.actionAllow !== ImpactStatus.OPEN && (
          <span className="text-red-500 text-base">
            (Số thuê bao đang bị cấm tác động)
          </span>
        )}
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
              {actions.includes(ActionsTypeEnum['BLOCK/UNBLOCK_SUBCRIBER']) && (
                <CButton
                  disabled={disabled}
                  onClick={() => {
                    setIsOpenSubscriber(true);
                    setSubId(state.subId);
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
                    setSubId(state.subId);
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
            <Contract />
            <Enterprise />
          </Space>
          <Row justify="end">
            <CButtonClose onClick={() => navigate(-1)} />
          </Row>
        </Form>
      </Spin>
      <ImpactModal isOpen={isOpenImpact} setIsOpen={setIsOpenImpact} />
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

export default ViewSubscriberPage;
