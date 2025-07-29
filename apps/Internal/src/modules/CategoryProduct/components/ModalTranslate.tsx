import { CButtonClose, CButtonSave } from '@react/commons/Button';
import { CSelect } from '@react/commons/index';
import CModal from '@react/commons/Modal';
import { Col, Form, Input, Row, Space } from 'antd';
import { useEffect, useState } from 'react';
import { MESSAGE } from '@react/utils/message';

interface ModalTranslateProps {
  onClose: () => void;
  open: boolean;
  mainInputValue: string;
  onTranslateSave: (translatedValue: string, selectedLanguage: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}

export const ModalTranslate = ({
  onClose,
  open,
  mainInputValue,
  onTranslateSave,
  selectedLanguage,
  setSelectedLanguage,
}: ModalTranslateProps) => {
  const [form] = Form.useForm();
  const [translatedValue, setTranslatedValue] = useState('');
  const [errors, setErrors] = useState({
    translatedValue: '',
    language: '',
  });
  const handleClose = () => {
    setTranslatedValue('');
    setSelectedLanguage('');
    onClose();
  };
  useEffect(() => {
    if (open) {
      setTranslatedValue(mainInputValue);
      setSelectedLanguage(selectedLanguage);
      form.setFieldsValue({
        translatedValue: mainInputValue,
        language: selectedLanguage,
      });
      setErrors({
        translatedValue: '',
        language: '',
      });
    }
  }, [open]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      translatedValue: '',
      language: '',
    };

    if (!translatedValue.trim()) {
      newErrors.translatedValue = MESSAGE.G06;
      isValid = false;
    }

    if (!selectedLanguage) {
      newErrors.language = MESSAGE.G06;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (validateForm()) {
      onTranslateSave(translatedValue, selectedLanguage);
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTranslatedValue(value);
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, translatedValue: '' }));
    }
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    if (value) {
      setErrors((prev) => ({ ...prev, language: '' }));
    }
  };
  const handleBlurInput = () => {
    if (translatedValue.trim()) {
      setTranslatedValue(translatedValue.trim());
    }
  };
  return (
    <CModal
      open={open}
      onCancel={handleClose}
      title="Nhập ngôn ngữ khác"
      width={700}
      onOk={handleSave}
      footer={null}
    >
      <Form form={form} layout="vertical">
        <Row gutter={[24, 0]}>
          <Col span={10}>
            <Form.Item
              validateStatus={errors.language ? 'error' : ''}
              help={errors.language}
            >
              <CSelect
                options={[
                  {
                    value: 'en',
                    label: 'Tiếng Anh',
                  },
                ]}
                className="min-w-[150px]"
                placeholder="Chọn ngôn ngữ"
                value={selectedLanguage === '' ? undefined : selectedLanguage}
                onChange={handleLanguageChange}
                status={errors.language ? 'error' : ''}
              />
            </Form.Item>
          </Col>
          <Col span={14}>
            <Form.Item
              validateStatus={errors.translatedValue ? 'error' : ''}
              help={errors.translatedValue}
            >
              <Input
                maxLength={100}
                placeholder="Nhập nội dung"
                value={translatedValue}
                onChange={handleInputChange}
                onBlur={handleBlurInput}
                status={errors.translatedValue ? 'error' : ''}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="end" className="mt-4">
          <Space size="middle">
            <CButtonSave onClick={handleSave} />
            <CButtonClose onClick={handleClose} />
          </Space>
        </Row>
      </Form>
    </CModal>
  );
};
