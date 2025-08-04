import { AnyElement, CButton, CModal } from '@vissoft-react/common';
import { Button, Form } from 'antd';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  useCreateProductAuthorization,
  useGetProductAuthorization,
} from '../queryHooks';
import usePartnerStore from '../stores';
import ProductAuthorizationItem from './ProductAuthorizationItem';

const ProductAuthorizationModal = () => {
  const {
    openProductAuthorization,
    setOpenProductAuthorization,
    setPartnerTarget,
    partnerTarget,
  } = usePartnerStore();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [form] = Form.useForm();
  const handleClose = () => {
    setOpenProductAuthorization(false);
    form.resetFields();
    setPartnerTarget(undefined);
    setIsEdit(false);
  };
  const { data } = useGetProductAuthorization(partnerTarget?.id as number);

  useEffect(() => {
    if (data) {
      if (data.length === 0) {
        setIsEdit(true);
        form.setFieldsValue({
          payload: [
            {
              type: null,
              productIds: [],
            },
          ],
        });
      } else {
        setIsEdit(false);
        form.setFieldsValue({
          payload: data.map((item: AnyElement) => ({
            type: item.categoryId,
            productIds: item.productInfos.map(
              (item: AnyElement) => item.productId
            ),
          })),
        });
      }
    }
  }, [data]);

  const { mutate: createProductAuthorization } = useCreateProductAuthorization(
    () => {
      handleClose();
    }
  );
  const handleFinish = (values: {
    payload: { type: any; productIds: any[] }[];
  }) => {
    createProductAuthorization({
      id: partnerTarget?.id as number,
      payload: values.payload.flatMap((item) => item.productIds),
    });
  };

  return (
    <CModal
      title={'Phân quyền sản phẩm'}
      open={openProductAuthorization}
      width={1000}
      onCancel={handleClose}
      footer={null}
    >
      <Form
        form={form}
        colon={false}
        onFinish={handleFinish}
        disabled={!isEdit}
        initialValues={{
          payload: [
            {
              type: null,
              productIds: [],
            },
          ],
        }}
      >
        <div>
          <Form.List name={'payload'}>
            {(fields, { add, remove }) => (
              <div className="flex flex-col gap-5 items-center">
                {fields.map((field) => (
                  <ProductAuthorizationItem
                    add={add}
                    remove={remove}
                    field={field}
                    fields={fields}
                    isEdit={isEdit}
                    data={data}
                  />
                ))}
              </div>
            )}
          </Form.List>
        </div>
      </Form>
      <div className="flex justify-end mt-7 gap-4">
        {isEdit ? (
          <CButton
            icon={<Plus size={16} />}
            className={'w-[130px]'}
            onClick={() => {
              form.submit();
            }}
          >
            Lưu
          </CButton>
        ) : (
          <CButton
            onClick={() => {
              setIsEdit(true);
            }}
            className={'w-[130px]'}
            disabled={isEdit}
          >
            Chỉnh sửa
          </CButton>
        )}
        <Button className={'w-[130px]'} onClick={handleClose}>
          Đóng
        </Button>
      </div>
    </CModal>
  );
};

export default ProductAuthorizationModal;
