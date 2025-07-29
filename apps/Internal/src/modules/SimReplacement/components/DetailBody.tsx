import CTable from '@react/commons/Table';
import { Text } from '@react/commons/Template/style';
import { formatDate, formatDateTime } from '@react/constants/moment';
import { Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetDetail } from '../hooks/useDetail';
import useSimReplacementStore from '../store';
import { ISimReplacementDetail } from '../types';
import { useGetOrgPartner } from '../hooks/useGetOrgPartner';
import { CButtonClose } from '@react/commons/Button';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
const DetailBody = () => {
  const { detailParams, setDetailParams, resetSimReplacementStore } =
    useSimReplacementStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: dataTable } = useGetDetail({ params: detailParams, id });
  const { data: orgPartnerList } = useGetOrgPartner();
  const { COMBINE_KIT_SIM_TYPE = [] } = useGetDataFromQueryKey<ParamsOption>([
    REACT_QUERY_KEYS.GET_PARAMS,
  ]);
  const handleClose = () => {
    navigate(pathRoutes.simReplacement);
    resetSimReplacementStore();
  };
  const handleChangePagination = (page: number, pageSize: number) => {
    setDetailParams({ ...detailParams, page: page - 1, size: pageSize });
  };

  const columns: ColumnsType<ISimReplacementDetail> = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render(_, __, index) {
        return <Text>{index + 1 + detailParams.page * detailParams.size}</Text>;
      },
    },
    {
      title: 'Số thuê bao',
      dataIndex: 'isdn',
      width: 130,
      align: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Loại mặt hàng',
      dataIndex: 'simType',
      width: 130,
      align: 'left',
      render(value) {
        const itemType = COMBINE_KIT_SIM_TYPE?.find(
          (item) => item.value === value
        )?.label;
        return (
          <Tooltip title={itemType} placement="topLeft">
            <Text>{itemType}</Text>
          </Tooltip>
        );
      },
    },
    // {
    //   title: 'Serial SIM cũ',
    //   dataIndex: 'oldSerial',
    //   width: 150,
    //   align: 'left',
    //   render(value) {
    //     return (
    //       <Tooltip title={value} placement="topLeft">
    //         <Text>{value}</Text>
    //       </Tooltip>
    //     );
    //   },
    // },
    {
      title: 'Serial SIM mới',
      dataIndex: 'newSerial',
      width: 150,
      align: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'NPP thực hiện đổi SIM',
      dataIndex: 'orgName',
      width: 150,
      align: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    // {
    //   title: 'Ngày chặn 1 chiều thực tế',
    //   dataIndex: 'oneBlockDate',
    //   width: 130,
    //   align: 'left',
    //   render(value) {
    //     return (
    //       <Tooltip
    //         title={value ? dayjs(value).format(formatDateTime) : null}
    //         placement="topLeft"
    //       >
    //         <Text>{value ? dayjs(value).format(formatDate) : null}</Text>
    //       </Tooltip>
    //     );
    //   },
    // },
    // {
    //   title: 'Ngày chặn 2 chiều thực tế',
    //   dataIndex: 'twoBlockDate',
    //   width: 130,
    //   align: 'left',
    //   render(value) {
    //     return (
    //       <Tooltip
    //         title={value ? dayjs(value).format(formatDateTime) : null}
    //         placement="topLeft"
    //       >
    //         <Text>{value ? dayjs(value).format(formatDate) : null}</Text>
    //       </Tooltip>
    //     );
    //   },
    // },
    // {
    //   title: 'Ngày thu hồi thực tế',
    //   dataIndex: 'closeDate',
    //   width: 130,
    //   align: 'left',
    //   render(value) {
    //     return (
    //       <Tooltip
    //         title={value ? dayjs(value).format(formatDateTime) : null}
    //         placement="topLeft"
    //       >
    //         <Text>{value ? dayjs(value).format(formatDate) : null}</Text>
    //       </Tooltip>
    //     );
    //   },
    // },
    {
      title: 'Ngày chặn 1 chiều dự kiến',
      dataIndex: 'oneBlockExpectDate',
      width: 130,
      align: 'left',
      render(value) {
        return (
          <Tooltip
            title={value ? dayjs(value).format(formatDateTime) : null}
            placement="topLeft"
          >
            <Text>{value ? dayjs(value).format(formatDate) : null}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày chặn 2 chiều dự kiến',
      dataIndex: 'twoBlockExpectDate',
      width: 130,
      align: 'left',
      render(value) {
        return (
          <Tooltip
            title={value ? dayjs(value).format(formatDateTime) : null}
            placement="topLeft"
          >
            <Text>{value ? dayjs(value).format(formatDate) : null}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: ' Ngày dự kiến cắt hủy hiện tại',
      dataIndex: 'closeExpectDate',
      width: 130,
      align: 'left',
      render(value) {
        return (
          <Tooltip
            title={value ? dayjs(value).format(formatDateTime) : null}
            placement="topLeft"
          >
            <Text>{value ? dayjs(value).format(formatDate) : null}</Text>
          </Tooltip>
        );
      },
    },

    // {
    //   title: 'Ngày chặn thu hồi dự kiến',
    //   dataIndex: 'closeExpectDate',
    //   width: 130,
    //   align: 'left',
    //   render(value) {
    //     return (
    //       <Tooltip
    //         title={value ? dayjs(value).format(formatDateTime) : null}
    //         placement="topLeft"
    //       >
    //         <Text>{value ? dayjs(value).format(formatDate) : null}</Text>
    //       </Tooltip>
    //     );
    //   },
    // },
    {
      title: 'Thời gian đổi SIM thực tế',
      dataIndex: 'changeSimDate',
      width: 130,
      align: 'left',
      render(value) {
        return (
          <Tooltip
            title={value ? dayjs(value).format(formatDateTime) : null}
            placement="topLeft"
          >
            <Text>{value ? dayjs(value).format(formatDate) : null}</Text>
          </Tooltip>
        );
      },
    },
    // {
    //   title: 'Gói cước đăng ký gần nhất',
    //   dataIndex: 'lastPckCode',
    //   width: 130,
    //   align: 'left',
    //   render(value) {
    //     return (
    //       <Tooltip title={value} placement="topLeft">
    //         <Text>{value}</Text>
    //       </Tooltip>
    //     );
    //   },
    // },
    // {
    //   title: 'Ngày hết hạn gói cước',
    //   dataIndex: 'pckExpiryDate',
    //   width: 130,
    //   align: 'left',
    //   render(value) {
    //     return (
    //       <Tooltip
    //         title={value ? dayjs(value).format(formatDateTime) : null}
    //         placement="topLeft"
    //       >
    //         <Text>{value ? dayjs(value).format(formatDate) : null}</Text>
    //       </Tooltip>
    //     );
    //   },
    // },
    {
      title: 'Mã kho hàng',
      dataIndex: 'stockCode',
      width: 130,
      align: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    // {
    //   title: 'NPP cũ',
    //   dataIndex: 'shopCode',
    //   width: 130,
    //   align: 'left',
    //   render(value) {
    //     return (
    //       <Tooltip title={value} placement="topLeft">
    //         <Text>{value}</Text>
    //       </Tooltip>
    //     );
    //   },
    // },
    {
      title: 'User thực hiện',
      dataIndex: 'createdBy',
      width: 150,
      align: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Tên file Upload',
      dataIndex: 'fileUrl',
      width: 130,
      align: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
  ];
  return (
    <>
      <CTable
        columns={columns}
        dataSource={dataTable?.content || []}
        pagination={{
          current: detailParams.page + 1,
          pageSize: detailParams.size,
          total: dataTable?.totalElements || 0,
          onChange: handleChangePagination,
        }}
        otherHeight={85}
      />
      <CButtonClose onClick={handleClose} className="mt-4 float-end" />
    </>
  );
};
export default DetailBody;
