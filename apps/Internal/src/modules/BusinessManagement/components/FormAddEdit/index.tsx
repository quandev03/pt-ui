import { CButtonClose } from '@react/commons/Button';
import { BodyPage } from '@react/commons/index';
import { TitleHeader } from '@react/commons/Template/style';
import { ActionType } from '@react/constants/app';
import { Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { StyledWrapperPage } from 'apps/Internal/src/modules/ActivateSubscription/pages/styles';
import { useView } from 'apps/Internal/src/modules/BusinessManagement/hooks/useView';
import useStoreBusinessManagement from 'apps/Internal/src/modules/BusinessManagement/store';
import { FC, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useViewHistory } from '../../hooks/useViewEnterpriseHistoryDetail';
import { StyledForm } from '../../page/styles';
import InfoBusiness from './Body/infoBusiness';
import InfoRepresentative from './Body/infoRepresentative';
import Footer from './Footer';

type Props = {
  typeModal: ActionType;
};

const ChangeSimmPage: FC<Props> = ({ typeModal }) => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const { mutate: mutateGetDetail } = useView();
  const { mutate: mutateGetHistory } = useViewHistory();
  const { setFormAntd, changedFields } = useStoreBusinessManagement();
  const [form] = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (typeModal === ActionType.VIEW_ENTERPRISE_HISTORY && id) {
      mutateGetHistory(id);
    } else if (typeModal !== ActionType.ADD && id) {
      mutateGetDetail(id);
    }
    if (typeModal === ActionType.EDIT) {
      form.setFieldsValue({
        idEkyc: 'edit',
      });
    }
  }, [typeModal, id]);

  useEffect(() => {
    setFormAntd(form);
  }, []);

  const renderTitle = () => {
    const name = ' doanh nghiệp';

    switch (typeModal) {
      case ActionType.ADD:
        return 'Tạo' + name;
      case ActionType.EDIT:
        return 'Chỉnh sửa' + name;
      case ActionType.VIEW_ENTERPRISE_HISTORY:
        return 'Xem chi tiết chỉnh sửa doanh nghiệp';
      default:
        return '';
    }
  };
  useEffect(() => {
    if (
      changedFields.length > 0 &&
      typeModal === ActionType.VIEW_ENTERPRISE_HISTORY
    ) {
      form.setFields(
        changedFields.map((field) => ({
          name: field,
          warnings: [''],
        }))
      );
    }
  }, [changedFields]);
  return (
    <StyledWrapperPage>
      <TitleHeader>{renderTitle()}</TitleHeader>
      <BodyPage>
        <StyledForm
          form={form}
          layout="horizontal"
          labelCol={{ lg: { span: 12 }, xl: { span: 6 } }}
          labelWrap
          scrollToFirstError
          disabled={
            typeModal === ActionType.VIEW_ENTERPRISE_HISTORY ||
            typeModal === ActionType.VIEW
          }
          onFieldsChange={(changedFields) => {
            const field = changedFields?.[0]?.name?.[0];
            if (field === 'contract') {
              form.setFieldsValue({
                isChangeContract: true,
              });
            }
            if (field === 'businessLicense') {
              form.setFieldsValue({
                isChangeBusinessLicense: true,
              });
            }
          }}
        >
          <InfoBusiness typeModal={typeModal} />
          <InfoRepresentative typeModal={typeModal} />
          {pathname.includes(pathRoutes.businessManagement) &&
            typeModal !== ActionType.VIEW_ENTERPRISE_HISTORY && (
              <Footer typeModal={typeModal} />
            )}
        </StyledForm>
        {typeModal === ActionType.VIEW_ENTERPRISE_HISTORY && (
          <Row justify="end" className={'mt-5'}>
            <CButtonClose onClick={() => navigate(-1)} />
          </Row>
        )}
      </BodyPage>
    </StyledWrapperPage>
  );
};
export default ChangeSimmPage;
