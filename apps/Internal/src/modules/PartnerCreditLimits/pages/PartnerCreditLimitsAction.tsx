import CButton, {
  CButtonClose,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import { CNumberInput } from '@react/commons/index';
import CSelect from '@react/commons/Select';
import CTableUploadFile, { FileData } from '@react/commons/TableUploadFile';
import Show from '@react/commons/Template/Show';
import { TitleHeader } from '@react/commons/Template/style';
import CTextArea from '@react/commons/TextArea';
import { ACTION_MODE_ENUM, IFieldErrorsItem } from '@react/commons/types';
import { ActionsTypeEnum } from '@react/constants/app';
import useActionMode from '@react/hooks/useActionMode';
import { useQueryClient } from '@tanstack/react-query';
import { Col, Form, Row, Spin } from 'antd';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useGetFileDownload } from 'apps/Internal/src/hooks/useGetFileDownload';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HistoryChangeLimits from '../components/HistoryChangeLimits';
import {
  useGetPartnerWithoutLimits,
  useSupportCreatePartnerCreditLimits,
  useSupportGetPartnerLimitsId,
  useSupportPutPartnerCreditLimits,
} from '../hooks';
import { IPayloadCreateForm } from '../type';

const PartnerCreditLimitsAction = () => {
  const actionMode = useActionMode();
  const queryClient = useQueryClient();
  const { mutate: getFileDownload } = useGetFileDownload();
  const [form] = Form.useForm();
  const actionByRole = useRolesByRouter();
  const navigate = useNavigate();
  const [isSubmitBack, setIsSubmitBack] = useState(false);
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
  const { mutate: putPartnerLimits, isPending: loadingUpdate } =
    useSupportPutPartnerCreditLimits(() => {
      console.log(isSubmitBack);
      if (isSubmitBack) {
        handleClose();
      } else {
        form.resetFields();
        form.setFieldValue('status', 1);
      }
    }, setFieldError);
  const { mutate: createPartnerLimits, isPending: loadingCreate } =
    useSupportCreatePartnerCreditLimits(() => {
      if (isSubmitBack) {
        handleClose();
      } else {
        form.resetFields();
        form.setFieldValue('status', 1);
        queryClient.invalidateQueries({
          queryKey: [REACT_QUERY_KEYS.getPartnerNoLimit],
        });
      }
    }, setFieldError);

  const {
    mutate: getPartnerLimitsId,
    isPending: loadingPartnerLimitsId,
    data: partnerLimits,
  } = useSupportGetPartnerLimitsId((data) => {
    form.setFieldsValue({
      ...data,
      orgId: data.orgId,
      files: data.attachments.map((item) => ({
        name: item.fileName,
        desc: item.description,
        size: item.fileVolume,
        id: item.id,
        date: item.createdDate ? dayjs(item.createdDate) : '',
      })),
    });
    form.validateFields();
  });
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      getPartnerLimitsId(id);
    }
  }, [id, actionMode]);

  const { data: listOrganization } = useGetPartnerWithoutLimits();
  const optionOrganization = useMemo(() => {
    if (!listOrganization) {
      return [];
    }
    if (actionMode === ACTION_MODE_ENUM.CREATE) {
      return listOrganization.map((item) => ({
        label: item.orgName,
        value: item.id,
      }));
    }
    if (partnerLimits) {
      return [
        {
          label: partnerLimits.orgName,
          value: partnerLimits.orgId,
        },
      ];
    }
    return [];
  }, [listOrganization, partnerLimits, actionMode]);

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const Title = useMemo(() => {
    switch (actionMode) {
      case ACTION_MODE_ENUM.VIEW:
        return 'Xem chi tiết hạn mức đối tác';
      case ACTION_MODE_ENUM.CREATE:
        return 'Tạo hạn mức đối tác';
      case ACTION_MODE_ENUM.EDIT:
        return 'Điều chỉnh hạn mức';
      default:
        return 'Tạo hạn mức đối tác';
    }
  }, [actionMode]);

  const handleFinish = (values: IPayloadCreateForm) => {
    const files = form.getFieldValue('files');
    if (actionMode === ACTION_MODE_ENUM.CREATE) {
      createPartnerLimits({ ...values, files });
    } else if (actionMode === ACTION_MODE_ENUM.EDIT) {
      putPartnerLimits({ ...values, files, id: id as string });
    }
  };

  const handleDownloadFile = (file: FileData) => {
    if (file.id) {
      getFileDownload({
        id: file.id as number,
        fileName: file?.name ?? '',
      });
    }
  };
  return (
    <div className="flex flex-col w-full h-full mb-7 ">
      <TitleHeader>{Title}</TitleHeader>
      <Spin spinning={loadingPartnerLimitsId}>
        <Form
          form={form}
          labelCol={{ flex: '100px' }}
          labelWrap
          colon={false}
          validateTrigger={['onSubmit']}
          onFinish={handleFinish}
        >
          <div className="bg-white p-5 rounded-md">
            <Row gutter={[30, 0]}>
              <Col span={12}>
                <Form.Item
                  label="Đối tác"
                  name="orgId"
                  required
                  rules={[
                    {
                      validator(_, value) {
                        if (!value || value.length === 0) {
                          return Promise.reject(
                            'Không được để trống trường này'
                          );
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <CSelect
                    placeholder="Chọn đối tác"
                    options={optionOrganization}
                    disabled={actionMode !== ACTION_MODE_ENUM.CREATE}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Hạn mức"
                  name="limitAmount"
                  required
                  rules={[
                    {
                      validator(_, value) {
                        if (!value || value.length === 0) {
                          return Promise.reject(
                            'Không được để trống trường này'
                          );
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <CNumberInput
                    placeholder={'Nhập hạn mức'}
                    addonAfter="VND"
                    disabled={actionMode === ACTION_MODE_ENUM.VIEW}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Ghi chú" name="description">
                  <CTextArea
                    placeholder="Nhập ghi chú"
                    maxLength={200}
                    disabled={actionMode === ACTION_MODE_ENUM.VIEW}
                  />
                </Form.Item>
              </Col>
              <Col span={24} className="mt-3">
                <CTableUploadFile
                  acceptedFileTypes="*"
                  disabled={actionMode === ACTION_MODE_ENUM.VIEW}
                  onDownload={handleDownloadFile}
                />
              </Col>
            </Row>
          </div>
          <Show>
            <Show.When isTrue={actionMode === ACTION_MODE_ENUM.EDIT}>
              <div className="bg-white p-5 rounded-md mt-3">
                <HistoryChangeLimits />
              </div>
            </Show.When>
          </Show>
          <div className="flex gap-4 flex-wrap justify-end mt-7">
            {actionMode === ACTION_MODE_ENUM.CREATE && (
              <CButtonSaveAndAdd
                onClick={() => {
                  form.submit();
                }}
                loading={loadingCreate || loadingUpdate}
                disabled={loadingCreate || loadingUpdate}
              />
            )}
            {actionMode !== ACTION_MODE_ENUM.VIEW &&
              (includes(actionByRole, ActionsTypeEnum.UPDATE) ||
                includes(actionByRole, ActionsTypeEnum.CREATE)) && (
                <CButtonSave
                  onClick={() => {
                    setIsSubmitBack(true);
                    form.submit();
                  }}
                  loading={loadingCreate || loadingUpdate}
                  disabled={loadingCreate || loadingUpdate}
                />
              )}
            {actionMode === ACTION_MODE_ENUM.VIEW && (
              <Show>
                <Show.When
                  isTrue={includes(actionByRole, ActionsTypeEnum.UPDATE)}
                >
                  <CButtonEdit
                    onClick={() => {
                      navigate(pathRoutes.partnerCreditLimitsEdit(id));
                    }}
                  >
                    Chỉnh sửa
                  </CButtonEdit>
                </Show.When>
              </Show>
            )}
            <CButtonClose onClick={handleClose} />
          </div>
        </Form>
      </Spin>
    </div>
  );
};

export default PartnerCreditLimitsAction;
