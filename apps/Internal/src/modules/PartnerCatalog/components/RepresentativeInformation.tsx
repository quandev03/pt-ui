import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CDatePicker from '@react/commons/DatePicker';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { ACTION_MODE_ENUM } from '@react/commons/types';
import { ImageFileType, UploadFileMax } from '@react/constants/app';
import { formatDate, formatDateV2 } from '@react/constants/moment';
import { emailRegex } from '@react/constants/regex';
import {
  cleanUpPhoneNumber,
  handlePasteRemoveSpace,
} from '@react/helpers/utils';
import useActionMode from '@react/hooks/useActionMode';
import validateForm from '@react/utils/validator';
import { Col, Form, Row, Spin, Tooltip } from 'antd';
import { RcFile } from 'antd/es/upload';
import dayjs from 'dayjs';
import { FocusEvent, useCallback, useEffect, useMemo, useRef } from 'react';
import { useGetCCCDInfo } from '../queryHooks';
import usePartnerStore from '../stores';
import { ChildRef } from '../types';
import FileUpload from './FileUpload';

const isRcFile = (file: any): file is RcFile => {
  return (
    file &&
    typeof file === 'object' &&
    'uid' in file &&
    'name' in file &&
    'size' in file &&
    'type' in file
  );
};
const RepresentativeInformation = () => {
  const idCardFrontSiteRef = useRef<ChildRef>(null);
  const idCardBackSiteRef = useRef<ChildRef>(null);
  const portraitRef = useRef<ChildRef>(null);
  const actionMode = useActionMode();
  const { partnerDetail, setPartnerDetail } = usePartnerStore();
  const form = Form.useFormInstance();
  const handleBlur = (e: FocusEvent<HTMLInputElement>, field: string) => {
    form.setFieldValue(field, e.target.value.trim());
    form.validateFields([field]);
  };

  const { idCardFrontSite, idCardBackSite, portrait } =
    Form.useWatch((value) => value, form) ?? {};

  const {
    mutate: getCCCDInfo,
    isPending: loadingInfor,
    isError,
    reset,
  } = useGetCCCDInfo((data) => {
    let gender = '';
    if (data.sex === '1' || data.sex === 'nam' || data.sex === 'Nam') {
      gender = '1';
    } else if (data.sex === '0' || data.sex === 'nữ' || data.sex === 'Nữ') {
      gender = '0';
    }
    form.setFieldsValue({
      consigneeName: data.name,
      idNo: data.id,
      idPlace: data.issue_by,
      gender: gender,
      dateOfBirth: data.birthday ? dayjs(data.birthday, formatDateV2) : null,
      consigneeAddress: data.address,
      idDate: data.issue_date ? dayjs(data.issue_date, formatDateV2) : null,
    });
  });

  useEffect(() => {
    if (
      idCardFrontSite &&
      idCardBackSite &&
      portrait &&
      isRcFile(idCardFrontSite) &&
      isRcFile(idCardBackSite) &&
      isRcFile(portrait) &&
      actionMode !== ACTION_MODE_ENUM.VIEW
    ) {
      getCCCDInfo({
        cardBack: idCardBackSite,
        cardFront: idCardFrontSite,
        portrait: portrait,
      });
    }
  }, [idCardBackSite, idCardBackSite, portrait]);

  const handleRefreshRepresentativeInformation = () => {
    form.resetFields([
      'idCardFrontSite',
      'idCardBackSite',
      'portrait',
      // 'consigneeName',
      // 'idNo',
      // 'idPlace',
      // 'gender',
      // 'dateOfBirth',
      // 'consigneeAddress',
      // 'idDate',
    ]);
    reset();
    idCardFrontSiteRef.current?.clearImage();
    idCardBackSiteRef.current?.clearImage();
    portraitRef.current?.clearImage();
    if (
      partnerDetail?.deliveryInfos &&
      partnerDetail?.deliveryInfos.length > 0
    ) {
      setPartnerDetail({
        ...partnerDetail,
        deliveryInfos: [
          {
            ...partnerDetail.deliveryInfos[0],
            idCardFrontSiteFileLink: undefined,
            idCardBackSiteFileLink: undefined,
            multiFileLink: undefined,
            idCardFrontSiteFileUrl: undefined,
            idCardBackSiteFileUrl: undefined,
            multiFileUrl: undefined,
          },
        ],
      });
    }
  };

  const validFile = useCallback((file?: RcFile) => {
    if (
      file &&
      (!ImageFileType.some((item) => file.type === item) ||
        (file.size && file.size > UploadFileMax))
    ) {
      return false;
    }
    return true;
  }, []);

  const disableIdCardFrontSite = useMemo(() => {
    if (!validFile(idCardFrontSite)) {
      return false;
    }
    return actionMode === ACTION_MODE_ENUM.VIEW || idCardFrontSite;
  }, [actionMode, idCardFrontSite, validFile]);

  const disableIdCardBackSite = useMemo(() => {
    if (!validFile(idCardFrontSite)) {
      return true;
    }
    if (!validFile(idCardBackSite) || isError) {
      return false;
    }
    return (
      actionMode === ACTION_MODE_ENUM.VIEW || !idCardFrontSite || idCardBackSite
    );
  }, [actionMode, idCardFrontSite, idCardBackSite, isError]);

  const disablePortrait = useMemo(() => {
    if (!validFile(idCardBackSite)) {
      return true;
    }
    if (!validFile(portrait) || isError) {
      return false;
    }

    return actionMode === ACTION_MODE_ENUM.VIEW || !idCardBackSite || portrait;
  }, [actionMode, idCardBackSite, portrait, isError]);

  const requiredIdCardFrontSite = useMemo(() => {
    if (idCardFrontSite) {
      return true;
    }
    if (
      partnerDetail?.deliveryInfos &&
      partnerDetail?.deliveryInfos.length > 0 &&
      !!partnerDetail?.deliveryInfos?.[0].idCardFrontSiteFileLink
    ) {
      return true;
    }
    return false;
  }, [idCardFrontSite, partnerDetail]);

  const requiredIdCardBackSite = useMemo(() => {
    if (idCardFrontSite && validFile(idCardFrontSite)) {
      return true;
    }
    if (
      partnerDetail?.deliveryInfos &&
      partnerDetail?.deliveryInfos.length > 0 &&
      !!partnerDetail?.deliveryInfos?.[0].idCardFrontSiteFileLink
    ) {
      console.log(!!partnerDetail?.deliveryInfos?.[0].idCardFrontSiteFileLink);

      return true;
    }
    return false;
  }, [idCardFrontSite, partnerDetail]);

  const requiredPortrait = useMemo(() => {
    if (requiredIdCardBackSite) {
      return true;
    }
    if (
      partnerDetail?.deliveryInfos &&
      partnerDetail?.deliveryInfos.length > 0 &&
      !!partnerDetail?.deliveryInfos?.[0].idCardFrontSiteFileLink
    ) {
      return true;
    }
    if (idCardBackSite && validFile(idCardBackSite)) {
      return true;
    }
    return false;
  }, [idCardBackSite, requiredIdCardBackSite, partnerDetail]);

  return (
    <div className="border rounded-md p-5 relative">
      <div className="text-lg !text-[#076AB3] font-bold flex gap-4 bg-white absolute -top-[15px]">
        <div>Thông tin người đại diện</div>
        {actionMode !== ACTION_MODE_ENUM.VIEW && (
          <Tooltip title="Làm mới">
            <FontAwesomeIcon
              icon={faRotateLeft}
              size="lg"
              className="cursor-pointer self-center"
              onClick={handleRefreshRepresentativeInformation}
            />
          </Tooltip>
        )}
      </div>
      <Spin spinning={loadingInfor}>
        <Row gutter={[30, 0]}>
          <Col span={8}>
            <FileUpload
              imageUrl={
                partnerDetail?.deliveryInfos &&
                partnerDetail?.deliveryInfos.length > 0 &&
                partnerDetail?.deliveryInfos?.[0].idCardFrontSiteFileLink
                  ? partnerDetail?.deliveryInfos?.[0].idCardFrontSiteFileLink
                  : undefined
              }
              label="Upload CMND/CCCD mặt trước"
              name="idCardFrontSite"
              disabled={disableIdCardFrontSite}
              required={requiredIdCardFrontSite}
              showIconRequired={requiredIdCardFrontSite}
              ref={idCardFrontSiteRef}
            />
          </Col>
          <Col span={8}>
            <FileUpload
              imageUrl={
                partnerDetail?.deliveryInfos &&
                partnerDetail?.deliveryInfos.length > 0 &&
                partnerDetail?.deliveryInfos?.[0].idCardBackSiteFileLink
                  ? partnerDetail?.deliveryInfos?.[0].idCardBackSiteFileLink
                  : undefined
              }
              label="Upload CMND/CCCD mặt sau"
              name="idCardBackSite"
              disabled={disableIdCardBackSite}
              ref={idCardBackSiteRef}
              required={requiredIdCardBackSite}
              showIconRequired={requiredIdCardBackSite}
            />
          </Col>
          <Col span={8}>
            <FileUpload
              imageUrl={
                partnerDetail?.deliveryInfos &&
                partnerDetail?.deliveryInfos.length > 0 &&
                partnerDetail?.deliveryInfos?.[0].multiFileLink
                  ? partnerDetail?.deliveryInfos?.[0].multiFileLink
                  : undefined
              }
              label="Upload ảnh chân dung"
              name="portrait"
              disabled={disablePortrait}
              ref={portraitRef}
              required={requiredPortrait}
              showIconRequired={requiredPortrait}
            />
          </Col>

          <Col span={8}>
            <Form.Item
              label="Tên người đại diện"
              name="consigneeName"
              required
              rules={[
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject('Không được để trống trường này');
                    } else {
                      return Promise.resolve();
                    }
                  },
                },
              ]}
            >
              <CInput
                placeholder="Nhập tên người đại diện"
                maxLength={100}
                disabled={actionMode === ACTION_MODE_ENUM.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Số CCCD/CMND"
              name="idNo"
              required
              rules={[
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject('Không được để trống trường này');
                    } else {
                      return Promise.resolve();
                    }
                  },
                },
              ]}
            >
              <CInput
                placeholder="Nhập số CCCD/CMND"
                maxLength={20}
                disabled={actionMode === ACTION_MODE_ENUM.VIEW}
                onlyNumber
                preventSpace
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Nơi cấp" name="idPlace">
              <CInput
                placeholder="Nhập nơi cấp"
                maxLength={100}
                disabled={actionMode === ACTION_MODE_ENUM.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Ngày cấp" name="idDate">
              <CDatePicker
                placeholder="Chọn ngày cấp"
                format={formatDate}
                disabled={actionMode === ACTION_MODE_ENUM.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Giới tính" name="gender">
              <CSelect
                placeholder="Chọn giới tính"
                options={[
                  {
                    label: 'Nam',
                    value: '1',
                  },
                  {
                    label: 'Nữ',
                    value: '0',
                  },
                ]}
                disabled={actionMode === ACTION_MODE_ENUM.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Ngày sinh" name="dateOfBirth">
              <CDatePicker
                placeholder="Chọn ngày sinh"
                format={formatDate}
                disabled={actionMode === ACTION_MODE_ENUM.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Hộ chiếu" name="passportNo">
              <CInput
                placeholder="Nhập hộ chiếu"
                maxLength={20}
                disabled={actionMode === ACTION_MODE_ENUM.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Số điện thoại"
              name="phoneOrganizationDeliveryInfoDTO"
              required
              rules={[validateForm.required]}
            >
              <CInput
                placeholder="Nhập số điện thoại"
                maxLength={12}
                disabled={actionMode === ACTION_MODE_ENUM.VIEW}
                onlyNumber
                preventSpace
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={'Email'}
              name="emailOrganizationDeliveryInfoDTO"
              required
              rules={[
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject('Không được để trống trường này');
                    } else if (!emailRegex.test(value)) {
                      return Promise.reject('Email không đúng định dạng');
                    } else {
                      return Promise.resolve();
                    }
                  },
                },
              ]}
            >
              <CInput
                placeholder="Nhập email"
                onBlur={(e) => {
                  handleBlur(e, 'emailOrganizationDeliveryInfoDTO');
                }}
                onPaste={(event) => handlePasteRemoveSpace(event, 100)}
                maxLength={100}
                disabled={actionMode === ACTION_MODE_ENUM.VIEW}
                onInput={(e: any) =>
                  (e.target.value = cleanUpPhoneNumber(e.target.value))
                }
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Chức danh" name="orgTitle">
              <CInput
                placeholder="Nhập chức danh"
                maxLength={100}
                disabled={actionMode === ACTION_MODE_ENUM.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item label="Địa chỉ" name="consigneeAddress">
              <CInput
                maxLength={250}
                placeholder="Nhập địa chỉ"
                disabled={actionMode === ACTION_MODE_ENUM.VIEW}
              />
            </Form.Item>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default RepresentativeInformation;
