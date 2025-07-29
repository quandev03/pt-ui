import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  CInput,
  CSelect,
  CTextArea,
  NotificationError,
  NotificationSuccess,
} from '@react/commons/index';
import {
  AnyElement,
  IErrorResponse,
  IFieldErrorsItem,
  OptionsType,
} from '@react/commons/types';
import validateForm from '@react/utils/validator';
import { Col, Flex, Form, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useState } from 'react';
import { useConfirmOtp } from '../../../ActivateSubscription/hooks/useConfirmOtp';
import { useGetOtp } from '../../../ActivateSubscription/hooks/useGetOtp';
import { ContractTypeEnum } from '../../hooks/useDetailContract';
import { SignEnum, useGenContractNo } from '../../hooks/useGenContractNo';
import {
  default as useOwnershipTransferStore,
  default as useStoreOwnershipTransfer,
} from '../../store';
import '../../index.scss';
import { useGenContract } from '../../hooks/useGenContract';
import { useCheckCustomerInfor } from '../../hooks/useCheckCustomerInfor';
import { DocumentTypeEnum } from '../../types';
import { MESSAGE } from '@react/utils/message';
import { formatDate } from '@react/constants/moment';
import formInstance from '@react/utils/form';

export const scrollErrorField = () => {
  setTimeout(() => {
    const firstErrorField = document.querySelector('.ant-form-item-has-error');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }
  }, 100);
};

const CheckOtp = () => {
  const form = Form.useFormInstance();
  const {
    isShowSignLink,
    setIsShowSignLink,
    countFailOtp,
    setCountFailOtp,
    isChangeInfoOcr,
    setDisableButtonCheck,
    isDisableButtonCheck,
    setTypeOfGenContract,
  } = useOwnershipTransferStore();
  const { dataTransfereeInfo: data } = useStoreOwnershipTransfer();
  const [counter, setCounter] = React.useState(-1);
  const {
    oldLink,
    newLink,
    transfereeOtp,
    transfereePhoneNumber,
    id,
    otpReason,
    isShowNewOTP,
  } = Form.useWatch((value) => value, form) ?? {};
  const [phoneOptions, setPhoneOptions] = useState<OptionsType[]>([]);
  const [expireTime, setExpireTime] = useState<string>('');
  const { mutate: mutateSendOtp, data: dataOtp } = useGetOtp();
  const { mutate: mutateConfirmOtp } = useConfirmOtp();
  const { mutate: mutateGenContractNo } = useGenContractNo();
  const { mutate: mutateGenContract } = useGenContract();
  const [checkSendOtp, setCheckSendOtp] = useState<boolean>(false);

  const setFieldError = useCallback(
    (fieldErrors: IFieldErrorsItem[]) => {
      form.setFields(
        fieldErrors.map((item: IFieldErrorsItem) => ({
          name: item.field,
          errors: [item.detail],
        }))
      );
    },
    [form]
  );

  const { mutate: checkCustomerInfor } = useCheckCustomerInfor(() => {
    console.log('sign success');
  }, setFieldError);

  React.useEffect(() => {
    if (data?.list_phoneNumber.length > 0) {
      form.setFieldsValue({
        transfereePhoneNumber: data?.list_phoneNumber[0],
      });
      setPhoneOptions(
        data?.list_phoneNumber?.map((e: string) => ({ label: e, value: e }))
      );
    }
  }, [data?.list_phoneNumber]);

  React.useEffect(() => {
    if (data.list_phoneNumber?.length === 0) {
      setCounter(-1);
      setExpireTime('');
      return;
    }
    if (counter < 0) return;
    const id = setTimeout(() => {
      setCounter(counter - 1);
    }, 1000);
    setExpireTime(
      counter > 0
        ? `Thời gian hết hạn ${dayjs()
            .startOf('day')
            .add(counter, 'second')
            .format('mm:ss')}`
        : 'OTP đã hết hạn'
    );
    return () => {
      clearTimeout(id);
    };
  }, [counter, data.list_phoneNumber?.length]);

  const handleSendOtp = () => {
    mutateSendOtp(
      { isdn: transfereePhoneNumber, idEkyc: data.id_ekyc },
      {
        onSuccess() {
          NotificationSuccess('Gửi OTP thành công');
          setCounter(120);
          setCountFailOtp(0);
          setCheckSendOtp(true);
        },
        onError() {
          setCheckSendOtp(false);
        }
      }
    );
  };
  const handleConfirmOtp = () => {
    if (!transfereeOtp) return;
    const payload = dataOtp;
    mutateConfirmOtp(
      { ...payload, otp: transfereeOtp, idNo: id },
      {
        onSuccess: () => {
          NotificationSuccess('Xác thực OTP thành công');
          setIsShowSignLink(true);
          setExpireTime('');
          setCountFailOtp(0);
          setCounter(-1);
        },
        onError: (error: AnyElement) => {
          setCountFailOtp(countFailOtp + 1);
          form.setFields([{ name: 'transfereeOtp', errors: [error.detail] }]);
        },
      }
    );
  };

  const handleCreateContract = (
    activeType: SignEnum,
    contractType?: ContractTypeEnum
  ) => {
    if (isDisableButtonCheck) {
      handleGetContract(activeType, contractType);
      return;
    }
    form
      .validateFields([
        'transferorAddress',
        'transferorDateOfBirth',
        'city',
        'district',
        'documentType',
        'expiry',
        'idExpiryDateNote',
        'transferorIdNo',
        'id_ekyc',
        'transferorPlaceOfIssue',
        'transferorDateOfIssue',
        'transferorName',
        'transferorSex',
        'ward',
        'cusType',
      ])
      .then((value) => {
        const {
          transferorAddress,
          appObject,
          transferorDateOfBirth,
          city,
          district,
          expiry,
          transferorIdNo,
          isdn,
          transferorPlaceOfIssue,
          transferorDateOfIssue,
          transferorName,
          transferorSex,
          ward,
          documentType,
          cusType,
          idExpiryDateNote,
        } = form.getFieldsValue();
        if (documentType === DocumentTypeEnum.CMND) {
          NotificationError(MESSAGE.G39);
          return;
        }
        if (!expiry && !idExpiryDateNote) {
          NotificationError(MESSAGE.G40);
          return;
        }
        checkCustomerInfor(
          {
            isdn,
            idType: documentType,
            name: transferorName,
            idNo: transferorIdNo,
            issueBy: transferorPlaceOfIssue,
            issueDate: transferorDateOfIssue
              ? dayjs(transferorDateOfIssue).format(formatDate)
              : '',
            birthday: transferorDateOfBirth
              ? dayjs(transferorDateOfBirth).format(formatDate)
              : '',
            sex: transferorSex,
            address: transferorAddress,
            city,
            district,
            ward,
            expiry: expiry ? dayjs(expiry).format(formatDate) : '',
            appObject,
            cusType,
          },
          {
            onSuccess: () => {
              setDisableButtonCheck(true);
              handleGetContract(activeType, contractType);
            },
            onError: (err: any) => {
              formInstance.getFormError(form, err?.errors);
              scrollErrorField();
            },
          }
        );
      });
  };

  const handleGetContract = (
    activeType: SignEnum,
    contractType?: ContractTypeEnum
  ) => {
    form
      .validateFields([
        'isdn',
        'transfereeDocument',
        'transfereeName',
        'transfereeIdNo',
        'transfereeDateOfIssue',
        'transfereeDateOfBirth',
        'transfereePlaceOfIssue',
        'transfereeSex',
        'transfereeAddress',
        'transfereeCity',
        'transfereeDistrict',
        'transfereeWard',
      ])
      .then(() => {
        console.log(isChangeInfoOcr, 'test');
        if (!isChangeInfoOcr) {
          mutateGenContractNo({
            idNo: data.id,
            activeType,
            contractType,
          });
        } else {
          mutateGenContract({
            ...form.getFieldsValue(),
            activeType,
            contractType,
          });
        }
      })
      .catch(() => scrollErrorField());
  };

  const afterSignValid = (callBack: () => void) => {
    form
      .validateFields()
      .then(() => {
        callBack();
      })
      .catch((err: any) => {
        const { errorFields = [] } = err;

        if (
          errorFields.length === 1 &&
          errorFields.some((e: any) => e.name.includes('fileND13'))
        ) {
          callBack();
        }
        form.setFields([
          {
            name: 'fileND13',
            errors: [],
          },
        ]);
        scrollErrorField();
      });
  };

  return (
    <>
      {isShowNewOTP && (
        <fieldset className="bg-white">
          <legend>Kiểm tra OTP</legend>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label="SĐT nhận OTP"
                name="transfereePhoneNumber"
                rules={[validateForm.required]}
              >
                <CSelect
                  disabled={isShowSignLink}
                  options={phoneOptions}
                  placeholder="Chọn SĐT nhận OTP"
                  maxCount={1}
                  allowClear={false}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Button
                disabled={isShowSignLink}
                onClick={handleSendOtp}
                className="w-[8.5rem]"
              >
                Gửi OTP
              </Button>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Nhập OTP"
                name="transfereeOtp"
                rules={[
                  data.check_sendOTP && !otpReason ? validateForm.required : {},
                  validateForm.maxLength(10),
                ]}
                dependencies={['otpReason']}
              >
                <CInput
                  disabled={isShowSignLink || !checkSendOtp}
                  placeholder="Nhập OTP"
                  onlyNumber
                  maxLength={10}
                />
              </Form.Item>
              {!!expireTime && countFailOtp < 6 && (
                <Form.Item label=" " name="expireTime" className="-mt-3">
                  <Typography.Text type="danger">{expireTime}</Typography.Text>
                </Form.Item>
              )}
            </Col>
            <Col span={12}>
              <Button
                disabled={!transfereeOtp || isShowSignLink || countFailOtp >= 6}
                onClick={handleConfirmOtp}
                className="w-[8.5rem]"
              >
                Xác thực OTP
              </Button>
            </Col>
            <Col span={24}>
              <Form.Item
                label={
                  <div className="flex flex-col justify-center">
                    <span>Lý do không xác thực OTP</span>
                    <span className="text-[13px]">
                      (bắt buộc nếu không nhập OTP)
                    </span>
                  </div>
                }
                labelCol={{ prefixCls: 'ownership-transfer--otp-reason' }}
                name="otpReason"
                rules={[
                  data.check_sendOTP && !transfereeOtp
                    ? validateForm.required
                    : {},
                ]}
                dependencies={['transfereeOtp']}
              >
                <CTextArea
                  autoSize={{ minRows: 3, maxRows: 5 }}
                  placeholder="Nhập nội dung"
                  maxLength={200}
                />
              </Form.Item>
            </Col>
          </Row>
        </fieldset>
      )}
      <fieldset className="bg-white mb-0">
        <legend>Thông tin ký</legend>
        <Row gutter={[12, 12]}>
          <Col span={8}>
            <Flex align="center">
              <div className="w-[160px]">Biên bản xác nhận</div>
              <Button
                disabled={false}
                onClick={() => {
                  afterSignValid(() => {
                    handleCreateContract(
                      SignEnum.OFFLINE,
                      ContractTypeEnum.XAC_NHAN
                    );
                    setTypeOfGenContract(ContractTypeEnum.XAC_NHAN);
                  });
                }}
                className="w-[8.5rem]"
              >
                Tạo biểu mẫu
              </Button>
            </Flex>
          </Col>
          <Col span={8}>
            <Flex align="center">
              <div className="w-[160px]">Phiếu yêu cầu CCQ</div>
              <Button
                disabled={false}
                onClick={() => {
                  afterSignValid(() => {
                    handleCreateContract(
                      SignEnum.OFFLINE,
                      ContractTypeEnum.YEU_CAU
                    );
                    setTypeOfGenContract(ContractTypeEnum.YEU_CAU);
                  });
                }} //1 là Online, 2 là offline
                className="w-[8.5rem]"
              >
                Tạo biểu mẫu
              </Button>
            </Flex>
          </Col>
          <Col span={8}>
            <Flex align="center">
              <div className="w-[160px]">Bản cam kết chính chủ</div>
              <Button
                disabled={false}
                onClick={() => {
                  afterSignValid(() => {
                    handleCreateContract(
                      SignEnum.OFFLINE,
                      ContractTypeEnum.CAM_KET
                    );
                    setTypeOfGenContract(ContractTypeEnum.CAM_KET);
                  });
                }} //1 là Online, 2 là offline
                className="w-[8.5rem]"
              >
                Tạo biểu mẫu
              </Button>
            </Flex>
          </Col>
          <Col span={8}>
            <Flex align="center">
              <div className="w-[160px]">Link ký</div>
              <Button
                disabled={false}
                onClick={() => {
                  afterSignValid(() => {
                    handleCreateContract(SignEnum.ONLINE);
                  });
                }} //1 là Online, 2 là offline
                className="w-[8.5rem]"
              >
                Tạo link ký
              </Button>
            </Flex>
          </Col>
          <Col span={16}>
            <Form.Item
              label="Khách hàng cũ"
              labelCol={{ prefixCls: 'w-[160px]' }}
              name="oldLink"
              rules={[]}
            >
              <CInput
                disabled={true}
                placeholder="Link ký"
                suffix={
                  oldLink ? (
                    <FontAwesomeIcon
                      icon={faCopy}
                      size="xl"
                      onClick={() => {
                        navigator.clipboard.writeText(oldLink);
                        NotificationSuccess('Copy thành công');
                      }}
                      className="cursor-pointer"
                      title="Copy"
                    />
                  ) : undefined
                }
              />
            </Form.Item>
            <Form.Item
              label="Khách hàng mới"
              labelCol={{ prefixCls: 'w-[160px]' }}
              name="newLink"
              rules={[]}
            >
              <CInput
                disabled={true}
                placeholder="Link ký"
                suffix={
                  newLink ? (
                    <FontAwesomeIcon
                      icon={faCopy}
                      size="xl"
                      onClick={() => {
                        navigator.clipboard.writeText(newLink);
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
        </Row>
      </fieldset>
    </>
  );
};

export default CheckOtp;
