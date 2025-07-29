import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton, {
  CButtonClose,
  CButtonDelete,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import CInput from '@react/commons/Input';
import CSwitch from '@react/commons/Switch';
import Show from '@react/commons/Template/Show';
import { Text, TitleHeader, Wrapper } from '@react/commons/Template/style';
import CTextArea from '@react/commons/TextArea';
import { CModalConfirm, CSelect, CTable } from '@react/commons/index';
import {
  ActionsTypeEnum,
  ActionType,
  ImageFileType,
} from '@react/constants/app';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import { Card, Col, Form, Radio, Row, Spin, Upload } from 'antd';
import Column from 'antd/es/table/Column';
import { RcFile } from 'antd/es/upload';
import { useGetImageCatalog } from 'apps/Internal/src/components/layouts/queryHooks';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { includes } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  useGetNations,
  useSupportAddCoverageArea,
  useSupportCheckIsAttached,
  useSupportDeleteCoverageArea,
  useSupportGetCoverageArea,
  useSupportUpdateCoverageArea,
} from '../queryHooks';
import useCoverageManagementStore from '../store';
import { CoverageScopeEnum, ICountry, IFormCoverageArea } from '../types';
import ChooseNationMadal from '../components/ChooseNationModal';
const ActionCoverageArea = () => {
  const { pathname } = useLocation();
  const actionByRole = useRolesByRouter();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm<IFormCoverageArea>();
  const [isSubmitBack, setIsSubmitBack] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [isOpenNationPopup, setIsOpenNationPopup] = useState(false);
  const [originalStatus, setOriginalStatus] = useState<boolean>();
  const rangeType = Form.useWatch('rangeType', form);
  const { setFormNations, originalNationList, setOriginalNationsList } =
    useCoverageManagementStore();
  const [imageSrc, setImageSrc] = useState<string>('');
  const { data: imageBlob, refetch: refetchImage } =
    useGetImageCatalog(imageSrc);
  const { data: nationList } = useGetNations({
    page: 0,
    size: 1000,
    valueSearch: '',
  });
  const {
    data: coverageDetail,
    isFetching: loadingDetail,
    refetch: refetchDetail,
  } = useSupportGetCoverageArea(id);
  const { data: isCoverageAttached } = useSupportCheckIsAttached(id);
  const dataTable = Form.useWatch('nations', form) || [
    { rangeCode: undefined },
  ];
  useEffect(() => {
    return () => {
      setIsSubmitBack(false);
    };
  }, [pathname]);
  useEffect(() => {
    setFormNations(form);
  }, []);
  const typeModal = useMemo(() => {
    if (pathname.includes('add')) return ActionType.ADD;
    if (pathname.includes('edit')) return ActionType.EDIT;
    return ActionType.VIEW;
  }, [pathname]);

  const getTitleByMode = useCallback(() => {
    if (typeModal === ActionType.ADD) return 'Khai báo phạm vi phủ sóng';
    if (typeModal === ActionType.VIEW) return 'Chi tiết phạm vi phủ sóng';
    if (typeModal === ActionType.EDIT) return 'Chỉnh sửa phạm vi phủ sóng';
    return '';
  }, [typeModal]);

  const { mutate: createCoverageArea, isPending: loadingCreate } =
    useSupportAddCoverageArea(
      () => {
        if (isSubmitBack) {
          handleClose();
        } else {
          form.resetFields();
          setImageUrl('');
        }
      },
      (errors) => {
        form.setFields(
          errors.map((err) => ({
            name: err.field as keyof IFormCoverageArea,
            errors: [err.detail],
          }))
        );
      }
    );

  const { mutate: updateCoverageArea, isPending: loadingUpdate } =
    useSupportUpdateCoverageArea(
      () => {
        navigate(-1);
      },
      (errors) => {
        form.setFields(
          errors.map((err) => ({
            name: err.field as keyof IFormCoverageArea,
            errors: [err.detail],
          }))
        );
      }
    );
  const { mutate: deleteCoverageArea } = useSupportDeleteCoverageArea(() =>
    navigate(-1)
  );
  useEffect(() => {
    if (imageBlob) {
      setImageUrl(imageBlob);
    }
  }, [imageBlob]);
  useEffect(() => {
    if (coverageDetail && typeModal !== ActionType.ADD && form) {
      form.setFieldsValue({
        id: coverageDetail.id,
        rangeCode: coverageDetail.rangeCode,
        rangeName: coverageDetail.rangeName,
        description: coverageDetail.description,
        status: coverageDetail.status === 1 ? true : false,
        rangeType: coverageDetail.rangeType,
        nations:
          coverageDetail.nations?.length > 0
            ? coverageDetail.nations
            : [{ rangeCode: undefined }],
      });
      setImageSrc(`/${coverageDetail.imgUrl}`);
      setOriginalNationsList(coverageDetail.nations?.map((item) => item?.id));
      setOriginalStatus(coverageDetail.status === 1 ? true : false);
    }
    if (typeModal === ActionType.VIEW) {
      refetchDetail();
      refetchImage();
    }
  }, [coverageDetail, typeModal, form]);

  const getNationsDifference = useCallback(
    (
      oldNations: number[],
      currentNations: number[]
    ): { addedNations: number[]; removedNations: number[] } => {
      const addedNations = currentNations?.filter(
        (id) => !oldNations?.includes(id)
      );
      const removedNations = oldNations?.filter(
        (id) => !currentNations?.includes(id)
      );
      return { addedNations, removedNations };
    },
    []
  );
  const handleFinish = useCallback(
    (values: IFormCoverageArea) => {
      const rangeType = form.getFieldValue('rangeType');
      if (typeModal === ActionType.ADD) {
        createCoverageArea({
          ...values,
          avatar: values.avatar.file,
          ...(rangeType === CoverageScopeEnum.REGION && {
            nationsIds: values.nations.map((item) => item.id),
          }),
        });
      } else {
        const dataUpdate = {
          id: form.getFieldValue('id'),
          ...values,
          status: values.status ? 1 : 0,
          ...(values.avatar && { avatar: values.avatar.file }),
        };
        if (rangeType === CoverageScopeEnum.REGION) {
          const currentNationIds = values.nations?.map((item) => item?.id);
          const diffNationIds = getNationsDifference(
            originalNationList,
            currentNationIds
          );
          dataUpdate.newNationIds = diffNationIds.addedNations;
          dataUpdate.removingNationIds = diffNationIds.removedNations;
        }
        if (isCoverageAttached === false || originalStatus === values.status) {
          CModalConfirm({
            message: MESSAGE.G04,
            onOk: () => {
              updateCoverageArea(dataUpdate);
            },
          });
        } else if (
          isCoverageAttached === true &&
          originalStatus !== values.status &&
          values.status === false
        ) {
          CModalConfirm({
            message:
              'Danh sách sản phẩm thuộc phạm vi này sẽ bị ẩn trên website. Bạn có chắc chắn muốn cập nhật không?',
            onOk: () => {
              updateCoverageArea(dataUpdate);
            },
          });
        } else if (
          isCoverageAttached === true &&
          originalStatus !== values.status &&
          values.status === true
        ) {
          CModalConfirm({
            message:
              'Danh sách sản phẩm thuộc phạm vi này sẽ hiển thị trên website. Bạn có chắc chắn muốn cập nhật không?',
            onOk: () => {
              updateCoverageArea(dataUpdate);
            },
          });
        } else {
          CModalConfirm({
            message: MESSAGE.G04,
            onOk: () => {
              updateCoverageArea(dataUpdate);
            },
          });
        }
      }
    },
    [typeModal === ActionType.ADD, id, originalStatus]
  );

  const handleEdit = useCallback(() => {
    navigate(pathRoutes.coverageAreaManagerEdit(id));
  }, [id]);

  const handleClose = useCallback(() => {
    form.resetFields();
    navigate(-1);
  }, []);
  const uploadButton = (
    <button
      className={
        'border-2 border-dashed border-cyan-600 bg-none rounded-md px-16 py-8 ' +
        (typeModal === ActionType.VIEW
          ? 'cursor-not-allowed'
          : 'cursor-pointer')
      }
      type="button"
    >
      <UploadOutlined className="text-3xl text-cyan-700" />
      <div className="mt-2 text-cyan-700">Tải file lên</div>
    </button>
  );
  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  const beforeUpload = useCallback(
    async (file: RcFile) => {
      if (!ImageFileType.includes(file.type)) {
        return;
      }
      const url = await getBase64(file);
      form.setFieldValue('avatar', file);
      setImageUrl(url);
      return false;
    },
    [form]
  );
  const handleDelete = () => {
    CModalConfirm({
      message: MESSAGE.G05,
      onOk: () => {
        deleteCoverageArea(id || '');
      },
    });
  };
  return (
    <Wrapper>
      <TitleHeader>{getTitleByMode()}</TitleHeader>
      <Spin spinning={loadingDetail}>
        <Form
          form={form}
          layout="horizontal"
          onFinish={handleFinish}
          disabled={typeModal === ActionType.VIEW}
          initialValues={{
            status: true,
            rangeType: CoverageScopeEnum.COUNTRY,
          }}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          colon={false}
        >
          <Card>
            <Row>
              <Col span={24}>
                <Form.Item
                  label={'Phạm vi'}
                  name="rangeType"
                  rules={[validateForm.required]}
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                >
                  <Radio.Group disabled={typeModal !== ActionType.ADD}>
                    <Radio value={CoverageScopeEnum.COUNTRY}>Quốc gia</Radio>
                    <Radio value={CoverageScopeEnum.REGION}>Khu vực</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label={`${
                    rangeType === CoverageScopeEnum.COUNTRY
                      ? 'Mã quốc gia'
                      : 'Mã khu vực'
                  }`}
                  name="rangeCode"
                  rules={[validateForm.required]}
                >
                  <CInput
                    placeholder={`${
                      rangeType === CoverageScopeEnum.COUNTRY
                        ? 'Nhập mã quốc gia'
                        : 'Nhập mã khu vực'
                    }`}
                    maxLength={20}
                    uppercase
                    preventSpace
                    preventVietnamese
                    preventSpecialExceptHyphenAndUnderscore
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label={`${
                    rangeType === CoverageScopeEnum.COUNTRY
                      ? 'Tên quốc gia'
                      : 'Tên khu vực'
                  }`}
                  name="rangeName"
                  rules={[validateForm.required]}
                  className="ml-7"
                >
                  <CInput
                    placeholder={`${
                      rangeType === CoverageScopeEnum.COUNTRY
                        ? 'Nhập tên quốc gia'
                        : 'Nhập tên khu vực'
                    }`}
                    maxLength={100}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={'Ảnh'}
                  required
                  name="avatar"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (!value && !imageUrl) {
                          return Promise.reject(new Error(MESSAGE.G06));
                        }
                        if (value && !ImageFileType.includes(value.file.type)) {
                          setImageUrl(undefined);
                          return Promise.reject(
                            new Error('File tải lên không đúng định dạng')
                          );
                        }
                        if (value && value.file.size / 1024 / 1024 > 5) {
                          return Promise.reject(
                            new Error('File tải lên vượt quá 5MB')
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Upload
                    accept={ImageFileType.join(',')}
                    showUploadList={false}
                    disabled={typeModal === ActionType.VIEW}
                    multiple={false}
                    maxCount={1}
                    beforeUpload={beforeUpload}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Ảnh quốc gia/khu vực"
                        className={
                          'rounded-xl object-cover h-36 w-[200px] ' +
                          (typeModal === ActionType.VIEW
                            ? 'cursor-not-allowed'
                            : 'cursor-pointer')
                        }
                      />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={'Hoạt động'}
                  name="status"
                  valuePropName="checked"
                  rules={[validateForm.required]}
                  className="ml-7"
                >
                  <CSwitch disabled={typeModal !== ActionType.EDIT} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={'Mô tả'}
                  name="description"
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                >
                  <CTextArea
                    rows={4}
                    placeholder="Nhập mô tả"
                    maxLength={255}
                  />
                </Form.Item>
              </Col>
            </Row>
            {rangeType === CoverageScopeEnum.REGION && (
              <div className="mt-8 flex justify-between mb-3">
                <p className="font-bold text-lg">
                  Danh sách quốc gia trong khu vực
                </p>
                <CButton
                  icon={<PlusOutlined />}
                  onClick={() => setIsOpenNationPopup(true)}
                >
                  Chọn quốc gia
                </CButton>
              </div>
            )}
            {rangeType === CoverageScopeEnum.REGION && (
              <Form.List name="nations">
                {(fields, { add, remove }) => (
                  <Row>
                    <Col span={23}>
                      <CTable
                        pagination={false}
                        scroll={{ y: 230 }}
                        dataSource={dataTable}
                      >
                        <Column
                          width={20}
                          dataIndex="stt"
                          title={'STT'}
                          render={(_, __, index: number) => (
                            <Text>{index + 1}</Text>
                          )}
                        />
                        <Column
                          render={(value) => <Text>{value}</Text>}
                          width={50}
                          dataIndex="rangeCode"
                          title="Mã quốc gia"
                        />
                        <Column
                          width={100}
                          dataIndex="rangeCode"
                          title={'Tên quốc gia'}
                          render={(_, record, index) => (
                            <Form.Item
                              name={[index, 'rangeCode']}
                              rules={[validateForm.required]}
                              className="w-1/2"
                            >
                              <CSelect
                                options={nationList?.content.map((option) => ({
                                  ...option,
                                  disabled: dataTable
                                    .map((item: ICountry) => item?.rangeCode)
                                    .includes(option.rangeCode),
                                }))}
                                placeholder="Chọn quốc gia"
                                fieldNames={{
                                  label: 'rangeName',
                                  value: 'rangeCode',
                                }}
                                onChange={(value) => {
                                  const newData = [...dataTable];
                                  newData[index] = {
                                    ...newData[index],
                                    rangeName: value,
                                    rangeCode: value,
                                    id:
                                      nationList?.content.find(
                                        (item) => item.rangeCode === value
                                      )?.id || 0,
                                  };
                                  form.setFieldValue('nations', newData);
                                }}
                                value={record?.rangeCode}
                                filterOption={(input, option) =>
                                  (option?.rangeName ?? '')
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                              />
                            </Form.Item>
                          )}
                        />
                        <Column
                          width={10}
                          title={''}
                          render={(
                            _: string,
                            __: Record<string, string>,
                            index: number
                          ) => (
                            <div className="flex">
                              <FontAwesomeIcon
                                icon={faMinus}
                                onClick={() => {
                                  if (typeModal !== ActionType.VIEW) {
                                    remove(fields[index].name);
                                    form.setFields([
                                      {
                                        name: ['nations', fields[index].name],
                                        errors: [],
                                      },
                                    ]);
                                    if (fields.length === 1) {
                                      add();
                                    }
                                  }
                                }}
                                className="mr-2 cursor-pointer"
                                size="lg"
                                title="Xóa"
                              />
                            </div>
                          )}
                        />
                      </CTable>
                    </Col>
                    <Col span={1} className={'relative'}>
                      <Show>
                        <Show.When isTrue={typeModal !== ActionType.VIEW}>
                          <FontAwesomeIcon
                            icon={faPlus}
                            size="lg"
                            onClick={() => {
                              if (typeModal !== ActionType.VIEW) {
                                add();
                              }
                            }}
                            className="cursor-pointer absolute bottom-1 left-5 mb-7"
                            title="Thêm"
                          />
                        </Show.When>
                      </Show>
                    </Col>
                  </Row>
                )}
              </Form.List>
            )}
          </Card>
          <div className="flex gap-4 flex-wrap justify-end mt-7">
            {typeModal === ActionType.ADD &&
              (includes(actionByRole, ActionsTypeEnum.UPDATE) ||
                includes(actionByRole, ActionsTypeEnum.CREATE)) && (
                <>
                  <CButtonSaveAndAdd
                    onClick={() => {
                      form.submit();
                    }}
                    loading={loadingCreate || loadingUpdate}
                    disabled={loadingCreate || loadingUpdate}
                  />
                  <CButtonSave
                    onClick={() => {
                      setIsSubmitBack(true);
                      form.submit();
                    }}
                    loading={loadingCreate || loadingUpdate}
                    disabled={loadingCreate || loadingUpdate}
                  />
                </>
              )}
            {typeModal === ActionType.EDIT &&
              includes(actionByRole, ActionsTypeEnum.UPDATE) && (
                <CButtonSave
                  onClick={() => {
                    setIsSubmitBack(true);
                    form.submit();
                  }}
                  loading={loadingCreate || loadingUpdate}
                  disabled={loadingCreate || loadingUpdate}
                />
              )}
            {typeModal === ActionType.VIEW &&
              includes(actionByRole, ActionsTypeEnum.DELETE) && (
                <CButtonDelete onClick={handleDelete} disabled={false} />
              )}
            {typeModal === ActionType.VIEW &&
              includes(actionByRole, ActionsTypeEnum.UPDATE) && (
                <CButtonEdit onClick={handleEdit} disabled={false} />
              )}
            <CButtonClose onClick={handleClose} disabled={false} />
          </div>
        </Form>
      </Spin>{' '}
      {isOpenNationPopup && (
        <ChooseNationMadal
          open={isOpenNationPopup}
          setIsOpen={setIsOpenNationPopup}
        />
      )}
    </Wrapper>
  );
};

export default ActionCoverageArea;
