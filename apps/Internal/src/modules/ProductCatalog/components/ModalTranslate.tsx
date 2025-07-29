import React, { CButtonClose, CButtonSave } from '@react/commons/Button';
import { CSelect } from '@react/commons/index';
import CModal from '@react/commons/Modal';
import { MESSAGE } from '@react/utils/message';
import { Col, Input, Row, Space } from 'antd';
import { useProductCatalogStore } from '../store';
import styled from 'styled-components';
import { useCallback, useEffect, useState } from 'react';
import { set } from 'lodash';

interface ModalTranslateProps {
  onClose: () => void;
  open: boolean;
  disabled: boolean;
}

const StyledCSelect = styled(CSelect)<{ hasError: boolean }>`
  min-width: 230px;
  ${({ hasError }) =>
    hasError &&
    `
      & .ant-select-selector {
        border: 1px solid red !important;
      }
    `}
`;

const StyledInput = styled(Input)<{ hasError: boolean }>`
  ${({ hasError }) =>
    hasError &&
    `
      border: 1px solid red !important;
    `}
`;

export const ModalTranslate = ({
  onClose,
  open,
  disabled,
}: ModalTranslateProps) => {
  const {
    setProductDescription,
    setSelectedLanguage,
    selectedLanguage,
    productDescription,
  } = useProductCatalogStore();
  const [value, setValue] = useState('');
  const [errorValue, setErrorValue] = useState(false);
  const [errorSelctedLanguage, setErrorSelctedLanguage] = useState(false);
  const [language, setLanguage] = useState('');
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    setErrorSelctedLanguage(false);
  };

  const handleSave = () => {
    let hasError = false;
    if (!language) {
      setErrorSelctedLanguage(true);
      hasError = true;
    } else {
      setErrorSelctedLanguage(false);
    }
    if (!value) {
      setErrorValue(true);
      hasError = true;
    } else {
      setErrorValue(false);
    }
    if (hasError) {
      return;
    }
    setProductDescription(value);
    setSelectedLanguage(language);
    onClose();
  };
  const handleClose = useCallback(() => {
    setValue('');
    setLanguage('');
    setErrorSelctedLanguage(false);
    setErrorValue(false);
    onClose();
  }, [onClose]);
  useEffect(() => {
    if (open) {
      setValue(productDescription);
      setLanguage(selectedLanguage);
    }
  }, [productDescription, selectedLanguage, open]);
  const handleBlur = () => {
    if (value.trim()) {
      setValue(value.trim());
    }
  };
  return (
    <CModal
      open={open}
      onCancel={handleClose}
      title="Nhập ngôn ngữ khác"
      width={700}
      footer={null}
    >
      <Row gutter={[24, 0]}>
        <Col span={9}>
          <StyledCSelect
            disabled={disabled}
            hasError={errorSelctedLanguage}
            options={[
              {
                value: 'en',
                label: 'Tiếng Anh',
              },
            ]}
            className="min-w-[150px]"
            placeholder="Chọn ngôn ngữ"
            value={language === 'en' ? 'en' : undefined} // Use `language` here
            onChange={handleLanguageChange}
          />
          {errorSelctedLanguage && (
            <span className="text-red-500">{MESSAGE.G06}</span>
          )}
        </Col>
        <Col span={15}>
          <StyledInput
            disabled={disabled}
            maxLength={100}
            placeholder="Nhập nội dung"
            value={value}
            hasError={errorValue}
            onBlur={handleBlur}
            onChange={(e) => {
              setValue(e.target.value);
              setErrorValue(false);
            }}
          />
          {errorValue && <span className="text-red-500">{MESSAGE.G06}</span>}
        </Col>
      </Row>
      <Row justify="end" className="mt-4">
        <Space size="middle">
          <CButtonSave onClick={handleSave} disabled={disabled} />
          <CButtonClose onClick={handleClose} disabled={disabled} />
        </Space>
      </Row>
    </CModal>
  );
};
