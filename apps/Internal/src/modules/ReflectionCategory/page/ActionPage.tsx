import {
  CButtonClose,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import CInput from '@react/commons/Input';
import { AnyElement } from '@react/commons/types';
import { ActionType } from '@react/constants/app';
import { Card, Col, Form, Row, Space, Tooltip, TreeSelect } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import {
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
} from 'react-router-dom';
import {
  useGetDetailReflectionCategory,
  useAddReflectionCategory,
  useUpdateReflectionCategory,
  useListReflectionCategory,
  useGetPriority,
  REFLECTION_CATEGORY_QUERY_KEY,
} from '../hooks';
import {
  IReflectionCategory,
  PayloadAddReflectionCategory,
  TreeNode,
} from '../types';
import {
  CInputNumber,
  CModalConfirm,
  CSelect,
  CSwitch,
  WrapperPage,
} from '@react/commons/index';
import { MESSAGE } from '@react/utils/message';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import validateForm from '@react/utils/validator';
import { TitleHeader } from '@react/commons/Template/style';
import { RowStyle, StyleTableForm } from '../page/style';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { useQueryClient } from '@tanstack/react-query';

type Props = {
  type: ActionType;
};

const ActionPage = ({ type }: Props) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [form] = Form.useForm();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const params = decodeSearchParams(searchParams);
  const { page, size, ...rest } = params;
  const { data: priorityOptions } = useGetPriority();
  const { data, isFetching: isLoadingList } = useListReflectionCategory(
    queryParams(rest)
  );
  const {
    isFetching: isLoadingDetail,
    data: detailReflectionCategory,
    isSuccess: isGetDetailSuccess,
  } = useGetDetailReflectionCategory(id ?? '');

  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [isStatus, setStatus] = useState<number>();
  const [isChildMin, setChildMin] = useState<boolean>();
  const [isDisableStatus, setDisableStatus] = useState<boolean>(false);
  const [submitType, setSubmitType] = useState<string>('');

  const buildHierarchy = (data: IReflectionCategory[]): any[] => {
    const map = new Map<number, any>();
    const result: any[] = [];

    data
      .filter((item) => item.level !== 4)
      .forEach((item) => {
        map.set(item.id, {
          title: item.typeName,
          value: item.id,
          key: item.id,
          children: [],
          level: item.level,
          parentId: item.parentId,
          status: item.status,
        });
      });

    data.forEach((item) => {
      if (item.parentId !== null) {
        const parent = map.get(item.parentId);
        if (parent) {
          const child = map.get(item.id);
          if (child) {
            parent.children.push(child);
          }
        }
      } else {
        result.push(map.get(item.id));
      }
    });

    const cleanChildren = (items: any[]) => {
      return items.map((item) => {
        if (item.children && item.children.length === 0) {
          delete item.children;
        } else if (item.children) {
          item.children = cleanChildren(item.children);
        }
        return item;
      });
    };

    return cleanChildren(result);
  };

  useEffect(() => {
    return data && setTreeData(buildHierarchy(data));
  }, [data]);

  const handleClose = useCallback(() => {
    form.resetFields();
    navigate(-1);
  }, [form, navigate]);

  const handleCloseAddSave = useCallback(() => {
    form.resetFields();
  }, [form]);

  const handleCloseModal = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const { mutate: onCreate, isPending: loadingAdd } = useAddReflectionCategory(
    () => {
      if (submitType === 'saveAndAdd') {
        handleCloseAddSave();
      } else {
        handleClose();
      }
    },
    form
  );
  const { mutate: onUpdate, isPending: isLoadingUpdate } =
    useUpdateReflectionCategory(() => {
      handleClose();
      queryClient.invalidateQueries({
        queryKey: [REFLECTION_CATEGORY_QUERY_KEY.DETAIL, id],
      });
    });

  const findParentDisable = (
    data: IReflectionCategory[],
    targetId: number | null
  ): boolean => {
    let currentNode: IReflectionCategory | undefined = data.find(
      (node) => node.id === targetId
    );

    while (currentNode) {
      if (currentNode.status === 0) {
        return true;
      }

      currentNode = currentNode.parentId
        ? // eslint-disable-next-line no-loop-func
          data.find(
            // eslint-disable-next-line no-loop-func
            (node) => currentNode && node.id === currentNode.parentId
          ) || undefined
        : undefined;
    }
    return false;
  };

  useEffect(() => {
    if (isGetDetailSuccess && detailReflectionCategory && data && treeData) {
      form.setFieldsValue({
        ...detailReflectionCategory,
        feedbackSlaConfigs: detailReflectionCategory?.feedbackSlaConfigs?.sort(
          (a, b) => b.priorityLevel.localeCompare(a.priorityLevel)
        ),
      });

      const targetId = detailReflectionCategory.parentId;
      const parentDisable = findParentDisable(data, targetId);

      setDisableStatus(parentDisable);
      setStatus(detailReflectionCategory.status);

      if (detailReflectionCategory.feedbackSlaConfigs.length) {
        setChildMin(true);
      }
      if (!detailReflectionCategory.allowChangeStatus) {
        setDisableStatus(true);
      }
    } else {
      setStatus(1);
      if (priorityOptions) {
        const initialConfigs = priorityOptions
          .map((option) => ({
            priorityLevel: option.value,
            approvalDeadline: 0,
            processingDeadline: 0,
            closingDeadline: 0,
            completionDeadline: 0,
          }))
          .sort((a, b) => b.priorityLevel.localeCompare(a.priorityLevel));
        form.setFieldsValue({ feedbackSlaConfigs: initialConfigs });
      }
    }
  }, [
    isGetDetailSuccess,
    detailReflectionCategory,
    data,
    treeData,
    priorityOptions,
    pathname,
  ]);

  const handleFinishForm = (values: PayloadAddReflectionCategory) => {
    const data: PayloadAddReflectionCategory = {
      ...values,
      status: values.status ? 1 : 0,
    };
    if (type === ActionType.ADD) {
      onCreate(data as AnyElement);
    }
    if (type === ActionType.EDIT) {
      CModalConfirm({
        message: MESSAGE.G04,
        onOk: () => {
          onUpdate({
            id: detailReflectionCategory?.id
              ? String(detailReflectionCategory?.id)
              : '',
            data: data,
          });
        },
      });
    }
  };

  const columnsConfig = [
    {
      title: 'Độ ưu tiên',
      dataIndex: 'priorityLevel',
      key: 'priorityLevel',
      width: 200,
      render: (text: any, record: any, index: number) => (
        <Form.Item
          name={[index, 'priorityLevel']}
          rules={[
            { required: true, message: 'Không được để trống trường này' },
          ]}
        >
          <CSelect options={priorityOptions} disabled suffixIcon={null} />
        </Form.Item>
      ),
    },
    {
      title: 'Thời hạn duyệt (giờ)',
      dataIndex: 'approvalDeadline',
      key: 'approvalDeadline',
      width: 200,
      render: (text: any, record: any, index: number) => (
        <Form.Item
          name={[index, 'approvalDeadline']}
          rules={[validateForm.required]}
        >
          <CInput
            onlyNumber
            preventSpecial
            preventSpace
            allowClear={false}
            maxLength={10}
            onBlur={(e) => {
              const value = e.target.value;
              if (value) {
                form.setFieldValue(
                  ['feedbackSlaConfigs', index, 'approvalDeadline'],
                  Number(value)
                );
              }
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Thời hạn xử lý (giờ)',
      dataIndex: 'processingDeadline',
      key: 'processingDeadline',
      width: 200,
      render: (text: any, record: any, index: number) => (
        <Form.Item
          name={[index, 'processingDeadline']}
          rules={[validateForm.required]}
        >
          <CInput
            onlyNumber
            preventSpecial
            preventSpace
            allowClear={false}
            maxLength={10}
            onBlur={(e) => {
              const value = e.target.value;
              if (value) {
                form.setFieldValue(
                  ['feedbackSlaConfigs', index, 'processingDeadline'],
                  Number(value)
                );
              }
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Thời hạn đóng (giờ)',
      dataIndex: 'closingDeadline',
      key: 'closingDeadline',
      width: 200,
      render: (text: any, record: any, index: number) => (
        <Form.Item
          name={[index, 'closingDeadline']}
          rules={[validateForm.required]}
        >
          <CInput
            onlyNumber
            preventSpecial
            preventSpace
            allowClear={false}
            maxLength={10}
            onBlur={(e) => {
              const value = e.target.value;
              if (value) {
                form.setFieldValue(
                  ['feedbackSlaConfigs', index, 'closingDeadline'],
                  Number(value)
                );
              }
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Thời hạn phản ánh (giờ)',
      dataIndex: 'completionDeadline',
      key: 'completionDeadline',
      width: 200,
      render: (text: any, record: any, index: number) => (
        <Form.Item
          name={[index, 'completionDeadline']}
          rules={[
            { required: true, message: 'Không được để trống trường này' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value) {
                  return Promise.resolve();
                }
                const approvalDeadline =
                  getFieldValue([
                    'feedbackSlaConfigs',
                    index,
                    'approvalDeadline',
                  ]) || 0;
                const processingDeadline =
                  getFieldValue([
                    'feedbackSlaConfigs',
                    index,
                    'processingDeadline',
                  ]) || 0;
                const closingDeadline =
                  getFieldValue([
                    'feedbackSlaConfigs',
                    index,
                    'closingDeadline',
                  ]) || 0;

                const totalDeadline =
                  approvalDeadline + processingDeadline + closingDeadline;

                if (value >= totalDeadline) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  new Error(
                    'Thời hạn phản ánh không được nhỏ hơn tổng thời hạn duyệt + thời hạn xử lý + thời hạn đóng'
                  )
                );
              },
            }),
          ]}
        >
          <CInput
            onlyNumber
            preventSpecial
            preventSpace
            allowClear={false}
            maxLength={10}
            onBlur={(e) => {
              const value = e.target.value;
              if (value) {
                form.setFieldValue(
                  ['feedbackSlaConfigs', index, 'completionDeadline'],
                  Number(value)
                );
              }
            }}
          />
        </Form.Item>
      ),
    },
  ];

  const renderTitle = () => {
    switch (type) {
      case ActionType.ADD:
        return 'Tạo loại phản ánh';
      case ActionType.EDIT:
        return 'Chỉnh sửa loại phản ánh';
      case ActionType.VIEW:
        return 'Chi tiết loại phản ánh';
      default:
        return '';
    }
  };

  return (
    <WrapperPage>
      <TitleHeader>{renderTitle()}</TitleHeader>
      <Form
        form={form}
        labelCol={{ style: { width: '160px' } }}
        onFinish={handleFinishForm}
        disabled={type === ActionType.VIEW}
        initialValues={{
          feedbackSlaConfigs: [{}],
          status: 1,
        }}
      >
        <Card className="mb-5" loading={isLoadingDetail}>
          <RowStyle gutter={[24, 0]}>
            <Col span={12}>
              <Form.Item label="Loại phản ánh cha" name="parentId">
                <TreeSelect
                  loading={isLoadingList}
                  treeData={treeData}
                  placeholder="Chọn loại phản ánh cha"
                  treeDefaultExpandAll
                  allowClear
                  onChange={(value) => {
                    const findNode = (
                      nodes: any[],
                      key: string
                    ): any | null => {
                      for (const node of nodes) {
                        if (node.key === key) {
                          return node;
                        }
                        if (node.children) {
                          const found = findNode(node.children, key);
                          if (found) return found;
                        }
                      }
                      return null;
                    };

                    const selectedNode = findNode(treeData, value);

                    if (selectedNode) {
                      selectedNode.level === 3
                        ? setChildMin(true)
                        : setChildMin(false);

                      if (selectedNode.status) {
                        setDisableStatus(false);
                      } else {
                        setDisableStatus(true);
                        form.setFieldsValue({ status: 0 });
                        setStatus(0);
                      }
                    } else {
                      setChildMin(false);
                      setDisableStatus(false);
                    }
                  }}
                  disabled={
                    type === ActionType.VIEW || type === ActionType.EDIT
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tên loại phản ánh"
                name="typeName"
                rules={[validateForm.required]}
              >
                <CInput placeholder="Nhập tên loại phản ánh" maxLength={100} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Trạng thái" name="status">
                <Tooltip
                  title={isStatus === 1 ? 'Hoạt động' : 'Không hoạt động'}
                  placement="right"
                >
                  <CSwitch
                    checked={isStatus === 1}
                    defaultValue={isStatus === 1 ? true : false}
                    onChange={(checked) => {
                      form.setFieldsValue({ status: checked ? 1 : 0 });
                      setStatus(checked ? 1 : 0);
                    }}
                    disabled={type === ActionType.VIEW || isDisableStatus}
                  />
                </Tooltip>
              </Form.Item>
            </Col>
            <Col span={12}></Col>
          </RowStyle>
          {isChildMin && (
            <RowStyle gutter={[24, 0]}>
              <Col span={24}>
                <h3 className="title-blue">Cấu hình thời hạn</h3>
              </Col>
              <Col span={24}>
                <Form.List name="feedbackSlaConfigs">
                  {(fields, { add, remove }) => (
                    <StyleTableForm
                      dataSource={fields}
                      rowClassName="align-top"
                      columns={columnsConfig.map((col) => ({
                        ...col,
                        render:
                          col.render &&
                          ((text: any, record: any, index: number) =>
                            col.render(text, record, fields[index]?.name)),
                      }))}
                      pagination={false}
                      rowKey="key"
                    />
                  )}
                </Form.List>
              </Col>
            </RowStyle>
          )}
        </Card>
        <Row justify="end">
          <Space size="middle">
            {type === ActionType.VIEW && (
              <>
                <CButtonEdit
                  onClick={() => {
                    detailReflectionCategory?.id &&
                      navigate(
                        pathRoutes.reflectionCategoryEdit(
                          detailReflectionCategory?.id
                        )
                      );
                  }}
                  disabled={false}
                  htmlType="button"
                />
                <CButtonClose
                  onClick={handleCloseModal}
                  disabled={false}
                  type="default"
                  htmlType="button"
                />
              </>
            )}
            {type === ActionType.ADD && (
              <CButtonSaveAndAdd
                htmlType="submit"
                loading={loadingAdd || isLoadingUpdate}
                onClick={() => setSubmitType('saveAndAdd')}
              />
            )}
            {type !== ActionType.VIEW && (
              <CButtonSave
                htmlType="submit"
                loading={loadingAdd || isLoadingUpdate}
                onClick={() => setSubmitType('save')}
              />
            )}
            {type !== ActionType.VIEW && (
              <CButtonClose
                onClick={handleCloseModal}
                disabled={false}
                type="default"
                htmlType="button"
              />
            )}
          </Space>
        </Row>
      </Form>
    </WrapperPage>
  );
};

export default ActionPage;
