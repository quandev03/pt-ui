import { PlusOutlined } from '@ant-design/icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import CTable from '@react/commons/Table';
import { TitleHeader } from '@react/commons/Template/style';
import { ACTION_MODE_ENUM } from '@react/commons/types';
import { ActionsTypeEnum } from '@react/constants/app';
import {
  cleanParams,
  decodeSearchParams,
  queryParams,
} from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Button, Form, Tooltip } from 'antd';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import ModalViewApprovalProcess from 'apps/Internal/src/components/ModalViewApprovalProcess';
import { ApprovalProcessKey } from 'apps/Internal/src/constants/constants';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import ModalStockPermission from 'apps/Internal/src/modules/PartnerCatalog/components/ModalStockPermission';
import { includes } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProductCategoryQuery } from '../../ProductCatalog/hooks/useProductCategoryQuery';
import ProductAuthorizationModal from '../components/ProductAuthorizationModal';
import { getColumnsTablePartnerCatalog } from '../constants';
import {
  useGetOrganizationPartner,
  useUpdateStatusPartner,
} from '../queryHooks';
import usePartnerStore from '../stores';
import { IOrganizationUnitDTO } from '../types';

const PartnerCatalogList = () => {
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
  useProductCategoryQuery();
  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.PARTNER_CATALOG_LIST
  );
  const { mutate: updateStatusPartner } = useUpdateStatusPartner();
  const { data: organizationPartner, isLoading: loadingTable } =
    useGetOrganizationPartner(queryParams(cleanParams(params)));
  const dataTable = useMemo(() => {
    if (!organizationPartner) {
      return [];
    }
    return organizationPartner.content;
  }, [organizationPartner]);

  const {
    PARTNER_TYPE = [],
    PARTNER_STATUS = [],
    PARTNER_APPROVAL_STATUS = [],
  } = useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);

  const items: ItemFilter[] = useMemo(() => {
    return [
      {
        label: 'Loại đối tác',
        value: (
          <Form.Item label="" name="partnerType" className="w-48 mb-0">
            <CSelect
              options={PARTNER_TYPE ?? []}
              placeholder="Loại đối tác"
              showSearch={false}
            />
          </Form.Item>
        ),
      },
      {
        label: 'Trạng thái phê duyệt',
        value: (
          <Form.Item label="" name="approvalStatus" className="w-48 mb-0">
            <CSelect
              options={PARTNER_APPROVAL_STATUS ?? []}
              placeholder="Trạng thái phê duyệt"
              showSearch={false}
            />
          </Form.Item>
        ),
      },
      {
        label: 'Trạng thái hoạt động',
        value: (
          <Form.Item label="" name="status" className="w-48 mb-0">
            <CSelect
              options={PARTNER_STATUS ?? []}
              placeholder="Trạng thái hoạt động"
              showSearch={false}
            />
          </Form.Item>
        ),
      },
    ];
  }, [PARTNER_TYPE, PARTNER_STATUS, PARTNER_APPROVAL_STATUS]);

  const handleAction = useCallback(
    (action: ACTION_MODE_ENUM, record: IOrganizationUnitDTO) => {
      switch (action) {
        case ACTION_MODE_ENUM.VIEW:
          return navigate(pathRoutes.partnerCatalogView(record.id));
        case ACTION_MODE_ENUM.EDIT:
          return navigate(pathRoutes.partnerCatalogEdit(record.id));
        case ACTION_MODE_ENUM.INACTIVE:
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
        case ACTION_MODE_ENUM.ACTIVE:
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
        case ACTION_MODE_ENUM.PARTNER_USER_MANAGER:
          navigate(pathRoutes.partnerCatalogUserManagement(record.orgCode));
          return;
        case ACTION_MODE_ENUM.PHONE_NO_STOCK_AUTHORIZATION:
          setPartnerTarget(record);
          setOpenStockPermission(true);
          return;
        case ACTION_MODE_ENUM.PRODUCT_AUTHORIZATION:
          setPartnerTarget(record);
          setOpenProductAuthorization(true);
          return;
        case ACTION_MODE_ENUM.VIEW_APPROVAL_PROCESS:
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

  return (
    <div>
      <TitleHeader>Quản lý đối tác</TitleHeader>
      <div className="flex flex-wrap justify-between">
        <Form
          form={form}
          onFinish={handleSearch}
          validateTrigger={['onSubmit', 'onBlur']}
        >
          <CFilter
            items={items}
            validQuery={REACT_QUERY_KEYS.PARTNER_CATALOG_LIST}
            searchComponent={
              <Tooltip title="Nhập tên hoặc mã đối tác" placement="right">
                <Form.Item label="" name="q" className="!mb-0">
                  <CInput
                    placeholder="Nhập tên hoặc mã đối tác"
                    maxLength={100}
                    prefix={<FontAwesomeIcon icon={faSearch} />}
                    onBlur={() => {
                      form.setFieldValue('q', form.getFieldValue('q')?.trim());
                    }}
                  />
                </Form.Item>
              </Tooltip>
            }
          />
        </Form>
        <div>
          {includes(listRoles, ActionsTypeEnum.CREATE) && (
            <Button icon={<PlusOutlined />} type="primary" onClick={handleAdd}>
              <FormattedMessage id="common.add" />
            </Button>
          )}
        </div>
      </div>
      <div className="mt-4">
        <CTable
          columns={getColumnsTablePartnerCatalog(
            params,
            listRoles,
            PARTNER_TYPE,
            PARTNER_STATUS,
            PARTNER_APPROVAL_STATUS,
            handleAction
          )}
          dataSource={dataTable}
          loading={loadingTable}
          otherHeight={50}
          rowKey={'id'}
          pagination={{
            total: organizationPartner?.totalElements,
          }}
        />
      </div>
      <ProductAuthorizationModal />
      <ModalViewApprovalProcess
        open={openViewProcessApproval}
        onClose={() => setOpenViewProcessApproval(false)}
        objectName={ApprovalProcessKey.ORGANIZATION_UNIT}
        id={idViewProcessApproval}
      />
      <ModalStockPermission />
    </div>
  );
};
export default PartnerCatalogList;
