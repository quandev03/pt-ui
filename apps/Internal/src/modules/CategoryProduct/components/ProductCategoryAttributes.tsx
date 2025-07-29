import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form, Row, Col, FormInstance } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import CInput from '@react/commons/Input';
import { Button, CSelect } from '@react/commons/index';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import { MESSAGE } from '@react/utils/message';
import useGetTypeAtrribute from '../queryHook/useGetTypeAtrribute';
import { useWatch } from 'antd/es/form/Form';
import { TypeAttribute } from '../types';
import CButton from '@react/commons/Button';
import { ModalTranslate } from './ModalTranslate';
import useCategoryProductStore from '../store';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { includes } from 'lodash';

interface ProductCategoryAttributesProps {
    form: FormInstance;
    typeModal: string;
    checkCategoryType: boolean;
}

interface TranslateContext {
    fieldName: number;
    valueFieldName: number;
}

const ProductCategoryAttributes: React.FC<ProductCategoryAttributesProps> = ({
    form,
    typeModal,
    checkCategoryType,
}) => {
    const actions = useRolesByRouter();
    const { translatedValues, updateTranslatedValue, resetTranslatedValues, resetAttributeTranslatedValues, updateTranslatedValuesAfterRemove } = useCategoryProductStore();
    const addAttribute = () => {
        const attributes = form.getFieldValue('productCategoryAttributeDTOS') || [];
        form.setFieldsValue({
            productCategoryAttributeDTOS: [
                ...attributes,
                {
                    attributeName: '',
                    attributeType: listTypeAttribute.filter(
                        (item: any) => item.value === TypeAttribute.DONG
                    )[0].value,
                    productCategoryAttributeValueDTOS: [{ value: '', valueEn: '' }],
                },
            ],
        });
    };
    const removeAttribute = (fieldName: number) => {
        const attributes = form.getFieldValue('productCategoryAttributeDTOS') || [];
        resetAttributeTranslatedValues(fieldName);
        form.setFieldsValue({
            productCategoryAttributeDTOS: attributes.filter(
                (_: any, index: number) => index !== fieldName
            ),
        });
        updateTranslatedValuesAfterRemove(fieldName);
    };
    const handleBlurAttribute = (
        e: React.FocusEvent<HTMLInputElement>,
        fieldName: number,
        attributeName: string
    ) => {
        const value = e.target.value;
        const updatedAttributes = form.getFieldValue(
            'productCategoryAttributeDTOS'
        );
        updatedAttributes[fieldName][attributeName] = value.trim();
        form.setFieldsValue({
            productCategoryAttributeDTOS: updatedAttributes,
        });
        form.validateFields([
            ['productCategoryAttributeDTOS', fieldName, attributeName],
        ]);
    };
    const { data: dataTypeAttribute, isPending: loadingTypeAttribute } =
        useGetTypeAtrribute();
    const listTypeAttribute = useMemo(() => {
        if (!dataTypeAttribute) return [];
        return dataTypeAttribute.map((item: any) => ({
            label: item.value,
            value: item.code,
        }));
    }, [dataTypeAttribute]);
    const [listTypeAttributeFilter, setListTypeAttributeFilter] = useState<any[]>(
        []
    );
    const productCategoryAttributeDTOSs = useWatch(
        'productCategoryAttributeDTOS',
        form
    );
    useEffect(() => {
        if (Array.isArray(productCategoryAttributeDTOSs)) {
            const attributeTypes = new Set(
                productCategoryAttributeDTOSs.map((item: any) => item.attributeType)
            );

            const filteredList = listTypeAttribute.map((item: any) => ({
                ...item,
                disabled:
                    attributeTypes.has(item.value) && item.value !== TypeAttribute.DONG,
            }));

            setListTypeAttributeFilter(filteredList);
        }
    }, [productCategoryAttributeDTOSs, listTypeAttribute, form]);
    const [currentTranslateValue, setCurrentTranslateValue] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState('');

    const [translateContext, setTranslateContext] = useState<TranslateContext | null>(null);

    const handleBlurValue = (
        e: React.FocusEvent<HTMLInputElement>,
        fieldName: number,
        valueFieldName: number
    ) => {
        const value = e.target.value;
        const updatedAttributes = form.getFieldValue(
            'productCategoryAttributeDTOS'
        );
        updatedAttributes[fieldName].productCategoryAttributeValueDTOS[
            valueFieldName
        ].value = value.trim();
        form.setFieldsValue({
            productCategoryAttributeDTOS: updatedAttributes,
        });
        form.validateFields([
            [
                'productCategoryAttributeDTOS',
                fieldName,
                'productCategoryAttributeValueDTOS',
                valueFieldName,
                'value',
            ],
        ]);
    };
    const isNotDeletableAttribute = (attributeType: string) => {
        return (
            attributeType === TypeAttribute.GOI_CUOC_CHINH ||
            attributeType === TypeAttribute.LOAI_SIM
        );
    };
    //  update translate
    const [openModalTranslate, setOpenModalTranslate] = useState(false);
    const handleCloseModalTranslate = () => {
        setOpenModalTranslate(false);
        setCurrentTranslateValue("");
        setTranslateContext(null);
    };
    const handleTranslate = (fieldName: number, valueFieldName: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const currentValue = form.getFieldValue([
            'productCategoryAttributeDTOS',
            fieldName,
            'productCategoryAttributeValueDTOS',
            valueFieldName,
            'value',
        ]);
        setCurrentTranslateValue("");
        const key = `${fieldName}-${valueFieldName}`;
        setCurrentTranslateValue(translatedValues[key]?.value || "");
        setSelectedLanguage(translatedValues[key]?.language || '');
        setTranslateContext({ fieldName, valueFieldName });
        setOpenModalTranslate(true);
    };
    const handleTranslateSave = useCallback(
        (translatedValue: string, selectedLanguage: string) => {
            if (translateContext) {
                const { fieldName, valueFieldName } = translateContext;
                const key = `${fieldName}-${valueFieldName}`;
                updateTranslatedValue(key, translatedValue, selectedLanguage);
                const updatedAttributes = form.getFieldValue('productCategoryAttributeDTOS');
                if (updatedAttributes[fieldName]?.productCategoryAttributeValueDTOS[valueFieldName]) {
                    updatedAttributes[fieldName].productCategoryAttributeValueDTOS[valueFieldName].valueEn = translatedValue;
                }
                form.setFieldsValue({
                    productCategoryAttributeDTOS: updatedAttributes,
                });
            }
        },
        [form, translateContext, updateTranslatedValue, translatedValues]
    );
    const handleRemoveValue = (fieldName: number, valueFieldName: number) => {
        const attributes = form.getFieldValue('productCategoryAttributeDTOS');
        const values = attributes[fieldName].productCategoryAttributeValueDTOS;

        values.splice(valueFieldName, 1);

        attributes[fieldName].productCategoryAttributeValueDTOS = values;
        form.setFieldsValue({
            productCategoryAttributeDTOS: attributes
        });

        const currentKey = `${fieldName}-${valueFieldName}`;
        resetTranslatedValues(currentKey);
        for (let i = valueFieldName; i < values.length; i++) {
            const nextKey = `${fieldName}-${i + 1}`;
            const newKey = `${fieldName}-${i}`;

            if (translatedValues[nextKey]) {
                updateTranslatedValue(
                    newKey,
                    translatedValues[nextKey].value,
                    translatedValues[nextKey].language
                );
                resetTranslatedValues(nextKey);
            }
        }
    };
    return (
        <>
            <Row className="my-8">
                <Col span={12}>
                    <strong className="text-xl">Thuộc tính loại sản phẩm</strong>
                </Col>
                <Col className="flex justify-end" span={12}>
                    <Button
                        onClick={addAttribute}
                        icon={<FontAwesomeIcon icon={faPlus} />}
                    >
                        Thêm thuộc tính
                    </Button>
                </Col>
            </Row>
            <Form.List name="productCategoryAttributeDTOS">
                {(fields, { add: addField }) => (
                    <>
                        {fields.map(
                            (
                                field: { key: React.Key; name: number; attributeType?: number },
                                index,
                            ) => (
                                <Row key={field.key} gutter={[40, 0]} className="mb-4">
                                    <Col span={21}>
                                        <div className="border border-solid border-[#DFD3D3] p-4 rounded-lg">
                                            <Row gutter={24}>
                                                <Col span={12}>
                                                    <Form.Item
                                                        {...field}
                                                        label="Loại thuộc tính"
                                                        name={[field.name, 'attributeType']}
                                                        rules={[{ required: true, message: MESSAGE.G06 }]}
                                                    >
                                                        <CSelect
                                                            onKeyDown={(e) => {
                                                                if (e.key !== 'Tab') {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                            allowClear={
                                                                !(
                                                                    checkCategoryType &&
                                                                    isNotDeletableAttribute(
                                                                        form.getFieldValue([
                                                                            'productCategoryAttributeDTOS',
                                                                            field.name,
                                                                            'attributeType',
                                                                        ])
                                                                    )
                                                                )
                                                            }
                                                            disabled={
                                                                (checkCategoryType &&
                                                                    isNotDeletableAttribute(
                                                                        form.getFieldValue([
                                                                            'productCategoryAttributeDTOS',
                                                                            field.name,
                                                                            'attributeType',
                                                                        ])
                                                                    )) ||
                                                                typeModal === ActionType.VIEW
                                                            }
                                                            loading={loadingTypeAttribute}
                                                            placeholder="Chọn loại thuộc tính"
                                                            options={listTypeAttributeFilter}
                                                            onChange={(value) => {
                                                                const updatedAttributes = form.getFieldValue(
                                                                    'productCategoryAttributeDTOS'
                                                                );
                                                                updatedAttributes[index].attributeType = value;
                                                                if (value === TypeAttribute.DONG) {
                                                                    updatedAttributes[
                                                                        index
                                                                    ].productCategoryAttributeValueDTOS = [
                                                                            { value: '', valueEn: '' },
                                                                        ];
                                                                } else {
                                                                    updatedAttributes[
                                                                        index
                                                                    ].productCategoryAttributeValueDTOS = [];
                                                                }
                                                                form.setFieldsValue({
                                                                    productCategoryAttributeDTOS:
                                                                        updatedAttributes,
                                                                });
                                                            }}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item
                                                        {...field}
                                                        label="Tên thuộc tính"
                                                        name={[field.name, 'attributeName']}
                                                        rules={[{ required: true, message: MESSAGE.G06 }]}
                                                    >
                                                        <CInput
                                                            placeholder="Nhập tên thuộc tính"
                                                            maxLength={100}
                                                            onBlur={(e) =>
                                                                handleBlurAttribute(
                                                                    e,
                                                                    field.name,
                                                                    'attributeName'
                                                                )
                                                            }
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                {form.getFieldValue([
                                                    'productCategoryAttributeDTOS',
                                                    field.name,
                                                    'attributeType',
                                                ]) === TypeAttribute.DONG && (
                                                        <Form.List
                                                            name={[
                                                                field.name,
                                                                'productCategoryAttributeValueDTOS',
                                                            ]}
                                                        >
                                                            {(
                                                                valueFields,
                                                                { add: addValue, remove: removeValue }
                                                            ) => (
                                                                <>
                                                                    {valueFields.map((valueField, valueIndex) => (
                                                                        <>
                                                                            <Col span={12} key={valueField.key}>
                                                                                <Form.Item
                                                                                    {...valueField}
                                                                                    label="Giá trị thuộc tính"
                                                                                    name={[valueField.name, 'value']}
                                                                                    className="ml-10"
                                                                                    rules={[
                                                                                        {
                                                                                            required: true,
                                                                                            message: MESSAGE.G06,
                                                                                        },
                                                                                    ]}
                                                                                >
                                                                                    <CInput
                                                                                        onBlur={(e) =>
                                                                                            handleBlurValue(
                                                                                                e,
                                                                                                field.name,
                                                                                                valueField.name
                                                                                            )
                                                                                        }
                                                                                        placeholder="Nhập giá trị thuộc tính"
                                                                                        maxLength={20}
                                                                                        suffix={
                                                                                            includes(actions, ActionsTypeEnum.TRANSLATE) && (
                                                                                                <CButton
                                                                                                    className="text-white h-[30px]"
                                                                                                    onClick={handleTranslate(field.name, valueField.name)}
                                                                                                    disabled={typeModal === ActionType.VIEW}
                                                                                                >
                                                                                                    Dịch
                                                                                                </CButton>
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                </Form.Item>
                                                                            </Col>

                                                                            {typeModal !== ActionType.VIEW && (
                                                                                <Col
                                                                                    className="flex items-center"
                                                                                    span={4}
                                                                                >
                                                                                    {valueFields.length > 1 &&
                                                                                        !form.getFieldValue([
                                                                                            'productCategoryAttributeDTOS',
                                                                                            field.name,
                                                                                            'productCategoryAttributeValueDTOS',
                                                                                            valueField.name,
                                                                                            'associateWithProduct',
                                                                                        ]) && (
                                                                                            <span
                                                                                                className="block mr-6 cursor-pointer text-lg"
                                                                                                onClick={() => handleRemoveValue(field.name, valueField.name)}
                                                                                            >
                                                                                                <FontAwesomeIcon icon={faMinus} />
                                                                                            </span>
                                                                                        )}
                                                                                    <span
                                                                                        className="cursor-pointer text-lg"
                                                                                        onClick={() => addValue({ value: '', valueEn: '' })}
                                                                                    >
                                                                                        <FontAwesomeIcon icon={faPlus} />
                                                                                    </span>
                                                                                </Col>
                                                                            )}
                                                                            {typeModal === ActionType.VIEW && (
                                                                                <Col span={4}></Col>
                                                                            )}
                                                                        </>
                                                                    ))}
                                                                </>
                                                            )}
                                                        </Form.List>
                                                    )}
                                            </Row>
                                        </div>
                                    </Col>
                                    {typeModal !== ActionType.VIEW && (
                                        <Col className="flex items-center" span={3}>
                                            {!form.getFieldValue([
                                                'productCategoryAttributeDTOS',
                                                field.name,
                                                'associateWithProduct',
                                            ]) &&
                                                ((!checkCategoryType &&
                                                    (form.getFieldValue([
                                                        'productCategoryAttributeDTOS',
                                                        field.name,
                                                        'attributeType',
                                                    ]) !== TypeAttribute.GOI_CUOC_CHINH ||
                                                        form.getFieldValue([
                                                            'productCategoryAttributeDTOS',
                                                            field.name,
                                                            'attributeType',
                                                        ]) !== TypeAttribute.LOAI_SIM)) ||
                                                    (checkCategoryType &&
                                                        form.getFieldValue([
                                                            'productCategoryAttributeDTOS',
                                                            field.name,
                                                            'attributeType',
                                                        ]) === TypeAttribute.DONG) ||
                                                    (checkCategoryType &&
                                                        form.getFieldValue([
                                                            'productCategoryAttributeDTOS',
                                                            field.name,
                                                            'attributeType',
                                                        ]) === TypeAttribute.GOI_CUOC_DEM)) && (
                                                    <span
                                                        className="block mr-6 cursor-pointer text-lg"
                                                        onClick={() => {
                                                            removeAttribute(field.name);
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faMinus} />
                                                    </span>
                                                )}
                                            <span
                                                className="block mr-6 cursor-pointer text-lg"
                                                onClick={() => {
                                                    const attributes =
                                                        form.getFieldValue(
                                                            'productCategoryAttributeDTOS'
                                                        ) || [];
                                                    form.setFieldsValue({
                                                        productCategoryAttributeDTOS: [
                                                            ...attributes,
                                                            {
                                                                attributeName: '',
                                                                attributeType: listTypeAttribute.filter(
                                                                    (item: any) =>
                                                                        item.value === TypeAttribute.DONG
                                                                )[0].value,
                                                                productCategoryAttributeValueDTOS: [
                                                                    { value: '', valueEn: '' },
                                                                ],
                                                            },
                                                        ],
                                                    });
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faPlus} />
                                            </span>
                                        </Col>
                                    )}
                                </Row>
                            )
                        )}
                    </>
                )}
            </Form.List>
            <ModalTranslate
                onClose={handleCloseModalTranslate}
                open={openModalTranslate}
                mainInputValue={currentTranslateValue}
                onTranslateSave={handleTranslateSave}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
            />
        </>
    );
};

export default ProductCategoryAttributes;