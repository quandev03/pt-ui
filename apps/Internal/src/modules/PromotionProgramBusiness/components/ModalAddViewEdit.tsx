import { CModalConfirm } from '@react/commons/index';
import { TitleHeader } from '@react/commons/Template/style';
import { AnyElement, ModelStatus, ParamsOption } from '@react/commons/types';
import { ActionType } from '@react/constants/app';
import { formatDateBe } from '@react/constants/moment';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { MESSAGE } from '@react/utils/message';
import { Form, Spin } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAdd from '../hook/useAdd';
import useDownloadFile from '../hook/useDownloadFile';
import useEdit from '../hook/useEdit';
import useView from '../hook/useView';
import { IPayload, PromCodeMethods } from '../types';
import { FooterForm } from './FooterForm';
import { FormCodeConfiguration } from './FormCodeConfiguration';
import { FormGeneralInformation } from './FormGeneralInformation';
const ModalAddViewEdit = ({ typeModal }: { typeModal: ActionType }) => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const checkPromCodeMethod = useWatch('promCodeMethod', form);
  const [submitType, setSubmitType] = useState<string>('');
  const navigate = useNavigate();
  const [dataTable, setDataTable] = useState<AnyElement[]>([]);
  const { PROMOTION_PROGRAM_PROMOTION_PRODUCT = [] } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  const handleCloseModal = useCallback(() => {
    navigate(-1);
  }, [navigate]);
  const { mutate: mutateFileDownload } = useDownloadFile();
  const handleDownloadFile = useCallback(() => {
    const validId = id ?? '';
    mutateFileDownload({ id: validId });
  }, [form, id, mutateFileDownload]);
  const { mutate: add, isPending: loadingAdd } = useAdd(async (data) => {
    if (submitType === 'saveAndAdd') {
      if (checkPromCodeMethod === PromCodeMethods.MANY_CODE) {
        await mutateFileDownload({
          id: data.id,
        });
      }
      handleCloseAddSave();
    } else {
      if (checkPromCodeMethod === PromCodeMethods.MANY_CODE) {
        await mutateFileDownload({
          id: data.id,
        });
      }
      handleCloseModal();
    }
  }, form);
  const { data: dataDetail } = useView(id ?? '', typeModal);
  const { mutate: edit, isPending: loadingEdit } = useEdit(
    handleCloseModal,
    form
  );
  const handleCloseAddSave = useCallback(() => {
    form.resetFields();
  }, [form]);
  const renderTitle = useMemo(() => {
    switch (typeModal) {
      case ActionType.ADD:
        return 'Tạo mã khuyến mại';
      case ActionType.EDIT:
        return 'Chỉnh sửa mã khuyến mại';
      case ActionType.VIEW:
        return 'Xem chi tiết mã khuyến mại';
      default:
        return '';
    }
  }, [typeModal]);
  const handleSubmit = useCallback(
    (values: IPayload) => {
      const data = {
        ...values,
        promotionProgramLines:
          values.promotionProgramLines &&
          values.promotionProgramLines.map((item) => ({
            promotionProduct:
              Number(
                PROMOTION_PROGRAM_PROMOTION_PRODUCT.find(
                  (t) => String(t.label) === String(item.promotionProduct)
                )?.value
              ) ?? 0,
            promotionType: Number(item.promotionType),
            promotionValue:
              item.promotionValuePromotionProgramLine !== null
                ? Number(item.promotionValuePromotionProgramLine)
                : undefined,
          })),
        startDate: dayjs(values.startDate).format(formatDateBe) ?? '',
        endDate: dayjs(values.endDate).format(formatDateBe) ?? '',
        status: values.status ? ModelStatus.ACTIVE : ModelStatus.INACTIVE,
        promotionPackage:
          values.promotionPackage &&
          (values.promotionPackage as string[]).length > 0
            ? (values.promotionPackage as string[]).join(',')
            : undefined,
        channel: (values.channel as string[]).join(',') ?? '',
        minPrice: values.minPrice ? Number(values.minPrice) : undefined,
        quantity: values.quantity ? Number(values.quantity) : undefined,
        promMethod: values.promMethod ? values.promMethod : undefined,
        userLimit: values.userLimit ? Number(values.userLimit) : undefined,
        simType: values.simType ? values.simType : undefined,
      };
      if (typeModal === ActionType.ADD) {
        add(data as unknown as IPayload);
      }
      if (typeModal === ActionType.EDIT) {
        const dataEdit = {
          ...values,
          id: id ?? '',
          channel: (values.channel as string[]).join(',') ?? '',
          startDate: dayjs(values.startDate).format(formatDateBe) ?? '',
          endDate: dayjs(values.endDate).format(formatDateBe) ?? '',
          status: values.status ? ModelStatus.ACTIVE : ModelStatus.INACTIVE,
          minPrice: values.minPrice ? Number(values.minPrice) : undefined,
          quantity: values.quantity ? Number(values.quantity) : undefined,
          promMethod: values.promMethod ? values.promMethod : undefined,
          userLimit: values.userLimit ? Number(values.userLimit) : undefined,
          simType: values.simType ? values.simType : undefined,
          promotionPackage:
            values.promotionPackage &&
            (values.promotionPackage as string[]).length > 0
              ? (values.promotionPackage as string[]).join(',')
              : undefined,
          promotionProgramLines: dataTable.map((item) => ({
            ...item,
            promotionValue: values.promotionProgramLines.find(
              (t) =>
                String(t.promotionProduct) ===
                String(
                  PROMOTION_PROGRAM_PROMOTION_PRODUCT.find(
                    (p) => String(p.value) === String(item.promotionProduct)
                  )?.label
                )
            )?.promotionValuePromotionProgramLine,
          })),
        } as unknown as IPayload;
        CModalConfirm({
          message: MESSAGE.G04,
          onOk: () => {
            edit(dataEdit);
          },
        });
      }
    },
    [
      form,
      typeModal,
      add,
      edit,
      id,
      PROMOTION_PROGRAM_PROMOTION_PRODUCT,
      dataTable,
    ]
  );
  useEffect(() => {
    if (dataDetail) {
      form.setFieldsValue({
        ...dataDetail,
        startDate: dayjs(dataDetail.startDate),
        endDate: dayjs(dataDetail.endDate),
        userLimit: String(dataDetail.userLimit),
        channel: dataDetail.channel.split(','),
        promotionType: String(dataDetail.promotionType),
        promotionPackage: dataDetail.promotionPackage
          ? dataDetail.promotionPackage.split(',')
          : [],
        promotionProgramLines: dataDetail.promotionProgramLines.map((item) => ({
          promotionProduct:
            PROMOTION_PROGRAM_PROMOTION_PRODUCT.find(
              (t) => String(t.value) === String(item.promotionProduct)
            )?.label ?? '',
          promotionType: String(item.promotionType),
          promotionValuePromotionProgramLine:
            item.promotionValue != null
              ? String(item.promotionValue)
              : undefined,
        })),
      });
      setDataTable(dataDetail.promotionProgramLines);
    }
  }, [dataDetail, form, typeModal, PROMOTION_PROGRAM_PROMOTION_PRODUCT]);
  return (
    <>
      <TitleHeader>{renderTitle}</TitleHeader>
      <strong className="text-[#2C3D94] mt-6 mb-2 block">
        Thông tin chung
      </strong>
      <div>
        <Form
          labelAlign="left"
          labelCol={{ style: { width: '164px', whiteSpace: 'normal' } }}
          form={form}
          colon={false}
          onFinish={handleSubmit}
          disabled={typeModal === ActionType.VIEW}
          layout="horizontal"
        >
          <Spin spinning={loadingAdd || loadingEdit}>
            <FormGeneralInformation
              typeModal={typeModal}
              checkPromCodeMethod={checkPromCodeMethod}
              handleDownloadFile={handleDownloadFile}
            />
            <FormCodeConfiguration
              dataTable={dataTable}
              setDataTable={setDataTable}
              typeModal={typeModal}
            />
            <FooterForm
              typeModal={typeModal}
              handleCloseModal={handleCloseModal}
              setSubmitType={setSubmitType}
              loadingAdd={loadingAdd}
              loadingEdit={loadingEdit}
              id={id ?? ''}
            />
          </Spin>
        </Form>
      </div>
    </>
  );
};
export default ModalAddViewEdit;
