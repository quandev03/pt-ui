import { IModeAction, RenderCell, useActionMode } from '@vissoft-react/common';
import { Form } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useGetDetailReportPartner } from '../../hooks';
import { IProductItem } from '../../types';
import { ColumnsType } from 'antd/es/table';

export const useLogicActionReport = () => {
  const navigate = useNavigate();
  const pathname = useLocation();
  const [form] = Form.useForm();
  const { id } = useParams();

  const actionMode = useActionMode();
  const {
    mutate: getReportAction,
    isPending: loadingGetReport,
    data: reportDetail,
  } = useGetDetailReportPartner((report) => {
    form.setFieldsValue({
      ...report,
    });
  });

  const columns: ColumnsType<IProductItem> = useMemo(
    () => [
      {
        title: 'STT',
        align: 'left',
        fixed: 'left',
        width: 50,
        render(_, __, index) {
          return (
            <RenderCell
            // value={index + 1 + reportDetail.page * reportDetail.size}
            // tooltip={index + 1 + reportDetail.page * reportDetail.size}
            />
          );
        },
      },
      {
        title: 'Số thuê bao',
        dataIndex: 'phoneNumber',
        width: 200,
        align: 'left',
        render(value, record) {
          return <RenderCell value={value} tooltip={value} />;
        },
      },
      {
        title: 'Serial SIM',
        dataIndex: 'serialNumber',
        width: 200,
        align: 'left',
        render(value, record) {
          return <RenderCell value={value} tooltip={value} />;
        },
      },
      {
        title: 'Gói cước',
        dataIndex: 'package',
        width: 200,
        align: 'left',
        render(value, record) {
          return <RenderCell value={value} tooltip={value} />;
        },
      },
      {
        title: 'Tiền gói cước',
        dataIndex: 'packageFee',
        width: 200,
        align: 'left',
        render(value, record) {
          return <RenderCell value={value} tooltip={value} />;
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (id) {
      getReportAction(id);
    } else {
      form.setFieldsValue({ status: true });
    }
  }, [form, getReportAction, id, pathname]);

  const Title = useMemo(() => {
    switch (actionMode) {
      case IModeAction.READ:
        return 'Xem chi tiết đơn hàng đối tác';
    }
  }, [actionMode]);

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return {
    form,
    loadingGetReport,
    reportDetail,
    handleClose,
    Title,
    actionMode,
    columns,
  };
};
