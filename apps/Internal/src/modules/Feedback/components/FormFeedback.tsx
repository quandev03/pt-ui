import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonClose } from '@react/commons/Button';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { Text, TextLink } from '@react/commons/Template/style';
import CTextArea from '@react/commons/TextArea';
import {
  CInputNumber,
  CTable,
  NotificationError,
  NotificationSuccess,
} from '@react/commons/index';
import { AnyElement } from '@react/commons/types';
import { prefixCustomerService } from '@react/url/app';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import {
  Button,
  Checkbox,
  Col,
  Flex,
  Form,
  FormInstance,
  Modal,
  Row,
  Spin,
  TableProps,
  Tabs,
  TabsProps,
  Tooltip,
  TreeSelect,
  Upload,
} from 'antd';
import { UploadFile } from 'antd/lib';
import { useGetImage } from 'apps/Internal/src/components/layouts/queryHooks';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useExportMutation } from 'apps/Internal/src/hooks/useExportMutation';
import { usePrefixIsdnRegex } from 'apps/Internal/src/hooks/usePrefixIsdnQuery';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { v4 } from 'uuid';
import { useGetDepartments } from '../../UserManagement/queryHooks';
import {
  feedbackTypeToTreeData,
  isAdd,
  isCSKH,
  isEdit,
  isView,
  LIST_PRIORITY_STATUS,
  LIST_STATUS,
  mapChildren,
} from '../constants';
import { ButtonWrapper, FormFeedbackWrapper } from '../page/styles';
import {
  useActiveUserByDepartment,
  useActiveUsers,
  useCheckCountFeedback,
  useDetailFeedback,
  useDetailFeedbackType,
  useEditFeedback,
  useEmail,
  useFetchFeedbackTypes,
  useFullname,
  useListChannelFeedback,
  useUserName,
} from '../queryHooks';
import useFeedbackStore from '../store';
import { PageFilterEnum, StatusEnum } from '../types';
import { Comment } from './Comment';
import { FeedbackStatusHistory } from './FeedbackStatusHistory';
import { ImpactAction } from './ImpactAction';
import ModalImage from './ModalImage';
import ModalPdf from './ModalPdf';

interface IProps {
  footer: (
    feedbackRequestResponseDTO: any,
    form: FormInstance
  ) => React.ReactNode;
  type: PageFilterEnum;
  createFeedback?: AnyElement;
  isLoadingCreate?: boolean;
}

/**
 * @author
 * @function @FormFeedback
 **/

export const FormFeedback: FC<IProps> = ({
  footer,
  type,
  createFeedback,
  isLoadingCreate,
}) => {
  const [form] = Form.useForm();
  const { data: feedbackTypes } = useFetchFeedbackTypes();
  const [fileList, setFileList] = useState<any[]>([{}]);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: INTERNAL_DEPARTMENT = [] } = useGetDepartments();
  const { data: USERS = [] } = useActiveUsers({ status: 1 });
  const [userByDepartment, setUserByDepartment] = useState<any[]>([]);
  const [isOpenTreeSelect, setIsOpenTreeSelect] = useState<boolean>(false);
  const isViewType = isView(pathname);
  const { priorityLevel, feedbackTypeId, feedbackHours } =
    Form.useWatch((e) => e, form) ?? {};
  const { mutate: getUserByDepartment } = useActiveUserByDepartment(
    (data: any) => {
      setUserByDepartment(data);
    }
  );

  const [disabledForm, setDisabledForm] = useState(false);
  const [listComment, setListComment] = useState<any[]>([]);
  const [listActionImpact, setListActionImpact] = useState<any[]>([]);
  const [feedbackHistory, setFeedbackHistory] = useState<any[]>([]);
  const [isOpenImage, setIsOpenImage] = useState<boolean>(false);
  const [isOpenPdf, setIsOpenPdf] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [attachFileUrl, setAttachFileUrl] = useState<string | undefined>();
  const prefixIsdn = usePrefixIsdnRegex();
  const [feedbackSlaConfigs, setFeedbackSlaConfigs] = useState<any>([]);
  const [isDisableFeedbackCount, setIsDisableFeedbackCount] = useState(true);
  const { state: autoFillState } = useLocation();
  const [feedbackRequestResponseDTO, setFeedbackRequestResponseDTO] =
    useState<any>({});
  const { reloadToggle } = useFeedbackStore();
  const username = useUserName();
  const fullname = useFullname();
  const email = useEmail();
  // const { mutate: getPriorityById } = useListPriorityById((data: any[]) => {
  //   setListPriority(data);
  // });
  const { mutate: getFeedBackTypeDetail } = useDetailFeedbackType(
    (data: any) => {
      setFeedbackSlaConfigs(data?.feedbackSlaConfigs);
    }
  );

  const { isPending: isPendingExport, mutate: exportMutate } =
    useExportMutation();
  const { data: attachFileSrc } = useGetImage(attachFileUrl || '');
  const isEnableWithApproveingAndNotApproved = () => {
    return (
      feedbackRequestResponseDTO?.status === undefined ||
      [StatusEnum.APPROVING, StatusEnum.NOT_APPROVED].includes(
        feedbackRequestResponseDTO?.status
      )
    );
  };
  const isDisableFeedbackChannel = () => {
    if (isViewType) return true;
    return [StatusEnum.CLOSED, StatusEnum.CANCELED].includes(
      feedbackRequestResponseDTO?.status
    );
  };

  const isDisableFeedbackType = (field?: string) => {
    if (isViewType) return true;
    if (type === PageFilterEnum.BO) {
      if (field === 'approvalDepartment')
        return isAdd(pathname) || !isEnableWithApproveingAndRejected;
      return !isEnableWithApproveingAndRejected;
    }
    return !isEnableWithApproveingAndNotApproved();
  };
  const isEnableWithApproveingAndRejected = useMemo(() => {
    return (
      feedbackRequestResponseDTO?.status === undefined ||
      [StatusEnum.APPROVING, StatusEnum.REJECTED].includes(
        feedbackRequestResponseDTO?.status
      )
    );
  }, [feedbackRequestResponseDTO]);

  const isEnablPriority = () => {
    return (
      feedbackRequestResponseDTO?.status === undefined ||
      [
        StatusEnum.PROCESSING,
        StatusEnum.PENDING,
        StatusEnum.PROCESSED,
        StatusEnum.REPROCESS,
        StatusEnum.REJECTED,
        StatusEnum.NOT_APPROVED,
        StatusEnum.APPROVING,
      ].includes(feedbackRequestResponseDTO?.status as any)
    );
  };

  const handleGetUserByDepartment = (value: string) => {
    getUserByDepartment({ departmentCode: value });
    form.setFieldValue('processor', undefined);
  };

  const { id } = useParams();

  const { mutate: handleGetFeedbackDetail, isPending: isLoadingDetail } =
    useDetailFeedback((data) => {
      const { status, processor, processorDepartment } =
        data?.feedbackRequestResponseDTO ?? {};
      form.setFieldsValue({
        ...data?.feedbackRequestResponseDTO,
        processor: processor ?? processorDepartment,
        feedbackHours: 999,
        feedbackChannel:
          data?.feedbackRequestResponseDTO?.feedbackChannel?.split(','),
      });
      setFeedbackRequestResponseDTO(data?.feedbackRequestResponseDTO);
      setFeedbackHistory(data?.feedbackHistoriesHandleResponseDTOs);
      isView(pathname)
        ? setFileList(data?.fileFeedbackRequestResponseDTO)
        : setFileList(
            data?.fileFeedbackRequestResponseDTO?.length
              ? data?.fileFeedbackRequestResponseDTO
              : isAdd(pathname)
              ? [{}]
              : []
          );
      setListComment(data?.feedbackNoteResponseDTOs);
      setListActionImpact(data?.feedbackHistoriesActionResponseDTOs);
      if (isView(pathname)) {
        setDisabledForm(true);
      }
      setIsDisableFeedbackCount(
        ![
          StatusEnum.APPROVING,
          StatusEnum.PENDING,
          StatusEnum.PROCESSING,
          StatusEnum.PROCESSED,
          StatusEnum.REPROCESS,
          StatusEnum.REJECTED,
          StatusEnum.NOT_APPROVED,
        ].includes(status)
      );
    });

  const { mutate: checkFeedbackCount } = useCheckCountFeedback((data: any) => {
    if (data?.message === 'TRUE' && isDisableFeedbackCount) {
      Modal.confirm({
        title: 'Xác nhận',
        content:
          'Đã có phản ánh này cho số thuê bao, bạn có muốn cập nhật để tăng số lần phản ánh lên không',
        footer: (_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        ),
        onOk: () => {
          setIsDisableFeedbackCount(false);

          const feedbackType = pathname.includes(pathRoutes.feedbackCSKH)
            ? pathRoutes.feedbackCSKH
            : pathRoutes.feedbackBO;

          navigate(pathRoutes.feedbackRouteEdit(feedbackType, data?.data.id));
        },
        onCancel: () => {
          const feedbackType = pathname.includes(pathRoutes.feedbackCSKH)
            ? pathRoutes.feedbackCSKH
            : pathRoutes.feedbackBO;
          navigate(feedbackType);
        },
      });
    }
  });

  const items: TabsProps['items'] =
    pathname === pathRoutes.feedbackRouteEdit(pathRoutes.feedbackCSKH, id)
      ? [
          {
            key: '1',
            label: 'Ghi chú',
            children: (
              <Comment
                listComment={listComment}
                afterComment={() => {
                  handleGetFeedbackDetail(id as string);
                }}
                isDisable={
                  ![StatusEnum.APPROVING, StatusEnum.NOT_APPROVED].includes(
                    feedbackRequestResponseDTO?.status
                  ) || isViewType
                }
              ></Comment>
            ),
          },
        ]
      : [
          {
            key: '1',
            label: 'Ghi chú',
            children: (
              <Comment
                listComment={listComment}
                afterComment={() => {
                  handleGetFeedbackDetail(id as string);
                }}
                isDisable={
                  ![StatusEnum.APPROVING, StatusEnum.REJECTED].includes(
                    feedbackRequestResponseDTO?.status
                  ) && !isViewType
                }
              ></Comment>
            ),
          },
          {
            key: '2',
            label: 'Lịch sử tác động',
            children: <ImpactAction listAction={listActionImpact} />,
          },
        ];

  const onBack = () => {
    navigate(-1);
    if (attachFileSrc) URL.revokeObjectURL(attachFileSrc as string);
  };

  const onChangeDesc = (value: string, index: number) => {
    setFileList((prev) => {
      const newPrev = [...prev];
      newPrev[index].description = value;
      return newPrev;
    });
  };

  const handleAddRow = () => {
    return setFileList((prev) => [...prev, { uid: v4() }]);
  };

  const handleRemoveRow = (index: number) => {
    setFileList((prev) => {
      const newFiles = structuredClone(prev);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const collumnFile: (isView: boolean) => TableProps['columns'] = (
    isView: boolean
  ) => {
    const isShowMinusIcon =
      type === PageFilterEnum.BO
        ? isEnableWithApproveingAndRejected
        : isEnableWithApproveingAndNotApproved();
    return [
      {
        title: 'STT',
        align: 'left',
        width: 50,
        fixed: 'left',
        render(_, record, index) {
          return <Text>{index + 1}</Text>;
        },
      },
      {
        title: 'File đính kèm',
        dataIndex: 'file',
        width: 200,
        render(value, record, index) {
          const fileTypes = [
            '.doc',
            '.docx',
            '.pdf',
            '.xls',
            '.xlsx',
            '.jpg',
            '.jpeg',
            '.png',
          ];
          const acceptFileType = [
            'image/png',
            'image/jpeg',
            'image/jpg',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          ];
          return record?.fileName || record?.name ? (
            <Tooltip
              title={record?.fileName || record?.name}
              placement="topLeft"
            >
              {record.fileName ? (
                <TextLink onClick={() => handleDownloadTemplate(record)}>
                  {record.fileName}
                </TextLink>
              ) : (
                <TextLink onClick={() => handleViewFileUpload(record)}>
                  {record.name}
                </TextLink>
              )}
            </Tooltip>
          ) : (
            <Upload
              multiple={false}
              maxCount={1}
              customRequest={() => {
                return;
              }}
              accept={fileTypes.join(',')}
              itemRender={(_, file: UploadFile) => {
                return <TextLink>{file.name}</TextLink>;
              }}
              fileList={[]}
              onChange={(info) => {
                if (
                  info &&
                  !acceptFileType.includes(info.file?.type as string)
                ) {
                  NotificationError('File tải lên không đúng định dạng');
                  return false;
                }
                const maxSize = 30 * 1024 * 1024;
                if (info.file.size && info.file.size > maxSize) {
                  NotificationError('File tải lên vượt quá 30MB');
                  return false;
                }
                setFileList((prev) => {
                  prev[index] = { ...prev[index], ...info?.fileList?.[0] };
                  return [...prev];
                });
              }}
            >
              <Button disabled={!isShowMinusIcon} type="primary">
                Chọn File
              </Button>
            </Upload>
          );
        },
      },
      {
        title: 'Mô tả',
        dataIndex: 'description',
        width: 200,
        render(value, record, index) {
          return isView ? (
            <Tooltip title={record?.description} placement="topLeft">
              <Text>{record?.description}</Text>
            </Tooltip>
          ) : (
            <CTextArea
              placeholder="Nhập mô tả"
              maxLength={200}
              autoSize={{ minRows: 1, maxRows: 5 }}
              defaultValue={value}
              disabled={!isShowMinusIcon}
              onBlur={(e) => onChangeDesc(e.target.value, index)}
            ></CTextArea>
          );
        },
      },
      {
        width: 50,
        align: 'center',
        render(value, record, index) {
          return (
            !isView && (
              <ButtonWrapper
                style={{ alignItems: 'center', justifyContent: 'center' }}
              >
                {isShowMinusIcon && fileList.length !== 1 && (
                  <FontAwesomeIcon
                    icon={faMinus}
                    onClick={() => handleRemoveRow(index)}
                    className="mr-2 cursor-pointer"
                    size="lg"
                    title="Xóa"
                  />
                )}
              </ButtonWrapper>
            )
          );
        },
      },
    ];
  };
  const onFinishForm = (values: any) => {
    try {
      const createPayload = () => {
        const formData = new FormData();
        const departmentCode = values?.departmentCode;
        const departmentName =
          INTERNAL_DEPARTMENT?.find((e) => e.code === departmentCode)?.label ||
          departmentCode;
        formData.append(
          'dto',
          new Blob(
            [
              JSON.stringify({
                ...values,
                departmentCode: departmentCode ? [departmentCode] : [],
                departmentName: departmentCode ? [departmentName] : [],
                feedbackHours: 999,
              }),
            ],
            { type: 'application/json' }
          )
        );
        const attachmentDescriptions = fileList
          ?.map((file: any) => {
            if (file?.originFileObj) {
              formData.append('files', file.originFileObj);
              return file?.description;
            }
            return undefined;
          })
          .filter((e) => e !== undefined);
        if (attachmentDescriptions.length) {
          formData.append(
            'attachmentDescriptions',
            new Blob([JSON.stringify(attachmentDescriptions)], {
              type: 'application/json',
            })
          );
        }
        return formData;
      };
      if (isAdd(pathname)) {
        const formData = createPayload();
        createFeedback(formData);
      }
      if (isEdit(pathname)) {
        const formData = createPayload();
        const fileIds = fileList
          .filter((e) => !!e.id)
          ?.map((e) => {
            return {
              id: e.id,
              description: e.description,
            };
          });
        console.log('fileIds :', fileIds);
        formData.append(
          'oldFiles',
          new Blob([JSON.stringify(fileIds)], { type: 'application/json' })
        );
        editFeedback({ data: formData, id: id as string });
      }
    } catch (error) {
      console.log('onFinishForm', error);
    }
  };

  useEffect(() => {
    if (isView(pathname) || isEdit(pathname)) {
      handleGetFeedbackDetail(id as string);
    }
  }, [reloadToggle, id]);

  useEffect(() => {
    if (isAdd(pathname)) {
      form.setFieldsValue(autoFillState);
    }
  }, []);

  const { mutate: editFeedback, isPending: isLoadingEdit } = useEditFeedback(
    () => {
      NotificationSuccess('Sửa yêu cầu phản ánh thành công');
      navigate(-1);
    }
  );
  useEffect(() => {
    if (feedbackTypeId) {
      getFeedBackTypeDetail({ id: feedbackTypeId });
    }
  }, [feedbackTypeId]);
  const handleCheckFeedbackCount = () => {
    setIsDisableFeedbackCount(true);
    const isdnValue = form.getFieldValue('isdn');
    const feedbackTypeValue: number = form.getFieldValue('feedbackTypeId');
    if (isdnValue?.length < 9 || !feedbackTypeValue || !isdnValue) return;
    if (
      isAdd(pathname) ||
      (isEdit(pathname) &&
        [StatusEnum.APPROVING, StatusEnum.REJECTED].includes(
          feedbackRequestResponseDTO?.status
        ))
    ) {
      checkFeedbackCount({
        feedbackTypeId: feedbackTypeValue as number,
        isdn: isdnValue,
      });
    }
  };

  const handleChangeFeedbackType = (
    value: number,
    curPriorityLevel: string
  ) => {
    if (!value) {
      NotificationError('Vui lòng chọn loại phản ánh');
      form.setFieldValue('priorityLevel', null);
      return;
    }
    form.setFieldValue('feedbackHours', 999);
  };

  const getBaseFeedbackType = useMemo(() => {
    return mapChildren(
      feedbackTypeToTreeData(feedbackTypes || [], true, false),
      null
    );
  }, [feedbackTypes]);

  const getShowHierarchyFeedbackType = useMemo(() => {
    return mapChildren(
      feedbackTypeToTreeData(feedbackTypes || [], true, true),
      null
    );
  }, [feedbackTypes]);

  const handleDownloadTemplate = (record: any) => {
    if (!record.fileUrl || !record.fileName) return;
    if (
      record.fileName.endsWith('.doc') ||
      record.fileName.endsWith('.docx') ||
      record.fileName.endsWith('.xlsx') ||
      record.fileName.endsWith('.xls')
    ) {
      exportMutate({
        uri: `${prefixCustomerService}/file/${record.fileUrl}`,
        filename: record.fileName,
      });
    } else {
      setAttachFileUrl(record.fileUrl);
      if (record.fileName.endsWith('.pdf')) {
        setIsOpenPdf(true);
      } else {
        setIsOpenImage(true);
      }
    }
  };

  const { data: listChannelFeedback } = useListChannelFeedback();
  const handleViewFileUpload = (record: any) => {
    const url = URL.createObjectURL(record.originFileObj);
    if (
      record.name.endsWith('.doc') ||
      record.name.endsWith('.docx') ||
      record.name.endsWith('.xlsx') ||
      record.name.endsWith('.xls')
    ) {
      const a = document.createElement('a');
      a.href = url;
      a.download = record.name || 'download.xlsx';
      a.click();
      URL.revokeObjectURL(url);
    } else if (record.name.endsWith('.pdf')) {
      setImageUrl(url);
      setIsOpenPdf(true);
    } else {
      setImageUrl(url);
      setIsOpenImage(true);
    }
  };

  // Use useImperativeHandle to expose isLoadingCreate
  return (
    <Spin
      spinning={
        isLoadingDetail || isLoadingCreate || isLoadingEdit || isPendingExport
      }
    >
      <FormFeedbackWrapper>
        <Form
          form={form}
          labelCol={{ prefixCls: 'w-[164px]' }}
          onFinish={onFinishForm}
          disabled={disabledForm}
          colon={false}
          onFinishFailed={(e) => {
            console.log('onFinishFailed', e);
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên phản ánh"
                rules={[validateForm.required]}
              >
                <CInput
                  maxLength={1000}
                  disabled={isDisableFeedbackType()}
                  placeholder="Nhập tên phản ánh"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              {isViewType ? (
                <Form.Item
                  name="feedbackTypeName"
                  valuePropName="value"
                  label={'Loại phản ánh'}
                  rules={[validateForm.required]}
                >
                  <CInput
                    disabled={isDisableFeedbackType()}
                    placeholder="Loại phản ánh"
                  />
                </Form.Item>
              ) : (
                <Form.Item
                  name="feedbackTypeId"
                  valuePropName="value"
                  label={'Loại phản ánh'}
                  rules={[validateForm.required]}
                  validateTrigger={['onBlur']}
                >
                  <TreeSelect
                    showSearch
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="Loại phản ánh"
                    disabled={isDisableFeedbackType()}
                    treeData={
                      isOpenTreeSelect
                        ? getBaseFeedbackType
                        : getShowHierarchyFeedbackType
                    }
                    onDropdownVisibleChange={setIsOpenTreeSelect}
                    filterTreeNode={(inputValue, treeNode) =>
                      (treeNode.title as string)
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    }
                    onChange={handleCheckFeedbackCount}
                  />
                </Form.Item>
              )}
            </Col>
            <Col span={12}>
              <Form.Item
                name="isdn"
                label={'Số thuê bao phản ánh'}
                rules={[validateForm.required, prefixIsdn]}
                required={true}
              >
                <CInput
                  onlyNumber
                  disabled={isDisableFeedbackType()}
                  style={{ width: '100%' }}
                  placeholder="Số thuê bao phản ánh"
                  onBlur={handleCheckFeedbackCount}
                  maxLength={11}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="feedbackChannel"
                label={'Kênh phản ánh'}
                rules={[validateForm.required]}
              >
                <CSelect
                  options={listChannelFeedback}
                  disabled={isDisableFeedbackChannel()}
                  showSearch={true}
                  placeholder="Kênh phản ánh"
                  mode="multiple"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="feedbackCount"
                label={'Số lần phản ánh'}
                rules={[validateForm.required]}
                initialValue={1}
              >
                <CInputNumber
                  disabled={isDisableFeedbackCount || isViewType}
                  placeholder="Số lần phản ánh"
                  style={{ width: '100%' }}
                  min={1}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="requester" label={'Người phản ánh'}>
                <CInput
                  disabled={isDisableFeedbackType()}
                  maxLength={50}
                  placeholder="Người phản ánh"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactNumber"
                label={'Số thuê bao liên hệ'}
                rules={[
                  {
                    validator(_, value) {
                      if ((value && value?.length < 10) || value?.length > 11) {
                        return Promise.reject(
                          'Số thuê bao không đúng định dạng'
                        );
                      }
                      return Promise.resolve('');
                    },
                  },
                ]}
              >
                <CInput
                  maxLength={11}
                  disabled={isDisableFeedbackType()}
                  onlyNumber
                  placeholder="Số thuê bao liên hệ"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="approvalDepartment"
                label={'BO duyệt'}
                rules={[validateForm.required]}
                initialValue={
                  isAdd(pathname) && type === PageFilterEnum.BO
                    ? email ?? username
                    : null
                }
              >
                <CSelect
                  options={USERS?.map((e) => ({
                    label: e?.username,
                    value: e?.email || e?.username,
                    label2: e?.fullname,
                  }))}
                  disabled={isDisableFeedbackType('approvalDepartment')}
                  placeholder="BO duyệt"
                  onChange={(value, option: any) => {
                    form.setFieldsValue({
                      approvalDepartmentName: option.label2,
                    });
                  }}
                />
              </Form.Item>
            </Col>
            <Form.Item
              initialValue={
                isAdd(pathname) && type === PageFilterEnum.BO ? fullname : null
              }
              name="approvalDepartmentName"
              hidden
            ></Form.Item>
            <Col span={12}>
              <Form.Item
                name="priorityLevel"
                label={'Độ ưu tiên'}
                rules={[validateForm.required]}
              >
                <CSelect
                  options={LIST_PRIORITY_STATUS}
                  disabled={!isEnablPriority() || isViewType}
                  showSearch={false}
                  onChange={(value) => {
                    if (feedbackHours && feedbackTypeId) {
                      form.validateFields(['feedbackHours']);
                    }
                    handleChangeFeedbackType(feedbackTypeId, value);
                  }}
                  placeholder="Độ ưu tiên"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label={'Trạng thái'}
                initialValue={
                  type === PageFilterEnum.CSKH
                    ? StatusEnum.APPROVING
                    : StatusEnum.PENDING
                }
              >
                <CSelect
                  disabled
                  options={LIST_STATUS}
                  showSearch={false}
                  placeholder="Trạng thái"
                />
              </Form.Item>
            </Col>
            <Col span={0}>
              <Form.Item
                hidden
                name="feedbackHours"
                label={'Thời hạn phản ánh'}
                // rules={[
                //   {
                //     validator(_, value) {
                //       if (
                //         (value === undefined || value === null) &&
                //         !isCSKH(pathname)
                //       ) {
                //         return Promise.reject(`${MESSAGE.G06}`);
                //       } else {
                //         const deadlineByPriority = feedbackSlaConfigs?.find(
                //           (e: any) => e.priorityLevel === priorityLevel
                //         );
                //         const isInvalid =
                //           feedbackHours <
                //           (deadlineByPriority?.approvalDeadline ?? 0) +
                //             (deadlineByPriority?.processingDeadline ?? 0) +
                //             (deadlineByPriority?.closingDeadline ?? 0);
                //         if (isInvalid && deadlineByPriority) {
                //           return Promise.reject(
                //             `Thời hạn phản ánh không được bé hơn tổng thời hạn thời hạn duyệt (${deadlineByPriority?.approvalDeadline}h) + thời hạn xử lý (${deadlineByPriority?.processingDeadline}h) + thời hạn đóng (${deadlineByPriority?.closingDeadline}h)`
                //           );
                //         }
                //       }
                //       return Promise.resolve('');
                //     },
                //   },
                // ]}
              >
                <CInput
                  placeholder="Thời hạn phản ánh"
                  addonAfter="giờ"
                  onlyNumber
                  style={{ width: '100%' }}
                  disabled={isDisableFeedbackType()}
                  maxLength={10}
                />
              </Form.Item>
            </Col>
            {!isCSKH(pathname) && (
              <Col span={12}>
                <Form.Item
                  name="departmentCode"
                  label={'Phòng ban'}
                  rules={[validateForm.required]}
                >
                  <CSelect
                    options={INTERNAL_DEPARTMENT.map((e) => ({
                      ...e,
                      value: e?.code,
                    }))}
                    disabled={isDisableFeedbackType()}
                    placeholder="Phòng ban"
                    onChange={handleGetUserByDepartment}
                    allowClear={false}
                  />
                </Form.Item>
              </Col>
            )}
            {!isCSKH(pathname) && form.getFieldValue('departmentCode') && (
              <Col span={12}>
                <Form.Item name="processor" label={'Người xử lý'}>
                  <CSelect
                    options={userByDepartment?.map((e) => ({
                      label: e?.username,
                      value: e?.email || e?.username,
                    }))}
                    disabled={!isEnableWithApproveingAndRejected || isViewType}
                    placeholder="Người xử lý"
                  />
                </Form.Item>
              </Col>
            )}
            <Col span={12}>
              <Form.Item
                name="hasIssue"
                label={'Lỗi phát sinh'}
                valuePropName="checked"
              >
                <Checkbox disabled={isDisableFeedbackType()}></Checkbox>
              </Form.Item>
            </Col>
            <Col span={24} style={{ width: '100%' }}>
              <Form.Item
                name="content"
                label={'Nội dung phản ánh'}
                rules={[validateForm.required]}
              >
                <CTextArea
                  rows={4}
                  disabled={isDisableFeedbackType()}
                  maxLength={5000}
                  placeholder="Nhập nội dung"
                ></CTextArea>
              </Form.Item>
            </Col>
            <Col span={24}>
              <div className="bold">Đính kèm</div>
              <Flex justify="end" align="end" gap={12} className="mb-4">
                {!isLoadingDetail && (
                  <CTable
                    rowKey={'uid'}
                    columns={collumnFile(isDisableFeedbackType())}
                    dataSource={fileList}
                    scroll={{ y: 325 }}
                    className="dynamic-table"
                  ></CTable>
                )}

                {!isViewType &&
                  (type === PageFilterEnum.BO
                    ? isEnableWithApproveingAndRejected
                    : isEnableWithApproveingAndNotApproved()) && (
                    <FontAwesomeIcon
                      icon={faPlus}
                      size="lg"
                      onClick={handleAddRow}
                      className="cursor-pointer mb-[27px]"
                      title="Thêm"
                    />
                  )}
              </Flex>
            </Col>
            {isAdd(pathname) && (
              <Col span={24} style={{ width: '100%' }}>
                <Form.Item name="feedbackNote" label={'Ghi chú'}>
                  <CTextArea
                    rows={4}
                    disabled={isDisableFeedbackType()}
                    maxLength={200}
                    placeholder="Nhập ghi chú"
                  ></CTextArea>
                </Form.Item>
              </Col>
            )}
          </Row>
        </Form>

        {!isAdd(pathname) && !!feedbackHistory.length && (
          <>
            <div className="bold">Lịch sử xử lý phản ánh</div>
            <FeedbackStatusHistory listAction={feedbackHistory} />
          </>
        )}
        {!isAdd(pathname) && (
          <Tabs defaultActiveKey="1" items={items} destroyInactiveTabPane />
        )}
        <ButtonWrapper style={{ marginTop: 20, justifyContent: 'flex-end' }}>
          {footer(feedbackRequestResponseDTO, form) as AnyElement}
          <CButtonClose onClick={onBack} />
        </ButtonWrapper>
      </FormFeedbackWrapper>
      <ModalPdf
        isOpen={isOpenPdf}
        setIsOpen={setIsOpenPdf}
        src={
          (imageUrl as string) ||
          (typeof attachFileSrc === 'object'
            ? (attachFileSrc?.url as string)
            : (attachFileSrc as string))
        }
      />
      <ModalImage
        isOpen={isOpenImage}
        setIsOpen={setIsOpenImage}
        src={
          (imageUrl as string) ||
          (typeof attachFileSrc === 'object'
            ? (attachFileSrc?.url as string)
            : (attachFileSrc as string))
        }
      />
    </Spin>
  );
};
