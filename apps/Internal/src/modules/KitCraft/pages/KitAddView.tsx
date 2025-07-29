import { CButtonClose, CButtonSave } from '@react/commons/Button';
import {
  CInput,
  CSelect,
  CTextArea,
  NotificationError,
} from '@react/commons/index';
import { TitleHeader } from '@react/commons/Template/style';
import { ActionType, KitProcessType } from '@react/constants/app';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import formInstance from '@react/utils/form';
import validateForm, { serialSimReg } from '@react/utils/validator';
import { useIsMutating } from '@tanstack/react-query';
import { Card, Col, Flex, Form, Row, Spin } from 'antd';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { useGetOrgByUser } from 'apps/Internal/src/hooks/useGetOrgByUser';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TypeProduct from '../components/TypeProduct';
import { useAddKit } from '../hooks/useAddKit';
import { useCheckIsdn } from '../hooks/useCheckIsdn';
import {
  ProductType,
  queryKeyGetProductList,
} from '../hooks/useGetProductList';
import { useListStockSim } from '../hooks/useListStockSim';
import {
  SerialRes,
  useSuggestFirstSerial,
} from '../hooks/useSuggestFirstSerial';
import { useViewKit } from '../hooks/useViewKit';
import '../index.scss';
import { pathRoutes } from 'apps/Internal/src/constants/routes';

export interface KitAddViewProps {
  actionType: ActionType;
}

const KitAddView: React.FC<KitAddViewProps> = ({ actionType }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const isViewType = actionType === ActionType.VIEW;
  const { COMBINE_KIT_ISDN_TYPE = [], PRODUCT_CATEGORY_CATEGORY_TYPE = [] } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  const { isdn, serialSim, simType } = Form.useWatch((e) => e, form) ?? {};
  const [selectedProduct, setSelectedProduct] = useState<ProductType>();
  const { mutate: mutateAdd, isPending: isLoadingAdd } = useAddKit();
  const { data, isFetching: isLoadingView } = useViewKit(id);
  const { data: listStockSim, isFetching: isLoadingStockSim } =
    useListStockSim('');
  const { data: dataOrg, isFetching: isLoadingOrg } = useGetOrgByUser();
  const { mutateAsync: mutateCheckIsdn, isPending: isLoadingIsdn } =
    useCheckIsdn();
  const {
    mutateAsync: mutateSuggestFirstSerial,
    isPending: isLoadingSuggestFirstSerial,
    data: dataSuggestFirstSerial,
  } = useSuggestFirstSerial();
  const processType = data?.processType ?? KitProcessType.SINGLE;

  const isLoadingProduct = !!useIsMutating({
    mutationKey: [queryKeyGetProductList],
  });
  const defaultForm = {
    isdnType: COMBINE_KIT_ISDN_TYPE[0]?.value,
  };

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(defaultForm);
  }, [actionType]);
  useEffect(() => {
    form.setFieldsValue(data);
  }, [isLoadingView]);

  const handleCheckIsdn = (value: any, isIsdn = true) => {
    if ((isdn?.length < 9 && isIsdn) || !value) return;
    mutateCheckIsdn(
      { stockId: isIsdn ? undefined : value, isdn: isIsdn ? isdn : undefined },
      {
        onSuccess: ({ stockId, isdn }: any) => {
          form.setFieldsValue({ stockId, isdn: isdn.toString() });
        },
        onError: (err: any) => {
          isIsdn && formInstance.getFormError(form, err?.errors);
        },
      }
    );
  };

  const handleSuggestFirstSerial = (value: any, isSerial = true) => {
    if (!simType) {
      NotificationError('Vui lòng chọn sản phẩm');
      return;
    }
    if (!selectedProduct || !value || (isSerial && !serialSim)) return;
    if (!isSerial) form.resetFields(['serialSim']);
    if (isSerial && !serialSimReg.test(serialSim)) return;
    mutateSuggestFirstSerial(
      {
        fromSerial: isSerial ? serialSim : undefined,
        orgId: isSerial ? undefined : value,
        simType,
      },
      {
        onSuccess: ({ orgId, serialNumber }: SerialRes) => {
          form.setFieldsValue({ orgId, serialSim: serialNumber });
        },
        onError: (err: any) => {
          formInstance.getFormError(form, err?.errors, 'serialSim');
        },
      }
    );
  };

  const handleSubmit = (values: any, isSaveAndAdd?: boolean) => {
    const { orderNo, isdn, ...restValues } = values;
    mutateAdd(
      {
        ...selectedProduct,
        isdn: Number(isdn),
        ...restValues,
        saleOrderId: orderNo?.value,
        orderNo: orderNo?.label,
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
          formInstance.getFormError(form, err?.errors);
        },
      }
    );
  };

  const handleSaveAndAdd = () => {
    const values = form.getFieldsValue();
    form.validateFields().then(() => handleSubmit(values, true));
  };

  const handleFinish = (values: any) => {
    handleSubmit(values);
  };

  const handleClose = () => {
    navigate(pathRoutes.kitCraft);
  };

  return (
    <>
      <TitleHeader>{`${!isViewType ? 'Ghép' : 'Xem chi tiết ghép'} KIT đơn ${
        processType === KitProcessType.SINGLE ? 'lẻ' : 'hàng online'
      }`}</TitleHeader>
      <Spin
        spinning={
          isLoadingAdd ||
          isLoadingView ||
          isLoadingProduct ||
          isLoadingIsdn ||
          isLoadingSuggestFirstSerial
        }
      >
        <Form
          form={form}
          colon={false}
          onFinish={handleFinish}
          labelCol={{ prefixCls: 'form-label--kit-craft' }}
          onValuesChange={(changedValues) => {
            if (changedValues.productName) {
              form.setFieldsValue({
                stockId: null,
                isdn: '',
                orgId: null,
                serialSim: '',
              });
            }
          }}
        >
          <Card>
            <Row gutter={16}>
              <TypeProduct
                actionType={actionType}
                setSelectedProduct={setSelectedProduct}
                selectedProduct={selectedProduct}
                isSingleCraft
              />
              <Col span={12}>
                <Form.Item
                  label="Loại SIM"
                  name="simType"
                  rules={[validateForm.required]}
                >
                  <CSelect
                    placeholder="Loại SIM"
                    options={PRODUCT_CATEGORY_CATEGORY_TYPE.map((e) => ({
                      value: e.value,
                      label: e.label,
                    }))}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="stockId"
                  label="Kho số"
                  rules={[validateForm.required]}
                >
                  <CSelect
                    placeholder="Kho số"
                    options={listStockSim}
                    isLoading={isLoadingStockSim}
                    disabled={isViewType}
                    onSelect={(value: number) => handleCheckIsdn(value, false)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Số thuê bao"
                  name="isdn"
                  rules={[
                    validateForm.required,
                    validateForm.minLength(9, '${label} không đúng định dạng'),
                  ]}
                >
                  <CInput
                    disabled={isViewType}
                    onlyNumber
                    placeholder="Số thuê bao"
                    maxLength={10}
                    onBlur={handleCheckIsdn}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="orgId"
                  label="Kho SIM"
                  rules={[validateForm.required]}
                >
                  <CSelect
                    placeholder="Chọn kho SIM"
                    options={dataOrg}
                    isLoading={isLoadingOrg}
                    disabled={isViewType}
                    onChange={(value: number) =>
                      handleSuggestFirstSerial(value, false)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Serial SIM"
                  name="serialSim"
                  rules={[
                    validateForm.required,
                    serialSim
                      ? validateForm.serialSim
                      : validateForm.equal(
                          dataSuggestFirstSerial?.serialNumber,
                          'Serial không thuộc kho SIM'
                        ),
                  ]}
                >
                  <CInput
                    disabled={isViewType}
                    onlyNumber
                    placeholder="Serial SIM"
                    maxLength={16}
                    onBlur={handleSuggestFirstSerial}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label={'Ghi chú'} name={'description'}>
                  <CTextArea rows={3} disabled={isViewType} maxLength={200} />
                </Form.Item>
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

export default KitAddView;
