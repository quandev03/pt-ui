import { PlusOutlined } from '@ant-design/icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import CTable from '@react/commons/Table';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { ACTION_MODE_ENUM, ModelStatus } from '@react/commons/types';
import { ActionsTypeEnum } from '@react/constants/app';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Button, Form, Row, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { includes } from 'lodash';
import { FC, memo, useCallback, useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getColumnsTableRole } from '../constants';
import { useGetRoles, useSupportDeleteRole } from '../queryHooks';
import { IRoleItem, IRoleParams, PropsRole } from '../types';
import { Wrapper } from './style';

const ListRole: FC<PropsRole> = memo(({ isPartner }) => {
  const actionByRole = useRolesByRouter();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const params = decodeSearchParams(searchParams);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { handleSearch } = useSearchHandler(REACT_QUERY_KEYS.GET_ALL_ROLES);

  useEffect(() => {
    form.setFieldsValue(params);
  }, [pathname]);

  const handleAction = useCallback(
    (type: ACTION_MODE_ENUM, record: IRoleItem) => {
      switch (type) {
        case ACTION_MODE_ENUM.VIEW:
          if (isPartner) {
            navigate(pathRoutes.rolePartnerManagerView(record.id));
          } else {
            navigate(pathRoutes.roleManagerView(record.id));
          }
          return;
        case ACTION_MODE_ENUM.CREATE:
          if (isPartner) {
            navigate(pathRoutes.role_partner_manager_add);
          } else {
            navigate(pathRoutes.role_manager_add);
          }
          return;
        case ACTION_MODE_ENUM.EDIT:
          if (isPartner) {
            navigate(pathRoutes.rolePartnerManagerEdit(record.id));
          } else {
            navigate(pathRoutes.roleManagerEdit(record.id));
          }
          return;
      }
    },
    [navigate]
  );

  const { mutate: deleteRole } = useSupportDeleteRole();
  const { data: listRole, isLoading: loadingTable } = useGetRoles(
    queryParams<IRoleParams>({ ...params, isPartner })
  );

  const handleDeleteRole = useCallback(
    (role: IRoleItem) => {
      ModalConfirm({
        title: 'Bạn có chắc chắn muốn Xoá bản ghi không?',
        message: 'Các dữ liệu liên quan cũng sẽ bị xoá',
        handleConfirm: () => {
          deleteRole({
            id: role.id,
            isPartner,
          });
        },
      });
    },
    [deleteRole]
  );
  const handleAddRole = useCallback(() => {
    if (isPartner) {
      navigate(pathRoutes.role_partner_manager_add);
    } else {
      navigate(pathRoutes.role_manager_add);
    }
  }, [isPartner, navigate]);

  const items: ItemFilter[] = useMemo(() => {
    return [
      {
        label: 'Trạng thái',
        value: (
          <Form.Item label="" name="status" className="w-40">
            <CSelect
              options={[
                {
                  label: <FormattedMessage id="common.all" />,
                  value: null,
                },
                {
                  label: <FormattedMessage id="common.active" />,
                  value: ModelStatus.ACTIVE,
                },
                {
                  label: <FormattedMessage id="common.inactive" />,
                  value: ModelStatus.INACTIVE,
                },
              ]}
              placeholder="Trạng thái"
            />
          </Form.Item>
        ),
      },
    ];
  }, [pathname, isPartner]);

  const columns: ColumnsType<IRoleItem> = useMemo(() => {
    return getColumnsTableRole(params, actionByRole, {
      onAction: handleAction,
      onDelete: handleDeleteRole,
    });
  }, [params, actionByRole, handleAction, handleDeleteRole]);

  return (
    <Wrapper id="wrapperRolesManager">
      <TitleHeader id="filterRolesManager">
        {isPartner ? 'Vai trò & Phân quyền đối tác' : 'Vai Trò & Phân Quyền'}
      </TitleHeader>
      <div>
        <RowHeader>
          <div className="flex-1">
            <Form form={form} onFinish={handleSearch}>
              <CFilter
                items={items}
                validQuery={REACT_QUERY_KEYS.GET_ALL_ROLES}
                searchComponent={
                  <Tooltip title="Nhập mã hoặc tên vai trò" placement="right">
                    <Form.Item name="q" className="min-w-72">
                      <CInput
                        maxLength={100}
                        placeholder="Nhập mã hoặc tên vai trò"
                        prefix={<FontAwesomeIcon icon={faSearch} />}
                      />
                    </Form.Item>
                  </Tooltip>
                }
              />
            </Form>
          </div>
          <div>
            {includes(actionByRole, ActionsTypeEnum.CREATE) && (
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={handleAddRole}
              >
                <FormattedMessage id="common.add" />
              </Button>
            )}
          </div>
        </RowHeader>
        <Row>
          <CTable
            loading={loadingTable}
            columns={columns}
            dataSource={listRole?.content ?? []}
            rowKey={'id'}
            pagination={{
              total: listRole?.totalElements,
            }}
          />
        </Row>
      </div>
    </Wrapper>
  );
});
export default ListRole;
