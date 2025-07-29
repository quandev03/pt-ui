/* eslint-disable @typescript-eslint/ban-ts-comment */
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
import CTable from '@react/commons/Table';
import { TitleHeader } from '@react/commons/Template/style';
import { IFieldErrorsItem } from '@react/commons/types';
import { base64ImageToBlob } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import { Card, Col, Form, Row, Space, Spin, TableColumnsType } from 'antd';
import { IUserInfo } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { useListOrgUnit } from 'apps/Internal/src/hooks/useListOrgUnit';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { useGetOrgByUser } from '../../../hooks/useGetOrgByUser';
import ModalAuthority from '../components/ModalAuthority';
import { useChangeOrgUser } from '../hooks/useChangeOrgUser';
import { useDeleteSignature } from '../hooks/useDeleteSignature';
import { useEditProfile } from '../hooks/useEditProfile';
import { useEditSignature } from '../hooks/useEditSigature';
import { useGetSignature } from '../hooks/useGetSigature';
import {
  ApprovalProcessType,
  useListApprovalProcess,
} from '../hooks/useListApprovalProcess';
import '../index.scss';

const PersonalInfoPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const sigRef = useRef(null);
  const [isSignedImg, setIsSignedImg] = useState<boolean | undefined>();
  const [isOpenAuthority, setIsOpenAuthority] = useState<boolean>(false);
  const currentUser = useGetDataFromQueryKey<IUserInfo>([
    REACT_QUERY_KEYS.GET_PROFILE,
  ]);
  const { data: listApprovalProcess, isFetching: isLoadingProcess } =
    useListApprovalProcess(currentUser?.id);
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
  const { mutateAsync: mutateProfile, isPending: isLoadingEditProfile } =
    useEditProfile();
  const { mutateAsync: mutateChangeOrg, isPending: isLoadingChangeOrg } =
    useChangeOrgUser();
  const [dataAuthority, setDataAuthority] = useState<
    ApprovalProcessType | undefined
  >();
  useEffect(() => {
    form.setFieldsValue({
      ...currentUser,
      roles: currentUser?.roles.map((role) => role.id),
    });
  }, [currentUser]);
  useEffect(() => {
    const currentOrg = dataOrg?.find((e) => e.isCurrent)?.value;
    form.setFieldsValue({
      currentOrg: currentOrg,
      org: dataOrg,
    });
  }, [dataOrg]);

  useEffect(() => {
    (sigRef.current as any).clear();
    if (dataSignature) {
      (sigRef.current as any).fromDataURL(dataSignature);
    }
  }, [isLoadingSignature]);

  const handleConfirm = async (values: any) => {
    const { fullname, phoneNumber, currentOrg } = values;
    const sigURL = (sigRef.current as any).getTrimmedCanvas().toDataURL();

    const updateTasks = [
      // Handle signature update
      handleSignatureUpdate(isSignedImg, sigURL),

      // Handle organization change
      handleOrgChange(currentOrg, dataOrg),

      // Update profile
      mutateProfile({ fullname, phoneNumber }),
    ];

    try {
      await Promise.all(updateTasks.filter(Boolean));
      NotificationSuccess(MESSAGE.G02);
    } catch (err: any) {
      handleFormErrors(err, form);
    }
  };

  // Helper functions
  const handleSignatureUpdate = (
    isSignedImg: boolean | undefined,
    sigURL: string
  ) => {
    if (isSignedImg === false) {
      return mutateDeleteSignature();
    }
    if (isSignedImg === true) {
      return mutateSignature(base64ImageToBlob(sigURL));
    }
    return undefined;
  };

  const handleOrgChange = (currentOrg: any, dataOrg: any) => {
    const currentOrgValue = dataOrg?.find((e: any) => e.isCurrent)?.value;
    if (currentOrg !== currentOrgValue) {
      return mutateChangeOrg(currentOrg, { onSuccess: () => refetchOrg() });
    }
    return undefined;
  };

  const handleFormErrors = (err: any, form: any) => {
    if (err?.errors?.length) {
      form.setFields(
        err.errors.map((e: IFieldErrorsItem) => ({
          field: e?.field,
          errors: [e?.detail],
        }))
      );
    }
  };

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
          isLoadingProcess ||
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
          labelCol={{ prefixCls: 'profile--form-label' }}
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
                <Form.Item
                  label="SĐT"
                  name="phoneNumber"
                  rules={[validateForm.lengthNumber(10)]}
                >
                  <CInput
                    onlyNumber
                    preventSpace
                    maxLength={10}
                    placeholder="Số điện thoại"
                    minLength={10}
                  />
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
                    options={currentUser?.roles.map((role) => {
                      return {
                        label: role.name,
                        value: role.id,
                      };
                    })}
                    disabled
                    placeholder="Vai trò"
                    mode="multiple"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Kho" name="org">
                  <CSelect
                    options={dataOrg}
                    disabled
                    placeholder="Kho"
                    mode="multiple"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Kho hiện tại" name="currentOrg">
                  <CSelect
                    options={dataOrg}
                    placeholder="Chọn kho"
                    allowClear={true}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Nhóm tài khoản" name="groups">
                  <CSelect
                    options={currentUser?.groups.map((group) => {
                      return {
                        label: group.name,
                        value: group.id,
                      };
                    })}
                    disabled
                    placeholder="Nhóm tài khoản"
                    mode="multiple"
                  />
                </Form.Item>
              </Col>
              <Col span={12} />
              <Col span={12}>
                <Form.Item label="Chữ ký" name="type" rules={[]}>
                  <div className="flex border-2 rounded-lg border-gray-300	mb-1">
                    {/* @ts-expect-error */}
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
                      className="absolute right-3 bottom-3 cursor-pointer"
                      title="Xóa"
                      onClick={handleResetSign}
                    />
                  </div>
                </Form.Item>
              </Col>
              <Col span={24}>
                <div className="font-bold text-base text-primary mb-5">
                  Quy trình phê duyệt phụ trách
                </div>
                <CTable
                  rowKey={'id'}
                  columns={columns}
                  dataSource={listApprovalProcess}
                  scroll={{ y: 450 }}
                />
              </Col>
            </Row>
            <Row justify="end" className="mt-4">
              <Space size="middle">
                <CButtonClose type="default" onClick={handleCancel} />
                <CButtonSave htmlType="submit">Lưu</CButtonSave>
              </Space>
            </Row>
          </Card>
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
