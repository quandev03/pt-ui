import { CButtonClose, CButtonDelete } from '@react/commons/Button';
import { CSelect, CTextArea, CUploadFileTemplate } from '@react/commons/index';
import { TitleHeader } from '@react/commons/Template/style';
import { ActionType, FILE_TYPE } from '@react/constants/app';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import formInstance from '@react/utils/form';
import validateForm from '@react/utils/validator';
import { Card, Col, Flex, Form, Row, Spin } from 'antd';
import { ParamsOption } from 'apps/Partner/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import {
  ReasonCodeType,
  useListReasonByCode,
} from 'apps/Partner/src/hooks/useListReasonByCode';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDownloadTemplateFile } from '../hooks/useDownloadTemplateFile';
import { useUnCraftKit } from '../hooks/useUnCraftKit';
import { useViewKit } from '../hooks/useViewKit';

interface ComponentProps {
  actionType: ActionType;
}

const AddItem: React.FC<ComponentProps> = ({ actionType }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const isViewType = actionType === ActionType.VIEW;
  const {} = Form.useWatch((e) => e, form) ?? {};
  const { COMBINE_KIT_ISDN_TYPE = [] } = useGetDataFromQueryKey<ParamsOption>([
    REACT_QUERY_KEYS.GET_PARAMS,
  ]);
  const { mutate: mutateAdd, isPending: isLoadingAdd } = useUnCraftKit();
  const {
    isPending: isLoadingDownloadTemplate,
    mutate: mutateDownloadTemplate,
  } = useDownloadTemplateFile();
  const { data, isFetching: isLoadingView } = useViewKit(id);
  const { isFetching: isLoadingReason, data: listReason = [] } =
    useListReasonByCode(
      { reasonTypeCode: ReasonCodeType.CANCEL_SIM_REGISTRATION },
      data?.reasonId
    );
  const defaultForm = {
    isOrderd: true,
    isSelectedFile: 1,
    isdnType: COMBINE_KIT_ISDN_TYPE[0]?.value,
  };
  useEffect(() => {
    form.setFieldsValue(defaultForm);
  }, []);

  const handleSubmit = (values: any, isSaveAndAdd?: boolean) => {
    const { isOrderd, orderNo, file, ...restValues } = values;
    const payload = {
      ...restValues,
    };
    mutateAdd(
      {
        payload,
        file,
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

  const handleFinish = (values: any) => {
    handleSubmit(values);
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleDownloadTemplate = () => {
    mutateDownloadTemplate();
  };

  return (
    <>
      <TitleHeader>Hủy ghép KIT</TitleHeader>
      <Spin
        spinning={isLoadingAdd || isLoadingView || isLoadingDownloadTemplate}
      >
        <Form
          form={form}
          colon={false}
          onFinish={handleFinish}
          labelCol={{ prefixCls: 'w-[120px]' }}
        >
          <Card>
            <Row gutter={16}>
              <Col span={24}>
                <CUploadFileTemplate
                  required
                  onDownloadTemplate={handleDownloadTemplate}
                  accept={[FILE_TYPE.xlsx, FILE_TYPE.xls] as any}
                  label="Danh sách KIT"
                  name={'file'}
                />
              </Col>
              <Col span={12}>
                <Form.Item
                  name="reasonId"
                  label={`Lý do`}
                  rules={[validateForm.required]}
                >
                  <CSelect
                    placeholder="Chọn lý do"
                    options={listReason}
                    disabled={isViewType}
                    isLoading={isLoadingReason}
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
            <CButtonDelete htmlType="submit">Hủy ghép KIT</CButtonDelete>
            <CButtonClose onClick={handleClose} type="default" />
          </Flex>
        </Form>
      </Spin>
    </>
  );
};

export default AddItem;
