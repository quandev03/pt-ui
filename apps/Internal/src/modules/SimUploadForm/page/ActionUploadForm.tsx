import {
  CButtonClose,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import CTableUploadFile, { FileData } from '@react/commons/TableUploadFile';
import { BtnGroupFooter, TitleHeader } from '@react/commons/Template/style';
import CTextArea from '@react/commons/TextArea';
import { ACTION_MODE_ENUM, AnyElement } from '@react/commons/types';
import useActionMode from '@react/hooks/useActionMode';
import { MESSAGE } from '@react/utils/message';
import { Card, Col, Form, Row } from 'antd';
import { useGetFileDownload } from 'apps/Internal/src/hooks/useGetFileDownload';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TableProduct from '../components/ProductListTable';
import { useAddUploadForm } from '../queryHook/useAddUploadForm';
import { useInfinityScrollPO } from '../queryHook/useGetInfinityPO';
import { useGetProductList } from '../queryHook/useGetProductList';
import { useGetUploadFormDetail } from '../queryHook/useGetUploadFormDetail';
import { OrderLinePayload } from '../types';
import { debounce } from 'lodash';

type Props = {
  isEnabledApproval?: boolean;
};
const ActionUploadForm: React.FC<Props> = ({ isEnabledApproval = false }) => {
  const [form] = Form.useForm();
  const [orderLineForm] = Form.useForm();
  const actionMode = useActionMode();
  const navigate = useNavigate();
  const poCode = Form.useWatch('deliveryOrderNo', form);
  const [orderLines, setOrderLines] = useState<OrderLinePayload[]>([]);
  const [isSaveAndAdd, setIsSaveAndAdd] = useState(false);
  const { mutate: downloadFile } = useGetFileDownload();
  const { id } = useParams();
  const [searchParaams, setSearchParams] = useState({
    page: 0,
    size: 20,
    'value-search': '',
  });
  const Title = useMemo(() => {
    switch (actionMode) {
      case ACTION_MODE_ENUM.VIEW:
        return 'Xem chi tiết đơn upload';
      case ACTION_MODE_ENUM.CREATE:
        return 'Tạo đơn upload';
    }
  }, [actionMode]);
  const {
    data: poCodeData,
    fetchNextPage,
    hasNextPage,
  } = useInfinityScrollPO(searchParaams);

  const { data: products, isFetching: isLoadingTable } =
    useGetProductList(poCode);
  const productList = useMemo(() => {
    if (!poCode) return [];
    return products;
  }, [poCode, products]);
  const { data: uploadFormDetail } = useGetUploadFormDetail(id);
  const poOptions = useMemo(() => {
    if (
      actionMode === ACTION_MODE_ENUM.VIEW &&
      uploadFormDetail &&
      poCodeData
    ) {
      return [
        ...poCodeData,
        {
          label:
            uploadFormDetail.deliveryOrderNo +
            ' - ' +
            uploadFormDetail.supplierName,
          value: uploadFormDetail.deliveryOrderId,
          orderNo: uploadFormDetail.deliveryOrderNo,
        },
      ];
    } else if (actionMode === ACTION_MODE_ENUM.CREATE) {
      return poCodeData;
    }
  }, [actionMode, uploadFormDetail, poCodeData]);
  const onAddSuccess = () => {
    if (isSaveAndAdd) {
      form.resetFields();
      orderLineForm.resetFields();
    } else {
      navigate(-1);
    }
  };
  const { mutate: addUploadForm } = useAddUploadForm(
    form,
    orderLineForm,
    onAddSuccess
  );
  useEffect(() => {
    if (productList) {
      const orderLines = productList.map((product) => ({
        productId: product.productId,
        amountNumber: undefined,
      }));
      setOrderLines(orderLines);
    }
  }, [productList]);
  useEffect(() => {
    if (uploadFormDetail && actionMode === ACTION_MODE_ENUM.VIEW) {
      const fileListData = uploadFormDetail.attachments.map((attachment) => ({
        name: attachment.fileName,
        size: attachment.fileVolume,
        desc: attachment.description,
        date: attachment.createdDate,
        url: attachment.fileUrl,
        id: attachment.id,
      }));

      form.setFieldsValue(uploadFormDetail);
      form.setFieldValue('deliveryOrderNo', uploadFormDetail.deliveryOrderId);
      form.setFieldValue('attachments', fileListData);
    }
  }, [uploadFormDetail]);
  const handleClose = () => {
    navigate(-1);
  };
  const handleFinish = (values: AnyElement) => {
    const deliveryOrderNo =
      poOptions?.find((item) => item.value === poCode)?.orderNo || '';
    addUploadForm({ deliveryOrderNo, formValue: values, orderLines });
  };
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.target as HTMLDivElement;
      if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
        if (hasNextPage) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, hasNextPage]
  );
  const handleChangeAmount = (index: number, value: number) => {
    const updatedOrderLines = [...orderLines];
    updatedOrderLines[index].amountNumber = value;
    setOrderLines(updatedOrderLines);
  };
  const handleClickSave = async () => {
    try {
      await orderLineForm.validateFields();
      form.submit();
    } catch (error) {
      return;
    }
  };
  const handleDownload = (record: FileData) => {
    downloadFile({
      id: record.id as number,
      fileName: record.name || '',
    });
  };
  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearchParams({ ...searchParaams, 'value-search': value });
    }, 800),
    []
  );
  return (
    <>
      <TitleHeader>{Title}</TitleHeader>
      <Card>
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          colon={false}
          onFinish={handleFinish}
          disabled={actionMode === ACTION_MODE_ENUM.VIEW}
        >
          <Row>
            <Col span={12}>
              <Form.Item
                label="Đơn uplpad"
                name="deliveryOrderNo"
                rules={[{ required: true, message: MESSAGE.G06 }]}
              >
                <CSelect
                  placeholder="Chọn đơn upload"
                  options={poOptions}
                  onPopupScroll={handleScroll}
                  allowClear={false}
                  onSearch={handleSearch}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Mã đơn upload"
                name="uploadOrderNo"
                rules={[{ required: true, message: MESSAGE.G06 }]}
                className="ml-4"
              >
                <CInput
                  preventSpecial
                  preventVietnamese
                  preventSpace
                  placeholder="Nhập mã đơn upload"
                  uppercase
                  maxLength={20}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Ghi chú"
                name="description"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 21 }}
              >
                <CTextArea
                  maxLength={200}
                  placeholder="Nhập ghi chú"
                  rows={3}
                />
              </Form.Item>
            </Col>
          </Row>
          <CTableUploadFile
            formName="attachments"
            disabled={actionMode === ACTION_MODE_ENUM.VIEW}
            onDownload={
              actionMode === ACTION_MODE_ENUM.VIEW ? handleDownload : undefined
            }
            showAction={actionMode !== ACTION_MODE_ENUM.VIEW}
          />
        </Form>
        <TableProduct
          dataTable={
            uploadFormDetail ? uploadFormDetail.orderLines : productList || []
          }
          isLoading={isLoadingTable}
          handleChangeAmount={handleChangeAmount}
          orderLineForm={orderLineForm}
          isViewDetail={actionMode === ACTION_MODE_ENUM.VIEW}
        />
      </Card>
      {!isEnabledApproval && (
        <BtnGroupFooter className="mt-6">
          {actionMode === ACTION_MODE_ENUM.CREATE && (
            <>
              {' '}
              <CButtonSaveAndAdd
                onClick={() => {
                  setIsSaveAndAdd(true);
                  handleClickSave();
                }}
              />
              <CButtonSave
                onClick={() => {
                  setIsSaveAndAdd(false);
                  handleClickSave();
                }}
              />{' '}
            </>
          )}
          <CButtonClose onClick={handleClose} />
        </BtnGroupFooter>
      )}
    </>
  );
};
export default ActionUploadForm;
