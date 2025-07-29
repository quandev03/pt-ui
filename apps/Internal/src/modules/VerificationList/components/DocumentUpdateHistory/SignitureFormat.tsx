import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton from '@react/commons/Button';
import CInput from '@react/commons/Input';
import { NotificationSuccess } from '@react/commons/Notification';
import { Col, Form, Row } from 'antd';
import { SignEnum, useGenContract } from '../../hooks/useGenContract';
import useCensorshipStore from '../../store';
import ModalPdf from '../ModalPdf';
import { DateFormat } from '@react/constants/app';
import dayjs from 'dayjs';

const SignitureFormat = () => {
  const form = Form.useFormInstance();
  const {
    setIsDisabledContract,
    isOpenModalPdf,
    setOpenModalPdf,
    setIsOffSign,
    interval,
    formAntd: formCensorship,
    deviceToken,
    subDocDetail,
    setIsSignSuccess,
  } = useCensorshipStore();
  const { signLink } = Form.useWatch((value) => value, form) ?? {};
  const { mutate: mutateGenContract } = useGenContract();
  const handleCreateContract = (activeType: SignEnum) => {
    const { new: updateUser } = formCensorship.getFieldsValue();

    console.log('🚀 ~ handleCreateContract ~ updateUser:', updateUser);
    const createdContractDate =
      subDocDetail.listUpdateApproveDoc &&
      subDocDetail.listUpdateApproveDoc.length > 0
        ? subDocDetail.listUpdateApproveDoc[0].subDocumentImageResponses[0]
            ?.createdDate
        : '';
    if (activeType === SignEnum.ONLINE) setIsOffSign(false);

    setIsDisabledContract(false);
    if (interval) {
      clearInterval(interval);
    }
    setIsSignSuccess(false);
    mutateGenContract({
      ...formCensorship.getFieldsValue(),
      ...updateUser,
      ccdvvt: updateUser.ccdvvt,
      id: updateUser.idNo,
      issue_by: updateUser.idIssuePlace,
      createdContractDate,
      phone: '0' + formCensorship.getFieldValue('phoneNumber'),
      customerId: formCensorship.getFieldValue('customerCode'),
      contractNo: subDocDetail.contractNo,
      type: activeType === SignEnum.ONLINE ? 'PNG' : 'PDF', //1 là Online, 2 là offline
      deviceToken: activeType === SignEnum.ONLINE ? deviceToken : undefined,
      packagePlan: subDocDetail.packagePlan,
      birthday: updateUser.birthDate,
      nationality: 'Việt Nam',
      issue_date: updateUser.idIssueDate,
    });
  };
  return (
    <>
      <fieldset>
        <legend>Thông tin hình thức ký</legend>
        <Row gutter={[30, 0]} className="mt-3">
          <Col span={12}>
            <Form.Item label="Link ký" name="signLink">
              <CInput
                disabled={true}
                placeholder="Link ký"
                suffix={
                  signLink ? (
                    <FontAwesomeIcon
                      icon={faCopy}
                      size="xl"
                      onClick={() => {
                        navigator.clipboard.writeText(signLink);
                        NotificationSuccess('Copy thành công');
                      }}
                      className="cursor-pointer"
                      title="Copy"
                    />
                  ) : undefined
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <CButton
              disabled={false}
              onClick={() => handleCreateContract(SignEnum.ONLINE)} //1 là Online, 2 là offline
              className="w-[8.5rem]"
            >
              Tạo link ký
            </CButton>
          </Col>
          <Col span={12}></Col>
          <Col span={12}>
            <CButton
              disabled={false}
              onClick={() => handleCreateContract(SignEnum.OFFLINE)} //1 là Online, 2 là offline
              className="w-[8.5rem]"
            >
              Tạo biểu mẫu
            </CButton>
          </Col>
        </Row>
        <div className="hidden">
          <Form.Item label="" name="pkName" />
        </div>
      </fieldset>
      {isOpenModalPdf && (
        <ModalPdf
          isOpen={isOpenModalPdf}
          setIsOpen={setOpenModalPdf}
          isSigned={true}
        />
      )}
    </>
  );
};
export default SignitureFormat;
