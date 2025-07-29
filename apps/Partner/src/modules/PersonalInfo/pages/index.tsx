import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonClose, CButtonSave } from '@react/commons/Button';
import {
  Button,
  CInput,
  CModalConfirm,
  CTooltip,
  NotificationSuccess,
} from '@react/commons/index';
import CSelect from '@react/commons/Select';
import { TitleHeader } from '@react/commons/Template/style';
import { IFieldErrorsItem } from '@react/commons/types';
import { base64ImageToBlob } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import { Card, Col, Form, Row, Space, Spin, TableColumnsType } from 'antd';
import { IUserInfo } from 'apps/Partner/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { useGetOrgByUser } from 'apps/Partner/src/hooks/useGetOrgByUser';
import { useListOrgUnit } from 'apps/Partner/src/hooks/useListOrgUnit';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import ModalAuthority from '../components/ModalAuthority';
import { useChangeOrgUser } from '../queryHooks/useChangeOrgUser';
import { useDeleteSignature } from '../queryHooks/useDeleteSignature';
import { useEditProfile } from '../queryHooks/useEditProfile';
import { useEditSignature } from '../queryHooks/useEditSigature';
import { useGetSignature } from '../queryHooks/useGetSigature';
import { ApprovalProcessType, PersonalRoles } from '../type';
const PersonalInfoPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const sigRef = useRef(null);
  const [isSignedImg, setIsSignedImg] = useState<boolean | undefined>();
  const [isOpenAuthority, setIsOpenAuthority] = useState<boolean>(false);
  const { data: listOrgUnit = [], isFetching: isLoadingOrgUnit } =
    useListOrgUnit({ status: 1 });
  const { data: dataSignature, isFetching: isLoadingSignature } =
    useGetSignature();
  const {
    data: dataOrg,
    isFetching: isLoadingOrg,
    refetch: refetchOrg,
  } = useGetOrgByUser();
  const { mutateAsync: mutateSignature, isPending: isLoadingEditSignature } =
    useEditSignature();
  const {
    mutateAsync: mutateDeleteSignature,
    isPending: isLoadingDeleteSignature,
  } = useDeleteSignature();
  const { mutateAsync: updateProfile, isPending: isLoadingEditProfile } =
    useEditProfile();
  const { mutateAsync: mutateChangeOrg, isPending: isLoadingChangeOrg } =
    useChangeOrgUser();
  const [dataAuthority, setDataAuthority] = useState<
    ApprovalProcessType | undefined
  >();
  const data = useGetDataFromQueryKey<IUserInfo>([
    REACT_QUERY_KEYS.GET_PROFILE,
  ]);
  useEffect(() => {
    form.setFieldsValue({
      ...data,
      roles: data?.roles.map((role: PersonalRoles) => role.id),
    });
  }, [data, form]);
  useEffect(() => {
    const currentOrg = dataOrg?.find((e) => e.isCurrent)?.value;
    form.setFieldsValue({
      currentOrg: currentOrg,
      org: dataOrg,
    });
  }, [dataOrg, form]);
  useEffect(() => {
    (sigRef.current as any).clear();
    if (dataSignature) {
      (sigRef.current as any).fromDataURL(dataSignature);
    }
  }, [isLoadingSignature]);

  const handleConfirm = async (values: any) => {
    const { fullname, phoneNumber, currentOrg } = values;
    const sigURL = (sigRef.current as any).getTrimmedCanvas().toDataURL();

    try {
      const signaturePromise =
        isSignedImg === false
          ? mutateDeleteSignature()
          : isSignedImg === true
          ? mutateSignature(base64ImageToBlob(sigURL))
          : Promise.resolve();

      const changeOrgPromise = mutateChangeOrg(currentOrg, {
        onSuccess: () => refetchOrg(),
      });

      const profilePromise = updateProfile({ fullname, phoneNumber });

      await Promise.all([signaturePromise, changeOrgPromise, profilePromise]);

      NotificationSuccess(MESSAGE.G02);
    } catch (err: any) {
      if (err?.errors?.length) {
        form.setFields(
          err.errors.map((e: IFieldErrorsItem) => ({
            field: e.field,
            errors: [e.detail],
          }))
        );
      }
    }
  };
  const roleOptions = useMemo(() => {
    if (data?.roles) {
      return data?.roles.map((roleOption: PersonalRoles) => ({
        label: roleOption.name,
        value: roleOption.id,
      }));
    }
    return [];
  }, [data?.roles]);
  const handleFinish = (values: any) => {
    CModalConfirm({
      message: MESSAGE.G04,
      onOk: () => {
        handleConfirm(values);
      },
    });
  };
  const handleCancel = () => {
    navigate(-1);
  };

  const handleResetSign = () => {
    setIsSignedImg(false);
    (sigRef.current as any).clear();
  };

  const handleOpenAuthority = (record: ApprovalProcessType) => {
    setIsOpenAuthority(true);
    setDataAuthority(record);
  };
  const columns: TableColumnsType<ApprovalProcessType> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 50,
      render: (_, __, idx: number) => {
        return <div>{++idx}</div>;
      },
    },
    {
      title: 'Quy trình',
      dataIndex: 'processName',
      width: 160,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Đơn vị',
      dataIndex: 'orgId',
      width: 130,
      render: (value: number) => {
        const unitName = listOrgUnit.find((e) => e.value === value)?.label;
        return <CTooltip title={unitName}>{unitName}</CTooltip>;
      },
    },
    {
      title: 'Cấp phê duyệt',
      dataIndex: 'stepOrder',
      width: 100,
      render: (value: number) => {
        return <span>{`Cấp ${value}`}</span>;
      },
    },
    {
      title: 'Thao tác',
      dataIndex: 'id',
      width: 100,
      align: 'center',
      render: (value, record: ApprovalProcessType) => (
        <Space size="middle">
          <Button type="default" onClick={() => handleOpenAuthority(record)}>
            Ủy quyền phê duyệt
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <>
      <TitleHeader>{`Thông tin tài khoản`}</TitleHeader>
      <Spin
        spinning={
          isLoadingOrgUnit ||
          isLoadingSignature ||
          isLoadingEditSignature ||
          isLoadingOrg ||
          isLoadingEditProfile ||
          isLoadingDeleteSignature ||
          isLoadingChangeOrg
        }
      >
        <Form
          form={form}
          colon={false}
          onFinish={handleFinish}
          labelCol={{ flex: '130px' }}
        >
          <Card className="mb-5">
            <div className="font-bold text-base text-primary mb-5">
              Thông tin tài khoản
            </div>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="Họ và tên"
                  name="fullname"
                  rules={[validateForm.required]}
                >
                  <CInput maxLength={50} placeholder="Họ và tên" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Username" name="username">
                  <CInput maxLength={100} disabled placeholder="Username" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Email" name="email">
                  <CInput maxLength={100} disabled placeholder="Email" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Vai trò" name="roles">
                  <CSelect
                    options={roleOptions}
                    disabled
                    placeholder="Vai trò"
                    mode="multiple"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Kho hiện tại" name="currentOrg">
                  <CSelect options={dataOrg} placeholder="Chọn kho" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Kho" name="org" rules={[]}>
                  <CSelect
                    options={dataOrg}
                    disabled
                    placeholder="Kho"
                    mode="multiple"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Chữ ký" name="type" rules={[]}>
                  <div className="flex border-2 rounded-lg border-gray-300	mb-1">
                    <SignatureCanvas
                      velocityFilterWeight={1}
                      ref={sigRef}
                      canvasProps={{
                        className: 'sigCanvas w-full h-[180px]',
                      }}
                      onEnd={() => setIsSignedImg(true)}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      size="lg"
                      className="absolute right-3 bottom-3 cursor-pointer z-10"
                      title="Xóa"
                      onClick={handleResetSign}
                    />
                  </div>{' '}
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Row justify="end" className="mt-4">
            <Space size="middle">
              <CButtonSave htmlType="submit">Lưu</CButtonSave>
              <CButtonClose type="default" onClick={handleCancel} />
            </Space>
          </Row>
        </Form>
      </Spin>
      <ModalAuthority
        data={dataAuthority}
        isOpen={isOpenAuthority}
        setIsOpen={setIsOpenAuthority}
      />
    </>
  );
};

export default PersonalInfoPage;
