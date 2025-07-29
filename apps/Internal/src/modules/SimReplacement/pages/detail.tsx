import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton, { CButtonExport } from '@react/commons/Button';
import { CRangePicker } from '@react/commons/DatePicker';
import CInput from '@react/commons/Input';
import {
  BtnGroupFooter,
  RowHeader,
  TitleHeader,
} from '@react/commons/Template/style';
import { formatDate, formatDateEnglishV2 } from '@react/constants/moment';
import { prefixCustomerService } from '@react/url/app';
import { Flex, Form } from 'antd';
import { useExportMutation } from 'apps/Internal/src/hooks/useExportMutation';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DetailBody from '../components/DetailBody';
import { useGetDetail } from '../hooks/useDetail';
import useSimReplacementStore from '../store';
import { queryParams } from '@react/helpers/utils';
import { AnyElement } from '@react/commons/types';
import { includes } from 'lodash';
import { ActionsTypeEnum } from '@react/constants/app';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
const DetailPage = () => {
  const [form] = Form.useForm();
  const actionByRole = useRolesByRouter();
  const { detailParams, setDetailParams, resetSimReplacementStore } =
    useSimReplacementStore();
  const { id } = useParams();
  const { refetch } = useGetDetail({ params: detailParams, id });
  const { mutate: downloadFile } = useExportMutation();
  useEffect(() => {
    form.setFieldValue('rangePicker', [dayjs().subtract(29, 'day'), dayjs()]);
  }, []);
  const handleFinish = (values: any) => {
    const [fromDate, toDate] = values.rangePicker || [
      dayjs().subtract(29, 'day'),
      dayjs(),
    ];
    const fromDateString = fromDate.format(formatDateEnglishV2);
    const toDateString = toDate.format(formatDateEnglishV2);
    if (
      form.getFieldValue('q') === detailParams.q &&
      fromDateString === detailParams.fromDate &&
      toDateString === detailParams.toDate
    ) {
      refetch();
      console.log('refetch');
    } else {
      setDetailParams({
        ...detailParams,
        q: values.q,
        fromDate: fromDateString,
        toDate: toDateString,
        page: 0,
      });
    }
  };
  const handleRefresh = () => {
    resetSimReplacementStore();
    form.setFieldsValue({
      q: '',
      rangePicker: [dayjs().subtract(29, 'day'), dayjs()],
    });
  };
  const handleExportExcel = () => {
    const { page, size, ...rest } = detailParams;
    downloadFile({
      uri: `${prefixCustomerService}/change-sim-bulk/export/${id}/detail`,
      params: queryParams(rest as AnyElement),
      filename: `Chi_tiet_doi_sim_hang_loat-${dayjs().format(
        'DDMMYYYYHHmmss'
      )}.xlsx`,
    });
  };
  return (
    <>
      <TitleHeader>Xem chi tiết đổi SIM hàng loạt</TitleHeader>
      <RowHeader>
        <Form form={form} onFinish={handleFinish}>
          <Flex gap={10} className="!mx-0">
            <Form.Item name="q" label={''} className="w-[350px]">
              <CInput
                placeholder={'Nhập số thuê bao, serial SIM mới'}
                maxLength={50}
              />
            </Form.Item>
            <Form.Item name="rangePicker">
              <CRangePicker
                placeholder={['Từ ngày', 'Đến ngày']}
                format={formatDate}
                allowClear={false}
              />
            </Form.Item>
            <CButton htmlType="submit">Tìm kiếm</CButton>
            <FontAwesomeIcon
              icon={faRotateLeft}
              size="lg"
              className="cursor-pointer self-center"
              onClick={handleRefresh}
              title="Làm mới"
            />
            <BtnGroupFooter>
              {includes(actionByRole, ActionsTypeEnum.EXPORT_EXCEL) && (
                <CButtonExport onClick={handleExportExcel}>
                  Xuất excel
                </CButtonExport>
              )}
            </BtnGroupFooter>
          </Flex>
        </Form>
      </RowHeader>
      <DetailBody />
    </>
  );
};
export default DetailPage;
