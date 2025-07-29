import { CButtonClose, CButtonSave } from '@react/commons/Button';
import { CRadio } from '@react/commons/index';
import { TitleHeader } from '@react/commons/Template/style';
import { FieldErrorsType } from '@react/commons/types';
import { ActionType } from '@react/constants/app';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import validateForm from '@react/utils/validator';
import { useIsMutating } from '@tanstack/react-query';
import { Card, Col, Flex, Form, Radio, Row, Spin } from 'antd';
import { pathRoutes } from 'apps/Partner/src/constants/routes';
import {
  OrgUnitType,
  queryKeyGetOrgUnitByUser,
} from 'apps/Partner/src/hooks/useGetOrgByUser';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CardProduct from '../components/CardProduct';
import { useAddBatchKit } from '../hooks/useAddBatchKit';
import { queryKeyDownloadFile } from '../hooks/useDownloadFile';
import { queryKeyLastSerial } from '../hooks/useGetLastSerial';
import { queryKeyGetProductList } from '../hooks/useGetProductList';
import { queryKeyListStockSim, StockSimType } from '../hooks/useListStockSim';
import { queryKeySuggestFirstSerial } from '../hooks/useSuggestFirstSerial';
import { useViewKit } from '../hooks/useViewKit';
import '../index.scss';
import { ProductType } from '../types';
import { KitAddViewProps } from './KitAddView';

const defaultForm = {
  isOrderd: true,
  isUsingFile: true,
  orderNo: undefined,
  products: [{}],
};

const KitGroupAddView: React.FC<KitAddViewProps> = ({ actionType }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const isViewType = actionType === ActionType.VIEW;
  const { products } = Form.useWatch((e) => e, form) ?? {};
  const { mutate: mutateAdd, isPending: isLoadingAdd } = useAddBatchKit();
  const listStockSim = useGetDataFromQueryKey<StockSimType[]>([
    queryKeyListStockSim,
    '',
  ]);
  const listOrg = useGetDataFromQueryKey<OrgUnitType[]>([
    queryKeyGetOrgUnitByUser,
  ]);
  const isLoadingProduct = !!useIsMutating({
    mutationKey: [queryKeyGetProductList],
  });
  const isLoadingDownload = !!useIsMutating({
    mutationKey: [queryKeyDownloadFile],
  });
  const isLoadingLastSerial = !!useIsMutating({
    mutationKey: [queryKeyLastSerial],
  });
  const isLoadingSuggestFirstSerial = !!useIsMutating({
    mutationKey: [queryKeySuggestFirstSerial],
  });

  const { data, isLoading: isLoadingView } = useViewKit(id);
  console.log('🚀 ~ data:', data);

  useEffect(() => {
    if (actionType === ActionType.ADD) {
      form.setFieldsValue(defaultForm);
    } else if (
      (actionType === ActionType.VIEW || actionType === ActionType.EDIT) &&
      data
    ) {
      form.setFieldsValue(data);
    }
  }, [actionType, data, form]);

  const handleSubmit = (values: any, isSaveAndAdd?: boolean) => {
    const { isOrderd, orderNo, products, ...restValues } = values;
    const files = products?.map(({ file }: { file: Blob }) => file);
    const payload = {
      ...restValues,
      saleOrderId: orderNo?.value,
      orderNo: orderNo?.label,
      details: products?.map(
        ({ file, profileTypeList, ...e }: ProductType) => ({
          ...e,
          stockName: listStockSim?.find((c) => c.stockId === e.stockId)
            ?.stockName,
          orgName: listOrg?.find((c) => c.orgId === e.orgId)?.orgName,
        })
      ),
    };
    mutateAdd(
      {
        payload,
        files,
      },
      {
        onSuccess: () => {
          if (!isSaveAndAdd) {
            window.history.back();
          } else {
            form.resetFields();
            form.setFieldsValue(defaultForm);
          }
        },
        onError: (err: any) => {
          if (err?.errors?.length > 0) {
            form.setFields(
              err.errors.map((item: FieldErrorsType) => {
                const fieldArr = item.field.split('_');
                return {
                  name: ['products', Number(fieldArr[0]), fieldArr[1]],
                  errors: [item.detail],
                };
              })
            );
          }
        },
      }
    );
  };

  const handleFinish = (values: any) => {
    handleSubmit(values);
  };
  const handleSaveAndAdd = () => {
    const errors = form.getFieldsError();
    const isErrorForm = errors.some((err) => err.errors.length);
    if (isErrorForm) return;
    const values = form.getFieldsValue();
    form.validateFields().then(() => handleSubmit(values, true));
  };
  const handleClose = () => {
    navigate(pathRoutes.kitCraft);
  };

  const handleChangeTypeFile = () => {
    form.setFieldsValue({
      products: products?.map(({ file, ...e }: any) => e),
    });
  };

  return (
    <>
      <TitleHeader>{`${
        !isViewType ? 'Ghép' : 'Xem chi tiết ghép'
      } KIT hàng loạt`}</TitleHeader>
      <Spin
        spinning={
          isLoadingAdd ||
          isLoadingView ||
          isLoadingLastSerial ||
          isLoadingDownload ||
          isLoadingProduct ||
          isLoadingSuggestFirstSerial
        }
      >
        <Form
          form={form}
          colon={false}
          onFinish={handleFinish}
          labelCol={{ prefixCls: 'form-label--kit-craft' }}
        >
          <Card>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Chọn số"
                  name="isUsingFile"
                  rules={[validateForm.required]}
                >
                  <Radio.Group
                    onChange={handleChangeTypeFile}
                    disabled={isViewType}
                  >
                    <CRadio value={false}>Ngẫu nhiên trong kho</CRadio>
                    <CRadio value={true}>Theo file</CRadio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.List name={'products'}>
                  {(products) =>
                    products.map((_, idx) => (
                      <CardProduct actionType={actionType} idx={idx} />
                    ))
                  }
                </Form.List>
              </Col>
            </Row>
          </Card>
          <Flex className="w-full mt-4" gap={12} justify="end">
            {!isViewType && (
              <CButtonSave onClick={handleSaveAndAdd}>
                Ghép KIT và thêm mới
              </CButtonSave>
            )}
            <CButtonClose onClick={handleClose} type="default" />
          </Flex>
        </Form>
      </Spin>
    </>
  );
};
export default KitGroupAddView;
