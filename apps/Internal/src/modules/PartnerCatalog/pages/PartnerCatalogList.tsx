import {
  CButtonAdd,
  cleanParams,
  decodeSearchParams,
  FilterItemProps,
  formatQueryParams,
  IModeAction,
  LayoutList,
  usePermissions,
} from '@vissoft-react/common';
import { Form } from 'antd';
import { pathRoutes } from 'apps/Internal/src/routers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useConfigAppStore from '../../Layouts/stores';
import ModalAssignPackage from '../components/ModalAssignPackage';
import { StatusEnum } from '../constants';
import { useGetOrganizationPartner } from '../hook';
import { useColumnsTablePartnerCatalog } from '../hook/useColumnsTablePartnerCatalog';
import { IOrganizationUnitDTO } from '../types';

export const PartnerCatalogList = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { data: organizationPartner, isLoading: loadingTable } =
    useGetOrganizationPartner(formatQueryParams(cleanParams(params)));
  const {
    params: { PARTNER_STATUS = [] },
  } = useConfigAppStore();
  const [isOpenAssignModal, setIsOpenAssignModal] = useState(false);
  const [selectedPartner, setSelectedPartner] =
    useState<IOrganizationUnitDTO>();
  const filters: FilterItemProps[] = useMemo(() => {
    return [
      {
        type: 'Select',
        label: 'Trạng thái',
        name: 'status',
        options: [
          {
            label: 'Tất cả',
            value: '',
          },
          {
            label: 'Hoạt động',
            value: String(StatusEnum.ACTIVE),
          },
          {
            label: 'Không hoạt động',
            value: String(StatusEnum.INACTIVE),
          },
        ],
        placeholder: 'Chọn trạng thái',
      },
    ];
  }, [PARTNER_STATUS]);
  const handleAction = useCallback(
    (action: IModeAction, record: IOrganizationUnitDTO) => {
      switch (action) {
        case IModeAction.READ:
          return navigate(pathRoutes.partnerCatalogView(record.id));
        case IModeAction.UPDATE:
          return navigate(pathRoutes.partnerCatalogEdit(record.id));
        case IModeAction.PARTNER_USER_MANAGER:
          navigate(pathRoutes.partnerCatalogUserManagement(record.orgCode));
          return;
        case IModeAction.PACKAGE_AUTHORIZATION:
          setIsOpenAssignModal(true);
          setSelectedPartner(record);
        default:
          break;
      }
    },
    [navigate]
  );

  const columns = useColumnsTablePartnerCatalog(
    params,
    PARTNER_STATUS,
    handleAction
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
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const actionComponent = useMemo(() => {
    return (
      <div>{permission.canCreate && <CButtonAdd onClick={handleAdd} />}</div>
    );
  }, [handleAdd, permission]);
  return (
    <>
      <LayoutList
        loading={loadingTable}
        title="Quản lý đối tác"
        filterItems={filters}
        actionComponent={actionComponent}
        searchComponent={
          <LayoutList.SearchComponent
            name="q"
            tooltip="Nhập tên hoặc mã đối tác"
            placeholder="Nhập tên hoặc mã đối tác"
          />
        }
        columns={columns}
        data={organizationPartner}
      />
      <ModalAssignPackage
        open={isOpenAssignModal}
        onClose={() => setIsOpenAssignModal(false)}
        partnerId={selectedPartner?.id!}
      />
    </>
  );
};
