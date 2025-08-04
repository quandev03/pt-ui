import { PlusOutlined } from '@ant-design/icons';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import ModalStockPermission from 'apps/Internal/src/modules/PartnerCatalog/components/ModalStockPermission';
import { includes } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductAuthorizationModal from '../components/ProductAuthorizationModal';
import { getColumnsTablePartnerCatalog } from '../constants';
import {
  useGetOrganizationPartner,
  useUpdateStatusPartner,
} from '../queryHooks';
import usePartnerStore from '../stores';
import { IOrganizationUnitDTO } from '../types';
import {
  ApprovalProcessKey,
  CButtonAdd,
  CInput,
  cleanParams,
  decodeSearchParams,
  FilterItemProps,
  formatQueryParams,
  IModeAction,
  LayoutList,
  ModalConfirm,
  TitleHeader,
} from '@vissoft-react/common';
import { Form, Tooltip } from 'antd';
import { pathRoutes } from 'apps/Internal/src/routers';
import useConfigAppStore from '../../Layouts/stores';

export const PartnerCatalogList = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const listRoles = useRolesByRouter();
  const {
    setOpenProductAuthorization,
    setPartnerTarget,
    setOpenStockPermission,
  } = usePartnerStore();
  const [openViewProcessApproval, setOpenViewProcessApproval] =
    useState<boolean>(false);
  const [idViewProcessApproval, setIdViewProcessApproval] = useState<
    string | number
  >();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { mutate: updateStatusPartner } = useUpdateStatusPartner();
  const { data: organizationPartner, isLoading: loadingTable } =
    useGetOrganizationPartner(formatQueryParams(cleanParams(params)));
  const dataTable = useMemo(() => {
    if (!organizationPartner) {
      return [];
    }
    return organizationPartner.content;
  }, [organizationPartner]);

  const {
    params: {
      PARTNER_TYPE = [],
      PARTNER_APPROVAL_STATUS = [],
      PARTNER_STATUS = [],
    },
  } = useConfigAppStore();
  const filters: FilterItemProps[] = useMemo(() => {
    return [
      {
        type: 'Select',
        label: 'Loại đối tác',
        name: 'partnerType',
        options: PARTNER_TYPE,
        placeholder: 'Chọn loại đối tác',
      },
      {
        type: 'Select',
        label: 'Trạng thái phê duyệt',
        name: 'approvalStatus',
        options: PARTNER_APPROVAL_STATUS,
        placeholder: 'Chọn trạng thái phê duyệt',
      },
      {
        type: 'Select',
        label: 'Trạng thái hoạt động',
        name: 'status',
        options: PARTNER_STATUS,
        placeholder: 'Chọn trạng thái hoạt động',
      },
    ];
  }, [PARTNER_TYPE, PARTNER_APPROVAL_STATUS, PARTNER_STATUS]);
  const handleAction = useCallback(
    (action: IModeAction, record: IOrganizationUnitDTO) => {
      switch (action) {
        case IModeAction.READ:
          return navigate(pathRoutes.partnerCatalogView(record.id));
        case IModeAction.UPDATE:
          return navigate(pathRoutes.partnerCatalogEdit(record.id));
        case IModeAction.DELETE:
          ModalConfirm({
            title: 'Xác nhận',
            message: 'Bạn có chắc chắn muốn khóa đối tác này không?',
            handleConfirm: () => {
              updateStatusPartner({
                id: record.id as number,
                status: 0,
                orgCode: record.orgCode,
              });
            },
          });
          return;
        case IModeAction.ACTIVE:
          ModalConfirm({
            title: 'Xác nhận',
            message: 'Bạn có chắc chắn muốn mở khóa đối tác này không?',
            handleConfirm: () => {
              updateStatusPartner({
                id: record.id as number,
                status: 1,
                orgCode: record.orgCode,
              });
            },
          });
          return;
        case IModeAction.PARTNER_USER_MANAGER:
          navigate(pathRoutes.partnerCatalogUserManagement(record.orgCode));
          return;
        case IModeAction.PHONE_NO_STOCK_AUTHORIZATION:
          setPartnerTarget(record);
          setOpenStockPermission(true);
          return;
        case IModeAction.PRODUCT_AUTHORIZATION:
          setPartnerTarget(record);
          setOpenProductAuthorization(true);
          return;
        case IModeAction.VIEW_APPROVAL_PROCESS:
          setOpenViewProcessApproval(true);
          setIdViewProcessApproval(record.id);
          return;
        default:
          break;
      }
    },
    [navigate]
  );
  const handleAdd = useCallback(() => {
    navigate(pathRoutes.partnerCatalogAdd);
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      ...params,
      status:
        params.status === 0 || params.status ? String(params.status) : null,
    });
  }, []);
  const actionComponent = useMemo(() => {
    return (
      <div>
        {!includes(listRoles, IModeAction.CREATE) && (
          <CButtonAdd onClick={handleAdd} />
        )}
      </div>
    );
  }, [handleAdd, listRoles]);
  return (
    <>
      <LayoutList
        title="Quản lý đối tác"
        filterItems={filters}
        actionComponent={actionComponent}
        searchComponent={
          <Tooltip title="Nhập tên hoặc mã đối tác" placement="right">
            <Form.Item label="" name="q" className="!mb-0">
              <CInput placeholder="Nhập tên hoặc mã đối tác" maxLength={100} />
            </Form.Item>
          </Tooltip>
        }
      />
    </>
  );
};
