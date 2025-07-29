import CInput from '@react/commons/Input';
import { Card, Col, Form, Row, TreeSelect } from 'antd';
import { useProductGroupQuery } from '../hooks/useProductGroupQuery';
import CSelect from '@react/commons/Select';
import CTextArea from '@react/commons/TextArea';
import CCheckbox from '@react/commons/Checkbox';
import CSwitch from '@react/commons/Switch';
import validateForm from '@react/utils/validator';
import { useParameterQuery } from 'apps/Internal/src/hooks/useParameterQuery';
import { mapProductGroups } from '../utils';
import { InformationProps } from '../types';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AnyElement } from '@react/commons/types';
import { usePackageQuery } from '../hooks/usePackageQuery';
import CButton from '@react/commons/Button';
import { ModalTranslate } from './ModalTranslate';
import { useProductCatalogStore } from '../store';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
const Information: React.FC<InformationProps> = ({ disabled }) => {
  const form = Form.useFormInstance();
  const { id } = useParams();
  const actions = useRolesByRouter();
  const [openTranslate, setOpenTranslate] = useState(false);
  const handleOpenTranslate = useCallback(() => {
    setOpenTranslate(true);
  }, []);
  const handleCloseTranslate = useCallback(() => {
    setOpenTranslate(false);
  }, []);
  const { isLoading: isLoadingProductGroup, data: productGroupData } =
    useProductGroupQuery();
  const { isLoading: isLoadingParameter, data: parameterData } =
    useParameterQuery({
      'table-name': 'PRODUCT',
      'column-name': 'PRODUCT_UOM',
    });
  const { isLoading: isLoadingPackage, data: packageData } = usePackageQuery();

  useEffect(() => {
    if (!id && parameterData?.length) {
      form.setFieldValue('productUom', parameterData[0].value);
    }
  }, [id, parameterData]);
  return (
    <Card>
      <div className="font-medium text-base text-primary mb-5">
        Thông tin sản phẩm
      </div>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            label="Mã sản phẩm"
            name="productCode"
            rules={[validateForm.required]}
          >
            <CInput
              placeholder="Nhập mã sản phẩm"
              uppercase
              preventSpace
              preventSpecialExceptHyphenAndUnderscore
              preventVietnamese
              maxLength={50}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Tên sản phẩm"
            name="productName"
            rules={[validateForm.required]}
          >
            <CInput
              placeholder="Nhập tên sản phẩm"
              maxLength={100}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Nhóm sản phẩm"
            name="parentId"
            rules={[validateForm.required]}
          >
            <TreeSelect
              placeholder="Chọn nhóm sản phẩm"
              showSearch
              treeDefaultExpandAll
              treeNodeFilterProp="title"
              disabled={disabled}
              loading={isLoadingProductGroup}
              treeData={mapProductGroups(productGroupData || []) as AnyElement}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Đơn vị tính" name="productUom">
            <CSelect
              placeholder="Chọn đơn vị tính"
              showSearch={false}
              disabled={disabled}
              loading={isLoadingParameter}
              options={parameterData}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="SKY package code" name="pckCode">
            <CSelect
              placeholder="Chọn SKY package code"
              allowClear
              showSearch
              disabled={disabled}
              loading={isLoadingPackage}
              options={packageData?.map((item) => ({
                label: item.pckCode,
                value: item.pckCode,
              }))}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Khối lượng" name="weight">
            <CInput
              placeholder="Nhập khối lượng"
              suffix="Gram"
              allowClear={false}
              maxLength={10}
              disabled={disabled}
              onlyNumber
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="checkQuantity" valuePropName="checked">
            <CCheckbox className="w-max" disabled={disabled}>
              Kiểm tra số lượng
            </CCheckbox>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="checkSerial" valuePropName="checked">
            <CCheckbox className="w-max" disabled={disabled}>
              Kiểm tra serial
            </CCheckbox>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Hoạt động"
            name="productStatus"
            valuePropName="checked"
          >
            <CSwitch disabled={disabled || !id} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            labelCol={{ span: 3 }}
            label="Mô tả"
            name="productDescription"
          >
            <div className="relative">
              <CTextArea
                placeholder="Nhập mô tả"
                maxLength={200}
                className="-ml-1 pr-20"
                disabled={disabled}
              />
              {actions.includes(ActionsTypeEnum.TRANSLATE) && (
                <CButton
                  type="primary"
                  size="middle"
                  className="absolute bottom-[10px] right-[26px] z-10"
                  onClick={handleOpenTranslate}
                  disabled={disabled}
                >
                  Dịch
                </CButton>
              )}
            </div>
          </Form.Item>
        </Col>
      </Row>
      <ModalTranslate
        disabled={disabled}
        open={openTranslate}
        onClose={handleCloseTranslate}
      />
    </Card>
  );
};

export default Information;
