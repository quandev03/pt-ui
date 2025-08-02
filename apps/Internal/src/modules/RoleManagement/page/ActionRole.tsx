// import { Col, Form, Row, Spin, Tree, Typography } from 'antd';
// import { includes } from 'lodash';
// import { FC, useCallback, useEffect, useMemo, useState } from 'react';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import {
//   useGetObjectList,
//   useGetObjectListMobile,
//   useSupportAddRole,
//   useSupportDeleteRole,
//   useSupportGetRoleDetail,
//   useSupportUpdateRole,
// } from '../hooks';
// import { IFullMenu, PropsRole } from '../types';

// const processTreeData = (data: IFullMenu[]): any => {
//   return data.map((item) => ({
//     ...item,
//     children: item.children ? processTreeData(item.children) : [],
//   }));
// };
// const getKey = (data: IFullMenu[]): string[] => {
//   let result: string[] = [];
//   data.forEach((item) => {
//     if (item.children && item.children.length > 0) {
//       result = [...result, ...getKey(item.children)];
//     }
//     if (item.key) {
//       result.push(item.key);
//     }
//   });
//   return result;
// };
// export const ActionRole: FC<PropsRole> = ({ isPartner }) => {
//   const { setBreadcrumbsParams } = useConfigAppNoPersistStore();
//   const [isSubmitBack, setIsSubmitBack] = useState(false);
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [form] = Form.useForm();
//   const pathname = useLocation();
//   const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
//   const [autoExpandParentMobile, setAutoExpandParentMobile] =
//     useState<boolean>(true);
//   const [showValidateTree, setShowValidateTree] = useState<boolean>(false);
//   const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
//   const [selectedKeysMobile, setSelectedKeysMobile] = useState<React.Key[]>([]);
//   const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
//   const [checkedKeysMobile, setCheckedKeysMobile] = useState<string[]>([]);
//   const actionByRole = useRolesByRouter();

//   const actionMode = useActionMode();

//   const { data: listRoleByIsPartner = [] } = useGetObjectList(isPartner);
//   const { data: listRoleByIsPartnerMobile = [] } =
//     useGetObjectListMobile(isPartner);

//   const { data: dataRoleDetail, isLoading: isLoadingGetRole } =
//     useSupportGetRoleDetail(isPartner, id);

//   useEffect(() => {
//     if (dataRoleDetail) {
//       setBreadcrumbsParams({ id: dataRoleDetail?.name as string });
//       form.setFieldsValue(dataRoleDetail);
//       setShowValidateTree(false);
//       const checkedKeys = dataRoleDetail.checkedKeys.filter((item) =>
//         getKey(listRoleByIsPartner).includes(item)
//       );
//       const checkedKeysMobile = dataRoleDetail.checkedKeys.filter((item) =>
//         getKey(listRoleByIsPartnerMobile).includes(item)
//       );
//       setCheckedKeys(checkedKeys);
//       setCheckedKeysMobile(checkedKeysMobile);
//     }
//   }, [dataRoleDetail]);

//   const treeData = useMemo(() => {
//     if (!listRoleByIsPartner) return [];
//     return processTreeData(listRoleByIsPartner);
//   }, [listRoleByIsPartner]);

//   const treeDataMobile = useMemo(() => {
//     if (!listRoleByIsPartnerMobile) return [];
//     return processTreeData(listRoleByIsPartnerMobile);
//   }, [listRoleByIsPartnerMobile]);

//   const handleClose = () => {
//     navigate(-1);
//   };

//   const setFieldError = useCallback(
//     (fieldErrors: IFieldErrorsItem[]) => {
//       form.setFields(
//         fieldErrors.map((item: IFieldErrorsItem) => ({
//           name: item.field,
//           errors: [item.detail],
//         }))
//       );
//     },
//     [form]
//   );

//   const { mutate: createRole, isPending: loadingAdd } = useSupportAddRole(
//     () => {
//       if (isSubmitBack) {
//         handleClose();
//       } else {
//         form.resetFields();
//         setCheckedKeys([]);
//         setCheckedKeysMobile([]);
//       }
//     },
//     setFieldError
//   );
//   const { mutate: deleteRole, isPending: loadingDelete } =
//     useSupportDeleteRole(handleClose);
//   const { mutate: updateRole, isPending: loadingUpdate } = useSupportUpdateRole(
//     handleClose,
//     setFieldError
//   );

//   const Title = useMemo(() => {
//     switch (actionMode) {
//       case ACTION_MODE_ENUM.VIEW:
//         return 'Xem chi tiết vai trò & phân quyền';
//       case ACTION_MODE_ENUM.CREATE:
//         return 'Tạo vai trò & phân quyền';
//       case ACTION_MODE_ENUM.EDIT:
//         return 'Chỉnh sửa vai trò & phân quyền';
//       default:
//         return 'Tạo vai trò & phân quyền';
//     }
//   }, [actionMode]);

//   const handleFinish = useCallback(
//     (values: any) => {
//       const mergeCheckedKeys = [...checkedKeys, ...checkedKeysMobile];
//       if (!mergeCheckedKeys.length) {
//         setShowValidateTree(true);
//         return;
//       }
//       if (actionMode === ACTION_MODE_ENUM.CREATE) {
//         const data = {
//           ...values,
//           status: 1,
//           isPartner,
//           checkedKeys: mergeCheckedKeys,
//         };
//         createRole(data);
//       } else if (actionMode === ACTION_MODE_ENUM.EDIT && id) {
//         const data = {
//           ...values,
//           status: values.status ? 1 : 0,
//           isPartner,
//           checkedKeys: mergeCheckedKeys,
//           id: id,
//         };
//         ModalConfirm({
//           title: 'Xác nhận',
//           message: 'Bạn có chắc chắn muốn cập nhật không?',
//           handleConfirm: () => {
//             updateRole(data);
//           },
//         });
//       }
//     },
//     [checkedKeys, checkedKeysMobile, actionMode, id, isPartner]
//   );

//   const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
//   const [expandedKeysMobile, setExpandedKeysMobile] = useState<React.Key[]>([]);

//   const onExpand = (expandedKeysValue: React.Key[]) => {
//     setExpandedKeys(expandedKeysValue);
//     setAutoExpandParent(false);
//   };

//   const onExpandMobile = (expandedKeysValue: React.Key[]) => {
//     setExpandedKeysMobile(expandedKeysValue);
//     setAutoExpandParentMobile(false);
//   };

//   const onCheck = (checkedKeysValue: any) => {
//     console.log('checkedKeysValue', checkedKeysValue);
//     const mergeCheckedKeys = [...checkedKeysValue, ...checkedKeysMobile];
//     if (mergeCheckedKeys?.length) {
//       setShowValidateTree(false);
//     } else {
//       setShowValidateTree(true);
//     }
//     setCheckedKeys(checkedKeysValue);
//   };
//   console.log('checkedKeys', checkedKeys);

//   const onSelect = (selectedKeysValue: React.Key[]) => {
//     console.log('selectedKeysValue', selectedKeysValue);
//     setSelectedKeys(selectedKeysValue);
//   };

//   const onCheckMobile = (checkedKeysValue: any) => {
//     const mergeCheckedKeys = [...checkedKeysValue, ...checkedKeys];
//     if (mergeCheckedKeys?.length) {
//       setShowValidateTree(false);
//     } else {
//       setShowValidateTree(true);
//     }
//     setCheckedKeysMobile(checkedKeysValue);
//   };
//   const onSelectMobile = (selectedKeysValue: React.Key[]) => {
//     setSelectedKeysMobile(selectedKeysValue);
//   };

//   return (
//     <div className="flex flex-col w-full h-full">
//       {/* <TitleHeader>{Title}</TitleHeader> */}
//       <Spin spinning={isLoadingGetRole}>
//         <Form
//           form={form}
//           onFinish={handleFinish}
//           labelCol={{ span: 6 }}
//           validateTrigger={['onSubmit', 'onBlur']}
//           colon={false}
//           initialValues={{
//             status: 1,
//           }}
//         >
//           <div className="bg-white rounded-[10px] px-6 pt-4 pb-8">
//             <Row gutter={[30, 0]}>
//               <Col span={12}>
//                 <Typography.Title level={5} className="titleTree">
//                   Thông tin vai trò
//                 </Typography.Title>
//                 <Row gutter={[30, 0]}>
//                   <Col span={24}>
//                     <Form.Item
//                       label="Hoạt động"
//                       name="status"
//                       valuePropName="checked"
//                     >
//                       <CSwitch
//                         disabled={ACTION_MODE_ENUM.EDIT !== actionMode}
//                       />
//                     </Form.Item>
//                   </Col>
//                   <Col span={24}>
//                     <Form.Item
//                       label="Mã vai trò"
//                       name="code"
//                       required
//                       rules={[validateForm.required]}
//                     >
//                       <CInput
//                         placeholder="Nhập mã"
//                         maxLength={20}
//                         preventSpecial
//                         uppercase
//                         preventSpace
//                         preventVietnamese
//                         disabled={actionMode === ACTION_MODE_ENUM.VIEW}
//                         onBlur={() => {
//                           const name: string = form.getFieldValue('code') ?? '';
//                           form.setFieldValue('code', name.replace(/\s/g, ''));
//                           form.validateFields(['code']);
//                         }}
//                       />
//                     </Form.Item>
//                   </Col>
//                   <Col span={24}>
//                     <Form.Item
//                       label="Tên vai trò"
//                       name="name"
//                       required
//                       rules={[validateForm.required]}
//                     >
//                       <CInput
//                         placeholder="Nhập tên"
//                         maxLength={100}
//                         disabled={actionMode === ACTION_MODE_ENUM.VIEW}
//                         onBlur={() => {
//                           const name: string = form.getFieldValue('name') ?? '';
//                           form.setFieldValue('name', name.trim());
//                         }}
//                       />
//                     </Form.Item>
//                   </Col>
//                   <Col span={24}>
//                     <Form.Item label="Mô tả" name="description">
//                       <CTextArea
//                         maxLength={200}
//                         disabled={actionMode === ACTION_MODE_ENUM.VIEW}
//                       />
//                     </Form.Item>
//                   </Col>
//                 </Row>
//               </Col>
//               <Col span={12}>
//                 <div>
//                   <div className="mb-4">
//                     <Typography.Title level={5} className="titleTree">
//                       Phân quyền
//                     </Typography.Title>
//                     <div className="h-72 overflow-scroll p-4 border rounded-md">
//                       <Tree
//                         disabled={actionMode === ACTION_MODE_ENUM.VIEW}
//                         checkable
//                         onExpand={onExpand}
//                         expandedKeys={expandedKeys}
//                         autoExpandParent={autoExpandParent}
//                         onCheck={onCheck}
//                         checkedKeys={checkedKeys}
//                         onSelect={onSelect}
//                         selectedKeys={selectedKeys}
//                         treeData={treeData}
//                       />
//                     </div>
//                   </div>
//                   {isPartner && treeDataMobile && treeDataMobile.length > 0 && (
//                     <div>
//                       <Typography.Title level={5} className="titleTree">
//                         Phân quyền SkySale
//                       </Typography.Title>
//                       <div className="h-72 overflow-scroll p-4 border rounded-md">
//                         <Tree
//                           disabled={actionMode === ACTION_MODE_ENUM.VIEW}
//                           checkable
//                           onExpand={onExpandMobile}
//                           expandedKeys={expandedKeysMobile}
//                           autoExpandParent={autoExpandParentMobile}
//                           onCheck={onCheckMobile}
//                           checkedKeys={checkedKeysMobile}
//                           onSelect={onSelectMobile}
//                           selectedKeys={selectedKeysMobile}
//                           treeData={treeDataMobile}
//                         />
//                       </div>
//                     </div>
//                   )}

//                   <Show>
//                     <Show.When isTrue={showValidateTree}>
//                       <Text type="danger" style={{ fontSize: '14px' }}>
//                         Không được để trống trường này
//                       </Text>
//                     </Show.When>
//                   </Show>
//                 </div>
//               </Col>
//             </Row>
//           </div>
//           <div className="flex gap-4 flex-wrap justify-end mt-7">
//             {actionMode === ACTION_MODE_ENUM.CREATE && (
//               <CButtonSaveAndAdd
//                 onClick={() => {
//                   if (!checkedKeys.length) {
//                     setShowValidateTree(true);
//                   }
//                   form.submit();
//                 }}
//                 loading={loadingAdd || loadingUpdate}
//                 disabled={loadingAdd || loadingUpdate}
//               />
//             )}
//             {actionMode !== ACTION_MODE_ENUM.VIEW &&
//               (includes(actionByRole, ActionsTypeEnum.UPDATE) ||
//                 includes(actionByRole, ActionsTypeEnum.CREATE)) && (
//                 <CButtonSave
//                   onClick={() => {
//                     if (!checkedKeys.length) {
//                       setShowValidateTree(true);
//                     }
//                     setIsSubmitBack(true);
//                     form.submit();
//                   }}
//                   loading={loadingAdd || loadingUpdate}
//                   disabled={loadingAdd || loadingUpdate}
//                 />
//               )}
//             {actionMode === ACTION_MODE_ENUM.VIEW && (
//               <>
//                 <Show>
//                   <Show.When
//                     isTrue={includes(actionByRole, ActionsTypeEnum.DELETE)}
//                   >
//                     <CButtonDelete
//                       onClick={() => {
//                         ModalConfirm({
//                           title: 'Bạn có chắc chắn muốn Xoá bản ghi không?',
//                           message: 'Các dữ liệu liên quan cũng sẽ bị xoá',
//                           handleConfirm: () => {
//                             deleteRole({
//                               isPartner,
//                               id: id!,
//                             });
//                           },
//                         });
//                       }}
//                       loading={loadingDelete}
//                       disabled={loadingDelete}
//                     />
//                   </Show.When>
//                 </Show>
//                 <Show>
//                   <Show.When
//                     isTrue={includes(actionByRole, ActionsTypeEnum.UPDATE)}
//                   >
//                     <CButtonEdit
//                       onClick={() => {
//                         if (isPartner) {
//                           navigate(pathRoutes.rolePartnerManagerEdit(id));
//                         } else {
//                           navigate(pathRoutes.roleManagerEdit(id));
//                         }
//                       }}
//                     />
//                   </Show.When>
//                 </Show>
//               </>
//             )}
//             <CButtonClose onClick={handleClose} />
//           </div>
//         </Form>
//       </Spin>
//     </div>
//   );
// };
// export default ActionRole;
