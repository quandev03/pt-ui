import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@react/commons/Button';
import CInput from '@react/commons/Input';
import { NotificationSuccess } from '@react/commons/Notification';
import { Col, Form, Row } from 'antd';
import { scrollErrorField } from 'apps/Internal/src/modules/ActivateSubscription/components/CheckOtp';
import ModalPdf from 'apps/Internal/src/modules/ActivateSubscription/components/ModalPdf';
import {
  SignEnum,
  useGenContractChangeSim,
} from 'apps/Internal/src/modules/ListOfRequestsChangeSim/hooks/useGenContractChangeSim';
import useStoreListOfRequestsChangeSim from 'apps/Internal/src/modules/ListOfRequestsChangeSim/store';

const SignInfo = () => {
  const form = Form.useFormInstance();
  const { mutate: mutateGenContractPNG, isPending: isPendingGenContractPNG } =
    useGenContractChangeSim();
  const { mutate: mutateGenContractPDF, isPending: isPendingGenContractPDF } =
    useGenContractChangeSim();
  const signLink = Form.useWatch('signLink', form);
  const { isOpenModalPdf, setOpenModalPdf, changeSimCode } =
    useStoreListOfRequestsChangeSim();

  const handleCreateContract = (activeType: SignEnum) => {
    form
      .validateFields([
        'cardFront',
        'cardBack',
        'portrait',
        'customerCode',
        'ccdvvt',
        'name',
        'id',
        'issueDate',
        'issueBy',
        'birthday',
        'nationality',
        'receiverAddress',
        'isdn',
        'valueAddedService',
        'dataPackage',
        'lastCardRechargeTime',
        'lastCardRechargeValue',
        'email',
        'serial',
        'sex',
        'reason',
        'oldSerialSim',
        'receiverPhone',
        'simType',
        'balance',
        'stockId',
        'receiverName',
        'receiverPhone',
        'precinct',
        'province',
        'district',
      ])
      .then((value) => {
        if (activeType === SignEnum.PNG) {
          mutateGenContractPNG({
            ...value,
            phoneNumber1: form.getFieldValue('phoneNumber1'),
            phoneNumber2: form.getFieldValue('phoneNumber2'),
            phoneNumber3: form.getFieldValue('phoneNumber3'),
            phoneNumber4: form.getFieldValue('phoneNumber4'),
            phoneNumber5: form.getFieldValue('phoneNumber5'),
            type: activeType,
            changeSimCode,
          });
        } else {
          mutateGenContractPDF({
            ...value,
            type: activeType,
            changeSimCode,
          });
        }
      });
    scrollErrorField();
  };

  return (
    <fieldset className="bg-white">
      <legend>Thông tin ký</legend>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item label="Linh ký" name="signLink">
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
          <Button
            loading={isPendingGenContractPNG}
            onClick={() => {
              form.validateFields().then((value) => {
                handleCreateContract(SignEnum.PNG);
              });
            }}
            className="min-w-[12rem]"
          >
            Tạo link ký
          </Button>
        </Col>
        <Col span={12}></Col>

        <Col span={12}>
          <Button
            loading={isPendingGenContractPDF}
            onClick={() => {
              form.validateFields().then((value) => {
                handleCreateContract(SignEnum.PDF);
              });
            }}
            className="min-w-[12rem]"
          >
            Tạo phiểu yêu cầu
          </Button>
        </Col>
      </Row>

      {isOpenModalPdf && (
        <ModalPdf
          isOpen={isOpenModalPdf}
          setIsOpen={setOpenModalPdf}
          isSigned={true}
          title="Phiếu yêu cầu đổi SIM"
        />
      )}
    </fieldset>
  );
};

export default SignInfo;
