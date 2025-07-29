import { TitleHeader } from '@react/commons/Template/style';
import { StyledWrapperPage } from 'apps/Internal/src/modules/ActivateSubscription/pages/styles';
import CustomerInfo from './CustomerInfo';
import { Form } from 'antd';
import InfoSim from './InfoSim';
import Footer from './Footer';
import { useForm } from 'antd/es/form/Form';
import { FC, useEffect } from 'react';
import useStoreListOfRequestsChangeSim from 'apps/Internal/src/modules/ListOfRequestsChangeSim/store';
import { ActionType } from '@react/constants/app';
import { useParams } from 'react-router-dom';
import { useView } from 'apps/Internal/src/modules/ListOfRequestsChangeSim/hooks/useView';

type Props = {
  typeModal: ActionType;
};

const ChangeSimmPage: FC<Props> = ({ typeModal }) => {
  const { id } = useParams();
  const { mutate: mutateGetDetail } = useView();

  const {
    resetGroupStore,
    setFormAntd,
    setChangeSimCode,
    interval,
    timeout,
    disableForm,
  } = useStoreListOfRequestsChangeSim();
  const [form] = useForm();
  const actionAllow = Form.useWatch('actionAllow', form);
  useEffect(() => {
    if (typeModal !== ActionType.ADD && id) {
      mutateGetDetail(id);
      setChangeSimCode(id);
    } else {
      setChangeSimCode();
    }
  }, [typeModal, id]);

  useEffect(() => {
    setFormAntd(form);

    return () => {
      clearTimeout(interval);
      clearTimeout(timeout);
      resetGroupStore();
    };
  }, []);
  return (
    <StyledWrapperPage>
      <TitleHeader>
        Đổi SIM{' '}
        {typeModal === ActionType.ADD
          ? ''
          : form.getFieldValue('requestType') === 'BCSS'
          ? 'Offline'
          : 'Online'}
        {actionAllow === 0 && (
          <span className="text-red-500 text-base">
            (Số thuê bao đang bị cấm tác động)
          </span>
        )}
      </TitleHeader>

      <Form
        form={form}
        layout="horizontal"
        labelCol={{ lg: { span: 12 }, xl: { span: 6 } }}
        labelWrap
        scrollToFirstError
        disabled={disableForm || typeModal === ActionType.VIEW}
        initialValues={{
          requestType: 'BCSS',
        }}
      >
        <CustomerInfo typeModal={typeModal} />
        <InfoSim typeModal={typeModal} />
        <Footer typeModal={typeModal} />
        <Form.Item label="" name="actionAllow" hidden />
      </Form>
    </StyledWrapperPage>
  );
};
export default ChangeSimmPage;
