import { PlusOutlined } from '@ant-design/icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@react/commons/Button';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import CTable from '@react/commons/Table';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { ACTION_MODE_ENUM, ModelStatus } from '@react/commons/types';
import { ActionsTypeEnum } from '@react/constants/app';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Form, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import includes from 'lodash/includes';
import { useCallback, useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getColumnUserGroup } from '../constants';
import { useGetGroupUsers, useSupportDeleteGroup } from '../queryHook';
import { IGroupUserParams, IUserGroup } from '../types';
import { Wrapper } from './style';

const ListUserGroup = () => {
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const params = decodeSearchParams(searchParams);
  const navigate = useNavigate();
  const actionByRole = useRolesByRouter();
  const { handleSearch } = useSearchHandler(REACT_QUERY_KEYS.GET_LIST_GROUP);
  const { data, isLoading: loadingTable } = useGetGroupUsers(
    queryParams<IGroupUserParams>(params)
  );
  const { mutate: deleteGroup } = useSupportDeleteGroup();

  const handleAdd = useCallback(() => {
    navigate(pathRoutes.group_user_manager_add);
  }, []);

  const handleDeleteItem = (id: string) => {
    if (id) {
      ModalConfirm({
        title: 'common.confirmDelete',
        message: 'common.relatedDataDeleted',
        handleConfirm: () => {
          deleteGroup(id);
        },
      });
    }
  };

  const columns: ColumnsType<IUserGroup> = useMemo(() => {
    return getColumnUserGroup(params, actionByRole, {
      onAction: (type, record) => {
        openModalEditView(type, record);
      },
      onDelete: (user) => {
        handleDeleteItem(user.id);
      },
    });
  }, []);

  const openModalEditView = (type: ACTION_MODE_ENUM, record: IUserGroup) => {
    switch (type) {
      case ACTION_MODE_ENUM.VIEW:
        navigate(pathRoutes.groupUserManagerView(record.id));
        return;
      case ACTION_MODE_ENUM.CREATE:
        navigate(pathRoutes.userManagerAdd);
        return;
      case ACTION_MODE_ENUM.EDIT:
        navigate(pathRoutes.groupUserManagerEdit(record.id));
        return;
    }
  };

  useEffect(() => {
    form.setFieldsValue(params);
  }, []);

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
                  value: '',
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
  }, []);

  return (
    <Wrapper>
      <div>
        <TitleHeader>Nhóm tài khoản nhân sự</TitleHeader>
        <RowHeader>
          <div className="flex-1">
            <Form onFinish={handleSearch} form={form}>
              <CFilter
                items={items}
                validQuery={REACT_QUERY_KEYS.GET_LIST_GROUP}
                searchComponent={
                  <Tooltip
                    title="Nhập mã hoặc tên nhóm tài khoản"
                    placement="right"
                  >
                    <Form.Item name="q" className="min-w-72">
                      <CInput
                        maxLength={100}
                        placeholder="Nhập mã hoặc tên nhóm tài khoản"
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
                onClick={handleAdd}
              >
                <FormattedMessage id="common.add" />
              </Button>
            )}
          </div>
        </RowHeader>
        <CTable
          loading={loadingTable}
          columns={columns}
          rowKey={'id'}
          dataSource={data?.content || []}
          pagination={{
            total: data?.totalElements,
          }}
        />
      </div>
    </Wrapper>
  );
};
export default ListUserGroup;
