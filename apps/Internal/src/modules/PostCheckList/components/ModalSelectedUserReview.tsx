import { Button, CModalConfirm } from '@react/commons/index';
import CModal from '@react/commons/Modal';
import CSelect from '@react/commons/Select';
import { BtnGroupFooter } from '@react/commons/Template/style';
import { Col, Form } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import useStorePostCheckList from '../store';
import { MESSAGE } from '@react/utils/message';
import { useParams } from 'react-router-dom';
import useListReAppoval from '../hooks/useListReAppoval';
import useReAppoval from '../hooks/useReAppoval';
import { useGetAllUsers } from 'apps/Internal/src/components/layouts/queryHooks';
import { useReasonCustomerService } from 'apps/Internal/src/hooks/useReasonList';

interface Props {
  open: boolean;
  ids?: string[];
  auditNote?: string;
  setSelectedRowKeys?: (value: any) => void;
}

export const ModalSelectedUserReview = ({
  open,
  ids,
  auditNote,
  setSelectedRowKeys,
}: Props) => {
  const [form] = Form.useForm();
  const { data: dataReason } = useReasonCustomerService('AUDIT_REJECT');
  const listReason = useMemo(() => {
    if (!dataReason) return [];
    return dataReason?.map((item) => ({
      label: item.name,
      value: item.code,
    }));
  }, [dataReason]);
  const { resetGroupStore, setIsHiddenModelSelectedReview } =
    useStorePostCheckList();
  const handleCloseModal = useCallback(() => {
    setSelectedRowKeys && setSelectedRowKeys([]);
    resetGroupStore();
    form.resetFields();
  }, [resetGroupStore]);
  const { data: listUser } = useGetAllUsers({ isPartner: false });
  const listUserPostCheckList = useMemo(() => {
    if (!listUser) return [];
    return listUser
      .filter((item) => item.status === 1)
      .map((item) => ({
        label: item.username,
        value: item.id,
      }));
  }, [listUser]);
  useEffect(() => {
    return () => {
      setIsHiddenModelSelectedReview(false);
    };
  }, [setIsHiddenModelSelectedReview]);
  const { id } = useParams();
  const { isPending: isLoadingReListApproval, mutate: updateReListAppoval } =
    useListReAppoval();
  const { isPending: isLoadingReApproval, mutate: updateReAppoval } =
    useReAppoval();

  const handleSave = (value: any) => {
    CModalConfirm({
      message: 'Bạn có chắc chắn muốn kiểm duyệt lại hồ sơ này?',
      onOk: () => {
        const assignedUserName =
          listUser?.find((item) => item.id === value.assignedUserId)
            ?.username ?? '';

        if (id) {
          updateReAppoval(
            {
              ids: [id],
              assignedUserId: value.assignedUserId,
              assignedUserName,
              reasonRejectCode: value.reasonRejectCode,
              auditNote: auditNote ?? '',
            },
            { onSuccess: handleCloseModal }
          );
        } else {
          updateReListAppoval(
            {
              ids: ids ?? [],
              assignedUserId: value.assignedUserId,
              assignedUserName,
              reasonRejectCode: value.reasonRejectCode,
            },
            { onSuccess: handleCloseModal }
          );
        }
      },
    });
  };

  return (
    <CModal
      open={open}
      maskClosable
      title="Kiểm duyệt lại"
      onCancel={handleCloseModal}
      closable={true}
      footer={null}
      loading={isLoadingReListApproval || isLoadingReApproval}
    >
      <Form
        labelCol={{ span: 7 }}
        onFinish={handleSave}
        colon={false}
        form={form}
      >
        <Form.Item
          label="User kiểm duyệt"
          rules={[{ required: true, message: MESSAGE.G06 }]}
          name="assignedUserId"
        >
          <CSelect
            options={listUserPostCheckList}
            placeholder="Chọn người kiểm duyệt"
          />
        </Form.Item>
        <Form.Item
          label="Chọn lý do"
          rules={[{ required: true, message: MESSAGE.G06 }]}
          name="reasonRejectCode"
        >
          <CSelect options={listReason} placeholder="Chọn lý do" />
        </Form.Item>
        <Col span={24}>
          <BtnGroupFooter className="!justify-center mt-7">
            <Button onClick={handleCloseModal} type="default">
              Đóng
            </Button>
            <Button htmlType="submit">Kiểm duyệt lại</Button>
          </BtnGroupFooter>
        </Col>
      </Form>
    </CModal>
  );
};
