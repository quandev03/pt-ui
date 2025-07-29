import { faPause, faPlay, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton, {
  CButtonClose,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import { CDatePicker, CInput, CTextArea } from '@react/commons/index';
import Select from '@react/commons/Select';
import { RowButton, TitleHeader } from '@react/commons/Template/style';
import { ActionsTypeEnum, ActionType, DateFormat } from '@react/constants/app';
import { Card, Col, Form, Row, Spin, Typography } from 'antd';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import includes from 'lodash/includes';
import { FC, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { ItemEdit, useAddFn } from '../queryHook/useAdd';
import { useCancel } from '../queryHook/useCancel';
import { useEditFn } from '../queryHook/useEdit';
import {
  useGetFileDownloadFn,
  useGetOriginalFile,
} from '../queryHook/useGetFileDownload';
import { useListPromotion } from '../queryHook/useList';
import { usePending } from '../queryHook/usePause';
import { useRunning } from '../queryHook/useRun';
import { useView } from '../queryHook/useView';
import useGroupStore from '../store';
import { StatusType, StatusTypeEnum } from '../types';
import CUploadFileTemplate from './UploadFile';
type Props = {
  typeModal: ActionType;
};

const ModalAddEditView: FC<Props> = ({ typeModal }) => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const listRoleByRouter = useRolesByRouter();
  const navigate = useNavigate();
  const { resetGroupStore, isValuesChanged, setIsValuesChanged } =
    useGroupStore();
  const [isChangeFileUpdate, setIsChangeFileUpdate] = useState(false);
  const [promotionList, setPromotionList] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const { data: promotionsData, isFetching } = useListPromotion(page, size);
  const { mutate: getOriginalFile } = useGetOriginalFile(form);
  const reasonTypeOptions = promotionList?.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));

  const {
    isFetching: isFetchingView,
    data: itemEdit,
    refetch: refetchGetItemEdit,
  } = useView(id || '');

  useEffect(() => {
    if (promotionsData?.content) {
      setPromotionList((prev) => [...prev, ...promotionsData.content]);
      setHasMore(promotionsData.content.length === size);
    }
    return () => {
      setIsChangeFileUpdate(false);
    };
  }, [promotionsData]);

  useEffect(() => {
    // refetchGetItemEdit();
    if (typeModal !== ActionType.ADD && id) {
      refetchGetItemEdit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeModal, id]);

  useEffect(() => {
    // refetchGetItemEdit();
    if (itemEdit && id) {
      setValue(itemEdit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemEdit]);
  const setValue = (itemEdit: any) => {
    form.resetFields();
    getOriginalFile(itemEdit?.filePath);
    form.setFields([
      {
        name: 'promotionId',
        value: itemEdit?.promProgramId,
      },
      {
        name: 'startProcess',
        value: !itemEdit?.processingStartDate
          ? null
          : typeModal === ActionType.VIEW
          ? dayjs(itemEdit?.processingStartDate)
          : dayjs(itemEdit?.processingStartDate),
      },
      {
        name: 'status',
        value: StatusType[itemEdit?.status as keyof typeof StatusType],
      },
      {
        name: 'note',
        value: itemEdit?.note,
      },
      {
        name: 'fileName',
        value: itemEdit?.fileName,
      },
      {
        name: 'filePath',
        value: itemEdit?.filePath,
      },
    ]);
    console.log('FORM ', form.getFieldsValue());
  };

  const handlePopupScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } =
      event.target as HTMLDivElement;
    if (
      scrollTop + clientHeight >= scrollHeight - 10 &&
      hasMore &&
      !isFetching
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  const handleClose = () => {
    form.resetFields();
    resetGroupStore();
    navigate(-1);
  };

  const handleCloseModal = () => {
    handleClose();
  };

  const { mutate: addMutate, isPending: loadingAdd } = useAddFn(form);
  const { isPending: isLoadingEdit, mutate: editMutate } = useEditFn(form);
  const { isPending: isLoadingCancel, mutate: cancelMutate } = useCancel(
    form,
    () => {
      refetchGetItemEdit().then(() =>
        form.setFields([
          {
            name: 'status',
            value: StatusType[4],
          },
        ])
      );
    }
  );
  const { isPending: isLoadingPending, mutate: pendingMutate } = usePending(
    form,
    () => {
      refetchGetItemEdit().then(() =>
        form.setFields([
          {
            name: 'status',
            value: StatusType[3],
          },
        ])
      );
    }
  );
  const { isPending: isLoadingRunning, mutate: runningMutate } = useRunning(
    form,
    () => {
      refetchGetItemEdit().then(() =>
        form.setFields([
          {
            name: 'status',
            value: StatusType[1],
          },
        ])
      );
    }
  );
  const { mutate: getFileDownload } = useGetFileDownloadFn();
  const promotionFile = Form.useWatch('promotionFile', form);
  // const { mutate: deleteMutate } = useDeleteFn();
  const handleFinishForm = (values: ItemEdit) => {
    if (typeModal === ActionType.ADD) {
      addMutate({
        files: {
          promotionFile: promotionFile,
        },
        form: {
          ...values,
        },
      });
    } else if (typeModal === ActionType.EDIT) {
      ModalConfirm({
        message: 'Bạn có chắc chắn muốn sửa chương trình khuyến mại?',
        handleConfirm() {
          editMutate({
            files: isChangeFileUpdate
              ? { promotionFile }
              : { promotionFile: null },
            form: {
              ...values,
              id: id,
            },
          });
        },
      });
    }
  };

  const layout = {
    labelCol: { span: 4 },
    // wrapperCol: { span: 16 },
  };

  const handleDownload = (url: string) => {
    getFileDownload(url);
  };

  const handleCancel = () => {
    ModalConfirm({
      message: 'Bạn có chắc chắn muốn hủy chương trình khuyến mại?',
      handleConfirm() {
        cancelMutate(id!);
      },
    });
  };

  const handlePending = () => {
    ModalConfirm({
      message: 'Bạn có chắc chắn muốn tạm dừng chương trình khuyến mại?',
      handleConfirm() {
        pendingMutate(id!);
      },
    });
  };
  const handleRunning = () => {
    ModalConfirm({
      message: 'Bạn có chắc chắn muốn chạy chương trình khuyến mại?',
      handleConfirm() {
        runningMutate(id!);
      },
    });
  };

  const renderTitle = () => {
    switch (typeModal) {
      case ActionType.ADD:
        return 'Cấu hình chạy chương trình khuyến mại';
      case ActionType.EDIT:
        return 'Sửa cấu hình chạy chương trình khuyến mại';
      case ActionType.VIEW:
        return 'Xem cấu hình chạy chương trình khuyến mại';
      default:
        return '';
    }
  };

  const validateDateRange = () => {
    const now = form.getFieldValue('startProcess');
    if (now && now < dayjs()) {
      return Promise.reject(
        new Error('Thời gian chạy phải lớn hơn thời gian tạo hiện tại')
      );
    }
    return Promise.resolve();
  };

  return (
    <>
      <TitleHeader>{renderTitle()}</TitleHeader>
      <Card>
        <Spin
          spinning={
            isFetchingView ||
            isLoadingEdit ||
            isLoadingCancel ||
            isLoadingPending ||
            isLoadingRunning
          }
        >
          <Form
            form={form}
            {...layout}
            onFinish={handleFinishForm}
            onValuesChange={(values) => {
              if (!isValuesChanged) {
                setIsValuesChanged(true);
              }
              if (typeModal === ActionType.EDIT && values.promotionFile) {
                setIsChangeFileUpdate(true);
              }
            }}
            disabled={typeModal === ActionType.VIEW}
            labelCol={{ lg: { span: 12 }, xl: { span: 4 } }}
            labelWrap
            scrollToFirstError
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  labelAlign="left"
                  label="CTKM"
                  name="promotionId"
                  rules={[
                    {
                      required: true,
                      message: 'Không được để trống trường này',
                    },
                  ]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    onPopupScroll={handlePopupScroll}
                    filterOption={(input, options: any) =>
                      (options?.label ?? '')
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={reasonTypeOptions}
                    placeholder={'Chọn CTKM'}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                {typeModal !== ActionType.VIEW && (
                  <CUploadFileTemplate
                    labelCol={{ span: 6 }}
                    label="Upload file thuê bao"
                    name="promotionFile"
                    required
                    fileName={form.getFieldValue('fileName')}
                    accept={[
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    ]}
                    onDownloadTemplate={() =>
                      handleDownload(
                        '/customer-management/CTKM/thuebaochayCTKM.xlsx'
                      )
                    }
                  />
                )}
                {typeModal === ActionType.VIEW && (
                  <Form.Item
                    labelCol={{ span: 6 }}
                    labelAlign="left"
                    label="Upload file thuê bao"
                    name="promotionFile"
                    rules={[
                      {
                        required: true,
                        message: 'Không được để trống trường này',
                      },
                    ]}
                  >
                    <Typography.Link
                      underline
                      target="_blank"
                      onClick={() =>
                        handleDownload(form.getFieldValue('filePath'))
                      }
                    >
                      {form.getFieldValue('fileName')}
                    </Typography.Link>
                  </Form.Item>
                )}
              </Col>
              <Col span={12}>
                <Form.Item
                  labelAlign="left"
                  label="Thời gian chạy"
                  name="startProcess"
                  rules={[{ validator: validateDateRange }]}
                >
                  {typeModal !== ActionType.VIEW && (
                    <CDatePicker
                      showTime={{ format: 'HH:mm:ss' }}
                      format={DateFormat.DATE_TIME}
                      className="w-full"
                      placeholder="Chọn ngày giờ"
                    />
                  )}
                  {typeModal === ActionType.VIEW && (
                    // <CInput className="w-full" placeholder="Thời gian chạy" />
                    <CDatePicker
                      showTime={{ format: 'HH:mm:ss' }}
                      format={DateFormat.DATE_TIME}
                      className="w-full"
                      placeholder="Chọn ngày giờ"
                    />
                  )}
                </Form.Item>
              </Col>
              {typeModal === ActionType.VIEW && (
                <Col span={12}>
                  <Form.Item
                    labelAlign="left"
                    label="Trạng thái"
                    name="status"
                    rules={[
                      {
                        required: true,
                        message: 'Không được để trống trường này',
                      },
                    ]}
                  >
                    <CInput disabled />
                  </Form.Item>
                </Col>
              )}
              <Col span={12}></Col>
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 2 }}
                  labelAlign="left"
                  label="Ghi chú"
                  name="note"
                >
                  <CTextArea maxLength={255} placeholder="Nhập nội dung" />
                </Form.Item>
              </Col>
            </Row>
            <br />
            <br />
            <RowButton>
              <Form.Item name="saveForm"></Form.Item>
              {typeModal === ActionType.ADD && (
                <CButtonSaveAndAdd
                  onClick={() => {
                    form.setFieldsValue({
                      saveForm: true,
                    });
                    form.submit();
                  }}
                  loading={loadingAdd}
                >
                  Lưu và thêm mới
                </CButtonSaveAndAdd>
              )}
              {typeModal === ActionType.VIEW &&
                (itemEdit?.status === StatusTypeEnum.NOT_RUN ||
                  itemEdit?.status === StatusTypeEnum.PAUSED ||
                  itemEdit?.status === StatusTypeEnum.PAUSED2) &&
                includes(listRoleByRouter, ActionsTypeEnum.UPDATE) && (
                  <CButton
                    style={{
                      backgroundColor: ' #008001',
                      borderColor: ' #008001',
                    }}
                    icon={<FontAwesomeIcon icon={faPlay} size="lg" />}
                    onClick={handleRunning}
                    disabled={false}
                  >
                    Chạy CTKM
                  </CButton>
                )}
              {typeModal === ActionType.VIEW &&
                (itemEdit?.status === StatusTypeEnum.NOT_RUN ||
                  itemEdit?.status === StatusTypeEnum.RUNNING) &&
                includes(listRoleByRouter, ActionsTypeEnum.UPDATE) && (
                  <CButton
                    style={{
                      backgroundColor: ' #ffd700',
                      borderColor: ' #ffd700',
                    }}
                    icon={<FontAwesomeIcon icon={faPause} size="lg" />}
                    onClick={handlePending}
                    disabled={false}
                  >
                    Tạm dừng
                  </CButton>
                )}
              {typeModal === ActionType.VIEW &&
                (itemEdit?.status === StatusTypeEnum.NOT_RUN ||
                  itemEdit?.status === StatusTypeEnum.RUNNING ||
                  itemEdit?.status === StatusTypeEnum.PAUSED ||
                  itemEdit?.status === StatusTypeEnum.PAUSED2) &&
                includes(listRoleByRouter, ActionsTypeEnum.UPDATE) && (
                  <CButton
                    style={{
                      backgroundColor: '#ff4d4d',
                      borderColor: '#ff4d4d',
                    }}
                    icon={<FontAwesomeIcon icon={faXmark} size="lg" />}
                    onClick={handleCancel}
                    disabled={false}
                  >
                    Hủy
                  </CButton>
                )}
              {typeModal === ActionType.VIEW &&
                itemEdit?.status === StatusTypeEnum.NOT_RUN &&
                includes(listRoleByRouter, ActionsTypeEnum.UPDATE) && (
                  <CButtonEdit
                    onClick={() =>
                      navigate(pathRoutes.promotionHistoryEdit(id))
                    }
                    disabled={false}
                  ></CButtonEdit>
                )}

              {typeModal === ActionType.ADD && (
                <CButtonSave
                  onClick={() => {
                    form.setFieldsValue({
                      saveForm: false,
                    });
                    form.submit();
                  }}
                  loading={loadingAdd || isLoadingEdit}
                >
                  <FormattedMessage id="common.save" />
                </CButtonSave>
              )}
              {typeModal === ActionType.EDIT && (
                <CButtonSave
                  onClick={() => {
                    form.setFieldsValue({
                      saveForm: false,
                    });
                    form.submit();
                  }}
                  loading={loadingAdd || isLoadingEdit}
                >
                  <FormattedMessage id="common.save" />
                </CButtonSave>
              )}

              <CButtonClose
                disabled={false}
                onClick={handleCloseModal}
                type="default"
              >
                Đóng
              </CButtonClose>
            </RowButton>
          </Form>
        </Spin>
      </Card>
    </>
  );
};

export default ModalAddEditView;
