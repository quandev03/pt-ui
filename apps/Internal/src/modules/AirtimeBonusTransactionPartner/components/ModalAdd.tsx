import {
  CButtonClose,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import { CModalConfirm, CNumberInput } from '@react/commons/index';
import CSelect from '@react/commons/Select';
import CTableUploadFile from '@react/commons/TableUploadFile';
import Show from '@react/commons/Template/Show';
import { TitleHeader, Wrapper } from '@react/commons/Template/style';
import CTextArea from '@react/commons/TextArea';
import { ModelStatus } from '@react/commons/types';
import { ActionType } from '@react/constants/app';
import { DeliveryOrderApprovalStatusList } from '@react/constants/status';
import { MESSAGE } from '@react/utils/message';
import { Col, Form, Row, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdd } from '../hook/useAdd';
import useGetFileDownload from '../hook/useGetFileDownload';
import useListPartner from '../hook/useListPartner';
import useView from '../hook/useView';
import { IParamsOrgPartner, IValueForm } from '../type';
import CButtonCancel from './CButtonCancel';
import { useDelete } from '../hook/useDelete';
import useDetailPartner from '../hook/useDetailPartner';

const ModalAdd = ({
  isEnabledApproval,
  typeModal,
}: {
  isEnabledApproval: boolean;
  typeModal: ActionType;
}) => {
  const [form] = useForm();
  const { id } = useParams();
  const [params, setParams] = useState<IParamsOrgPartner>({
    page: 0,
    size: 20,
    approvalStatus: DeliveryOrderApprovalStatusList.APPROVED,
    status: ModelStatus.ACTIVE,
  });
  const { data: dataDetail } = useView(id ?? '');
  const {
    data: orgPartners = [],
    fetchNextPage:orgPartnerstFetchNextPage,
    hasNextPage: orgPartnersHasNextPage,
  } = useListPartner(params);
  const handleScrollDatasets = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.target as HTMLDivElement;
      if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
        if (orgPartnersHasNextPage) {
          orgPartnerstFetchNextPage();
        }
      }
    },
    [orgPartnerstFetchNextPage, orgPartnersHasNextPage]
  );
  const {mutate: dataDetailPartner} = useDetailPartner((data=> {
    form.setFieldValue("orgId", data.orgName)
  }));
  const navigate = useNavigate();
  const { mutate: add, isPending: isPendingAdd } = useAdd(() => {
    if (submitType === 'saveAndAdd') {
      form.resetFields();
    } else {
      navigate(-1);
    }
  });
  const [submitType, setSubmitType] = useState<string>('');
  const handleSubmit = useCallback(
    (values: IValueForm) => {
      const request = {
        orgId: values.orgId,
        amount: values.amount,
        description: values.description,
        attachmentDescriptions:
          values.files &&
          values.files.map((item: any) => {
            return item.desc;
          }),
      };
      const attachmentFiles = {
        files: values.files
          ? values.files.reduce((acc: any, item: any) => {
              acc.push(item.files);
              return acc;
            }, [])
          : [],
      };
      const data = {
        request,
        attachmentFiles,
      };
      add(data);
    },
    [add]
  );
  useEffect(() => {
    if (dataDetail) {
      dataDetailPartner(dataDetail.orgId);
      form.setFieldsValue({
        ...dataDetail,
        files: dataDetail.attachments.map((item: any) => {
          return {
            name: item.fileName,
            desc: item.description,
            size: item.fileVolume,
            date: item.createdDate,
            id: item.id,
          };
        }),
      });
    }
  }, [dataDetail,dataDetailPartner]);
  const handleSearch = debounce((value: string) => {
    setParams({
      ...params,
      q: value,
      page: 0,
    });
  }, 500);
  const { mutate: getFileDownload } = useGetFileDownload();
  const handleDownloadFile = (record: any) => {
    getFileDownload({
      id: record.id as number,
      fileName: record?.name ?? '',
    });
  };
  const { mutate: deleteAction } = useDelete(() => navigate(-1));
  const handleCancel = useCallback(() => {
    CModalConfirm({
      message: 'Bạn có chắc chắn muốn hủy giao dịch cộng tiền airtime không?',
      onOk: () => id && deleteAction(Number(id)),
    });
  }, [deleteAction,id]);
  return (
    <Wrapper>
        <TitleHeader>{typeModal === ActionType.ADD ? "Tạo giao dịch cộng tiền airtime" : "Xem chi tiết giao dịch cộng tiền airtime" }</TitleHeader>
        <Form
          layout="horizontal"
          form={form}
          onFinish={handleSubmit}
          disabled={typeModal === ActionType.VIEW || isEnabledApproval}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: MESSAGE.G06,
                  },
                ]}
                labelCol={{ style: { minWidth: '100px' } }}
                name="orgId"
                label="Đối tác"
              >
                <CSelect
                  onPopupScroll={handleScrollDatasets}
                  onSearch={handleSearch}
                  options={orgPartners}
                  placeholder="Chọn đối tác"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Số tiền cộng"
                name="amount"
                required
                rules={[
                  {
                    validator(_, value) {
                      if (!value || value.length === 0) {
                        return Promise.reject('Không được để trống trường này');
                      } else {
                        return Promise.resolve();
                      }
                    },
                  },
                ]}
              >
                <CNumberInput
                  disabled={typeModal === ActionType.VIEW || isEnabledApproval}
                  maxLength={11}
                  placeholder="Nhập số tiền cộng"
                  addonAfter="VND"
                />
              </Form.Item>
            </Col>
          </Row>
          <div>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  labelCol={{ style: { minWidth: '100px' } }}
                  name="description"
                  label="Ghi chú"
                >
                  <CTextArea
                    placeholder=" Nhập ghi chú"
                    maxLength={200}
                    rows={3}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <Col span={24}>
            <CTableUploadFile
              showAction={typeModal === ActionType.ADD}
              disabled={typeModal !== ActionType.ADD}
              onDownload={
                typeModal !== ActionType.ADD ? handleDownloadFile : undefined
              }
            />
          </Col>
          <Show.When isTrue={!isEnabledApproval}>
            <Row className="mt-8" justify="end">
              <Space size="middle">
                <Show.When isTrue={typeModal === ActionType.ADD}>
                  <CButtonSaveAndAdd
                    loading={isPendingAdd}
                    htmlType="submit"
                    className='mr-4'
                    onClick={() => setSubmitType('saveAndAdd')}
                  />
                  <CButtonSave
                    loading={isPendingAdd}
                    onClick={() => setSubmitType('save')}
                    htmlType="submit"
                  />
                </Show.When>
               <Show.When isTrue={typeModal === ActionType.VIEW && dataDetail && dataDetail.approvalStatus === DeliveryOrderApprovalStatusList.PENDING}>
                  <CButtonCancel
                      onClick={handleCancel}
                      disabled={false}
                      type="default"
                    >
                      Hủy
                  </CButtonCancel>
               </Show.When>
                <CButtonClose
                  disabled={false}
                  onClick={() => navigate(-1)}
                  type="default"
                >
                  Đóng
                </CButtonClose>
              </Space>
            </Row>
          </Show.When>
        </Form>
    </Wrapper>
  );
};
export default ModalAdd;
