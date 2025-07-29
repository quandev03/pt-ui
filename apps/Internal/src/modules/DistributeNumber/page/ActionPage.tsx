import CButton, {
  CButtonClose,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import Show from '@react/commons/Template/Show';
import { RowButton, TitleHeader } from '@react/commons/Template/style';
import { ACTION_MODE_ENUM, IFieldErrorsItem } from '@react/commons/types';
import { ActionsTypeEnum } from '@react/constants/app';
import { formatDateBe } from '@react/constants/moment';
import useActionMode from '@react/hooks/useActionMode';
import { downloadFile } from '@react/utils/handleFile';
import { MESSAGE } from '@react/utils/message';
import { Card, Col, Form, FormProps, Radio, Row, Spin } from 'antd';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { useDetailDistributeNumber } from 'apps/Internal/src/modules/DistributeNumber/queryHook/useDetailDistributeNumber';
import { IPhoneNumberSelect } from 'apps/Internal/src/modules/DistributeNumber/type';
import dayjs from 'dayjs';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAddDistributeNumber } from '../queryHook/useAddDistributeNumber';
import useError from '../store/useError';
import useSelectListPhoneNumber from '../store/useSelectListPhoneNumbers';

import { CUploadFileTemplate } from '@react/commons/index';
import CRadio from '@react/commons/Radio';
import CSelect from '@react/commons/Select';
import CTableUploadFile, { FileData } from '@react/commons/TableUploadFile';
import CTextArea from '@react/commons/TextArea';
import validateForm from '@react/utils/validator';
import { useWatch } from 'antd/es/form/Form';
import { RadioChangeEvent } from 'antd/lib';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import {
  ApprovalStatus,
  NumberProcessType,
  NumberStockTypes,
  NumberTransactionStatus,
} from 'apps/Internal/src/constants/constants';
import { useDownloadResourceFile } from 'apps/Internal/src/hooks/useGetFileDownload';
import { useGetNumberStocks } from 'apps/Internal/src/hooks/useGetNumberStocks';
import {
  ReasonCodeEnum,
  useListReasonCatalogService,
} from 'apps/Internal/src/hooks/useReasonCatalogService';
import FileUploadPhoneNumber from '../components/FileUploadPhoneNumber';
import { useCancelDistributeNumber } from '../queryHook/useCancelDistributeNumber';
import { useGetActionSample } from '../queryHook/useGetActionSample';
import { API_PATHS } from '../services/url';

type PropsType = {
  isEnabledApproval?: boolean;
};

const ActionPage: FC<PropsType> = ({ isEnabledApproval = false }) => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const actionByRole = useRolesByRouter();
  const actionMode = useActionMode();
  const disableForm = isEnabledApproval || actionMode === ACTION_MODE_ENUM.VIEW;
  const { setError } = useError();
  const [isSubmitBack, setIsSubmitBack] = useState(false);
  const { listPhoneNumber, setListPhoneNumber } = useSelectListPhoneNumber();
  const reasonId = useWatch<NumberProcessType>('reasonId', form);

  const {
    mutate: getDetailDistributeNumber,
    data: detailDistributeNumber,
    isPending: loadingDetail,
  } = useDetailDistributeNumber((data) => {
    form.setFieldsValue({
      ...data,
      transDate: dayjs(data.transDate, formatDateBe),
      processType: data.processType,
      reasonId: data.reasonId,
      numberFile: {
        name: data?.uploadFile?.fileName,
      },
      files: data?.attachments
        ? data?.attachments.map((item) => {
            return {
              ...item,
              file: null,
              desc: item.description,
              name: item.fileName,
              size: item.fileVolume,
              date: item.createdDate ? dayjs(item.createdDate) : '',
            };
          })
        : [],
    });
    setListPhoneNumber(
      data?.lines
        ? data?.lines.map(
            (item) =>
              ({
                id: item.id,
                isdn: item.fromIsdn,
                groupCode: item.groupCode,
                generalFormat: item.generalFormat,
              } as IPhoneNumberSelect)
          )
        : []
    );
  });

  const handleClose = () => {
    form.resetFields();
    navigate(-1);
  };

  useEffect(() => {
    if (id) {
      getDetailDistributeNumber(id);
    }
    return () => {
      setError('');
      setListPhoneNumber([]);
    };
  }, [id]);
  const setFieldError = useCallback(
    (fieldErrors: IFieldErrorsItem[]) => {
      console.log(fieldErrors);
      form.setFields(
        fieldErrors.map((item: IFieldErrorsItem) => ({
          name: item.field,
          errors: [item.detail],
        }))
      );
    },
    [form]
  );
  const { mutate: addDistributeNumber, isPending: loadingAdd } =
    useAddDistributeNumber((data) => {
      if (data instanceof Blob) {
        if (
          data.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
          NotificationError(
            'File tải lên sai thông tin, Vui lòng kiểm tra lại'
          );
          downloadFile(data, 'Ket_qua_phan_phoi.xlsx');
        } else {
          NotificationSuccess(MESSAGE.G01);
          setError('');
          if (isSubmitBack) {
            handleClose();
          } else {
            setListPhoneNumber([]);
            form.resetFields();
            setIsSubmitBack(false);
          }
        }
        return;
      }
    }, setFieldError);
  const navigate = useNavigate();

  const onFinish: FormProps['onFinish'] = useCallback(
    (values: Record<string, any>) => {
      const { processType } = values;
      if (
        listPhoneNumber?.length === 0 &&
        processType === NumberProcessType.INDIVIDUAL
      ) {
        setError('Không được để trống trường này');
        return;
      }

      addDistributeNumber({
        ...values,
        listPhoneNumber,
      });
    },
    [listPhoneNumber]
  );

  const handleNavigatePhoneDistribution = () => {
    navigate(pathRoutes.distributeNumber);
  };

  const title = useMemo(() => {
    switch (actionMode) {
      case ACTION_MODE_ENUM.VIEW:
        return 'Chi tiết phân phối số';
      case ACTION_MODE_ENUM.CREATE:
        return 'Phân phối số';
      default:
        return '';
    }
  }, [actionMode]);

  const { mutate: postCancelDistributeNumber, isPending: loadingCancel } =
    useCancelDistributeNumber(() => {
      if (id) {
        getDetailDistributeNumber(id);
      }
    });

  const processType = useWatch('processType', form);
  const { data: OPTION_STOCK_EXPORT = [] } = useGetNumberStocks(
    [NumberStockTypes.GENERAL],
    true
  );
  const optionStockExport = useMemo(() => {
    if (actionMode === ACTION_MODE_ENUM.VIEW && detailDistributeNumber) {
      return [
        {
          label: detailDistributeNumber.stockName,
          value: detailDistributeNumber.stockId,
        },
      ];
    }
    return OPTION_STOCK_EXPORT;
  }, [actionMode, detailDistributeNumber, OPTION_STOCK_EXPORT]);

  const { data: OPTION_STOCK_IMPORT = [] } = useGetNumberStocks(
    [NumberStockTypes.SPECIFIC, NumberStockTypes.SALE],
    false
  );

  const optionStockImport = useMemo(() => {
    if (actionMode === ACTION_MODE_ENUM.VIEW && detailDistributeNumber) {
      return [
        {
          label: detailDistributeNumber.ieStockName,
          value: detailDistributeNumber.ieStockId,
        },
      ];
    }
    return OPTION_STOCK_IMPORT;
  }, [actionMode, detailDistributeNumber, OPTION_STOCK_IMPORT]);

  const optionReason = useListReasonCatalogService(
    disableForm,
    reasonId,
    ReasonCodeEnum.TRANSFER_NUMBER
  );

  const { mutate } = useGetActionSample();

  const handleSelectionChange = (e: RadioChangeEvent) => {
    setListPhoneNumber([]);
    setError(null);
  };

  const handleExport = () => {
    mutate({
      uri: API_PATHS.GET_SAMPLE,
      filename: 'Danh_sach_phan_phoi_so.xlsx',
    });
  };

  const { mutate: handleDownloadFile } = useDownloadResourceFile();
  const handleDownloadUploadFile = useCallback(() => {
    handleDownloadFile({
      uri: detailDistributeNumber?.uploadFile?.fileUrl ?? '',
      filename: detailDistributeNumber?.uploadFile?.fileName ?? '',
    });
  }, [handleDownloadFile, detailDistributeNumber?.uploadFile?.fileUrl]);
  const handleDownloadAttachment = (record: FileData) => {
    handleDownloadFile({
      uri: record.fileUrl ?? '',
    });
  };

  return (
    <Form
      form={form}
      labelCol={{ flex: '130px' }}
      labelAlign="left"
      labelWrap
      colon={false}
      onFinish={onFinish}
      initialValues={{ processType: NumberProcessType.INDIVIDUAL }}
    >
      <TitleHeader>{title}</TitleHeader>
      <Spin spinning={loadingDetail || loadingAdd || loadingCancel}>
        <Card>
          <>
            <Row gutter={[12, 0]} className="mb-5">
              <Col span={12}>
                <Form.Item
                  labelAlign="left"
                  label="Kho xuất"
                  name="stockId"
                  rules={[validateForm.required]}
                >
                  <CSelect
                    onChange={() => {
                      setListPhoneNumber([]);
                    }}
                    disabled={disableForm}
                    placeholder="Chọn kho số"
                    options={optionStockExport}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  labelAlign="left"
                  label="Kho nhận"
                  name="ieStockId"
                  rules={[validateForm.required]}
                >
                  <CSelect
                    disabled={disableForm}
                    placeholder="Chọn kho số"
                    options={optionStockImport}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  labelAlign="left"
                  label="Lý do"
                  name="reasonId"
                  rules={[validateForm.required]}
                >
                  <CSelect
                    disabled={disableForm}
                    placeholder="Lý do"
                    options={optionReason}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item labelAlign="left" label="Ghi chú" name="description">
                  <CTextArea
                    placeholder="Ghi chú"
                    maxLength={200}
                    disabled={disableForm}
                    rows={3}
                  />
                </Form.Item>
              </Col>
            </Row>

            <CTableUploadFile
              onDownload={disableForm ? handleDownloadAttachment : undefined}
              disabled={disableForm}
              acceptedFileTypes="*"
              formName="files"
              showAction={actionMode !== ACTION_MODE_ENUM.VIEW}
            />

            <Row>
              <Col span={24}>
                <Form.Item
                  labelAlign="left"
                  name="processType"
                  label="Kiểu chọn số"
                  className="mt-4"
                  rules={[validateForm.required]}
                >
                  <Radio.Group onChange={handleSelectionChange}>
                    <CRadio
                      disabled={disableForm}
                      checked
                      value={NumberProcessType.INDIVIDUAL}
                    >
                      Chọn đơn lẻ
                    </CRadio>
                    <CRadio
                      disabled={disableForm}
                      value={NumberProcessType.BATCH}
                    >
                      Chọn theo lô
                    </CRadio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={24}>
                {processType === NumberProcessType.INDIVIDUAL ? (
                  <FileUploadPhoneNumber />
                ) : (
                  <CUploadFileTemplate
                    onDownloadTemplate={handleExport}
                    onDownloadFile={
                      disableForm ? handleDownloadUploadFile : undefined
                    }
                    required
                    labelCol={{ style: { width: '120px' } }}
                    label="Danh sách số"
                    accept={[
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    ]}
                    name={'numberFile'}
                  />
                )}
              </Col>
            </Row>
          </>
        </Card>
      </Spin>
      <RowButton className="my-6">
        <Show>
          <Show.When isTrue={!isEnabledApproval}>
            {disableForm ? null : (
              <>
                <CButtonSaveAndAdd
                  onClick={() => {
                    form.submit();
                  }}
                  loading={loadingAdd}
                />
                <CButtonSave
                  loading={loadingAdd}
                  onClick={() => {
                    setIsSubmitBack(true);
                    form.submit();
                  }}
                />
              </>
            )}
            {disableForm &&
            actionByRole.includes(ActionsTypeEnum.CANCEL) &&
            detailDistributeNumber &&
            detailDistributeNumber.approvalStatus ===
              ApprovalStatus.WAITING_APPROVAL &&
            detailDistributeNumber.transStatus ===
              NumberTransactionStatus.PRE_START ? (
              <CButton
                danger
                onClick={() => {
                  ModalConfirm({
                    message: 'Bạn có chắc chắn muốn hủy phân phối?',
                    handleConfirm: () => {
                      postCancelDistributeNumber(detailDistributeNumber.id!);
                    },
                  });
                }}
                loading={loadingCancel}
              >
                Hủy phân phối
              </CButton>
            ) : null}
            <CButtonClose onClick={handleNavigatePhoneDistribution} />
          </Show.When>
        </Show>
      </RowButton>
    </Form>
  );
};
export default ActionPage;
