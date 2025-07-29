import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import CTable from '@react/commons/Table';
import Show from '@react/commons/Template/Show';
import { ActionType } from '@react/constants/app';
import validateForm from '@react/utils/validator';
import { Card, Col, Form, Row } from 'antd';
import { useParameterQuery } from 'apps/Internal/src/hooks/useParameterQuery';
import { debounce, delay, isEmpty } from 'lodash';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useGetDetailCategoryProduct } from '../../CategoryProduct/queryHook';
import { useDetailProductCatalogQuery } from '../hooks/useDetailProductCatalogQuery';
import useGetCoverageRanges from '../hooks/useGetCoverageRanges';
import { useGetPckMain } from '../hooks/useGetPckMain';
import { useGetPckSub } from '../hooks/useGetPckSub';
import { useProductCategoryQuery } from '../hooks/useProductCategoryQuery';
import { useProductCatalogStore } from '../store';
import '../stype.css';
import { AttributeProps, AttributeType, CoverageRangeStatus } from '../types';
import { mapAttributeValueByType } from '../utils';
const Attribute: React.FC<AttributeProps> = ({ disabled, actionType }) => {
  const {
    unitHetTocDoCaoGiamXuong,
    unitDungLuongTocDoCao,
    setUnitHetTocDoCaoGiamXuong,
    setUnitDungLuongTocDoCao,
  } = useProductCatalogStore();
  const { id } = useParams();
  const form = Form.useFormInstance();
  const attributeValues = Form.useWatch('attributeValueList', form) || [];
  const productCategoryId = Form.useWatch('productCategoryId', form) || '';
  const [isResetProductCategory, setIsResetProductCategory] = useState(false);
  const { data: productDetailData } = useDetailProductCatalogQuery(id ?? '');
  const { isLoading: isLoadingProductCategory, data: productCategoryData } =
    useProductCategoryQuery();
  const {
    isLoading: isLoadingProductCategoryDetail,
    data: productCategoryDetailData,
  } = useGetDetailCategoryProduct(productCategoryId);
  const [checkCallCoverageRanges, setCheckCallCoverageRanges] = useState(false);
  const [searchCoverageRanges, setSearchCoverageRanges] = useState('');
  const isClearingRef = useRef(false);
  const { 
    data: listCoverageRangesData,
    fetchNextPage,
    hasNextPage,
    isPending:loadingCoverageRanges,
  } = useGetCoverageRanges(
    actionType === ActionType.ADD,
    checkCallCoverageRanges,
    searchCoverageRanges
  );
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.target as HTMLDivElement;
      const { scrollTop, scrollHeight, clientHeight } = target;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        if (hasNextPage && !loadingCoverageRanges) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, hasNextPage, loadingCoverageRanges]
  );
  const handleSearchCoverageRanges = useCallback(
    debounce((value: string) => {
      if (!isClearingRef.current) {
        setSearchCoverageRanges(value || '');
      } else {
        isClearingRef.current = false;
      }
    }, 300),
    []
  );
  const listCoverageRanges = useMemo(() => {
    if (!listCoverageRangesData?.pages) return { content: [] };
    const uniqueItemsMap = new Map();
    
    listCoverageRangesData.pages.forEach(page => {
      if (page?.content) {
        page.content.forEach((item: any) => {
          if (item && item.id && !uniqueItemsMap.has(item.id)) {
            uniqueItemsMap.set(item.id, item);
          }
        });
      }
    });
    
    const allContent = Array.from(uniqueItemsMap.values());
    
    return { content: allContent };
  }, [listCoverageRangesData]);
  const { data: packageDataMain } = useGetPckMain();
  const { data: packageDataSub } = useGetPckSub();
  const { data: simData } = useParameterQuery({
    'table-name': 'COMBINE_KIT',
    'column-name': 'SIM_TYPE',
  });
  const foundCoverageData = useMemo(() => {
    if (productDetailData?.attributeValueList && listCoverageRanges?.content) {
      const coverageRange = productDetailData.attributeValueList.find(
        (item) => item.attributeType === AttributeType.COVERAGE_RANGE
      );
      
      if (coverageRange) {
        const foundData = listCoverageRanges.content?.find(
          (item: any) => String(item.id) === String(coverageRange?.attributeValue)
        );
        return foundData ? [foundData] : [];
      }
    }
    return [];
  }, [productDetailData?.attributeValueList, listCoverageRanges?.content]);

  useEffect(() => {
    if (productCategoryDetailData) {
      const hasCoverageRange =
        productCategoryDetailData.productCategoryAttributeDTOS?.some(
          (attr) => attr.attributeType === AttributeType.COVERAGE_RANGE
        ) ?? false;
        setCheckCallCoverageRanges(hasCoverageRange);
      const productAttributeIds =
        productDetailData?.attributeValueList?.map(
          ({ productCategoryAttributeId }) => productCategoryAttributeId
        ) || [];
      const attributes = productCategoryDetailData.productCategoryAttributeDTOS
        ?.filter((item: any) =>
          disabled || !isResetProductCategory
            ? productAttributeIds.includes(item.id)
            : item
        )
        ?.map((item: any) => {
          const attributeOld = productDetailData?.attributeValueList?.find(
            (item2) => item2.productCategoryAttributeId === item.id
          );
          if (attributeOld && item.attributeType === AttributeType.DYNAMIC) {
            const attributeValueNew =
              item.productCategoryAttributeValueDTOS.find(
                (pcavDTOS: any) =>
                  pcavDTOS.id === attributeOld.productCategoryAttributeValueId
              )?.value;
            if (attributeValueNew) {
              attributeOld.attributeValue = attributeValueNew;
            }
          }
          if (attributeOld && item.attributeType === AttributeType.SKUID) {
            const attributeValueNew =
              item.productCategoryAttributeValueDTOS.find(
                (pcavDTOS: any) =>
                  pcavDTOS.id === attributeOld.productCategoryAttributeValueId
              )?.value;
            if (attributeValueNew) {
              attributeOld.attributeValue = attributeValueNew;
            }
          }
          const attributeValue = mapAttributeValueByType(
            item.attributeType,
            item.productCategoryAttributeValueDTOS,
            packageDataMain,
            packageDataSub,
            simData || [],
            (() => {
              const activeCoverageRanges = listCoverageRanges?.content?.filter((item: any) => 
                item.status === CoverageRangeStatus.ACTIVATE
              ) || [];
              
              const existingIds = activeCoverageRanges.map((item: any) => item.id);
              const foundIds = foundCoverageData.map((data: any) => data?.id).filter(Boolean);
              
              const existingFoundData = foundCoverageData.filter((data: any) => 
                data && existingIds.includes(data.id)
              );
              
              const newFoundData = foundCoverageData.filter((data: any) => 
                data && !existingIds.includes(data.id)
              );
              
              const remainingCoverageRanges = activeCoverageRanges.filter((item: any) => 
                !foundIds.includes(item.id)
              );
              
              if (actionType === ActionType.ADD) {
                return listCoverageRanges?.content?.map((item: any) => ({
                  label: item.rangeName,
                  value: item.id
                })) || [];
              } else {
                const uniqueRanges = new Set<any>();
                const result: Array<{ label: string; value: any }> = [];
                existingFoundData.forEach((data: any) => {
                  if (!uniqueRanges.has(data.id)) {
                    uniqueRanges.add(data.id);
                    result.push({
                      label: data.rangeName,
                      value: data.id
                    });
                  }
                });
                newFoundData.forEach((data: any) => {
                  if (!uniqueRanges.has(data.id)) {
                    uniqueRanges.add(data.id);
                    result.push({
                      label: data.rangeName,
                      value: data.id
                    });
                  }
                });
                remainingCoverageRanges.forEach((item: any) => {
                  if (!uniqueRanges.has(item.id)) {
                    uniqueRanges.add(item.id);
                    result.push({
                      label: item.rangeName,
                      value: item.id
                    });
                  }
                });
                
                return result;
              }
            })()
          );
          const renderAtributeValueObj = () => {
            if (
              item.attributeType === AttributeType.SKUID ||
              item.attributeType === AttributeType.LOAI_GOI ||
              item.attributeType === AttributeType.NHA_CUNG_CAP ||
              item.attributeType === AttributeType.SO_NGAY_SU_DUNG
            ) {
              return attributeOld?.attributeValue;
            } else if (
              item.attributeType === AttributeType.HET_TOC_DO_CAO_GIAM_XUONG
            ) {
              const dataSlice = attributeOld?.attributeValue
                ? attributeOld?.attributeValue.split(' ')
                : '';
              const data = dataSlice[0];
              const dataUnit = dataSlice[1];
              setUnitHetTocDoCaoGiamXuong(dataUnit);
              return data;
            } else if (
              item.attributeType === AttributeType.DUNG_LUONG_TOC_DO_CAO
            ) {
              const dataSlice = attributeOld?.attributeValue
                ? attributeOld?.attributeValue.split(' ')
                : '';
              const data = dataSlice[0];
              const dataUnit = dataSlice[1];
              setUnitDungLuongTocDoCao(dataUnit);
              return data;
            }
            else if (item.attributeType === AttributeType.COVERAGE_RANGE && isClearingRef.current) {
              return null;
            }
            else {
              return attributeOld?.attributeValue
                ? JSON.stringify({
                    id: attributeOld?.productCategoryAttributeValueId,
                    value: attributeOld?.attributeValue,
                  })
                : null;
            }
          };
          return {
            id: attributeOld ? attributeOld.id : null,
            attributeId: item.id,
            attributeName: item.attributeName,
            attributeType: item.attributeType,
            attributeValueObj: renderAtributeValueObj(),
            attributeValue,
          };
        });
      delay(() => form.setFieldValue('attributeValueList', attributes), 0);
    }
  }, [
    productDetailData,
    productCategoryDetailData,
    packageDataMain,
    simData,
    disabled,
    isResetProductCategory,
    checkCallCoverageRanges,
    listCoverageRangesData,
    packageDataSub,
    foundCoverageData,
  ]);
  useEffect(() => {
    if (actionType === ActionType.ADD) {
      setUnitDungLuongTocDoCao('GB');
      setUnitHetTocDoCaoGiamXuong('Kbps');
    }
  }, [actionType]);
  return (
    <Card>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            label="Loại sản phẩm"
            name="productCategoryId"
            rules={[validateForm.required]}
          >
            <CSelect
              placeholder="Chọn loại sản phẩm"
              showSearch
              disabled={disabled}
              loading={isLoadingProductCategory}
              options={productCategoryData?.map((item) => ({
                label: item.categoryName,
                value: item.id,
              }))}
              onChange={() => setIsResetProductCategory(true)}
            />
          </Form.Item>
        </Col>
      </Row>
      {!isEmpty(productCategoryDetailData?.productCategoryAttributeDTOS) && (
        <Form.List name="attributeValueList">
          {() => (
            <CTable
              className="dynamic-table"
              columns={[
                {
                  title: 'STT',
                  align: 'center',
                  width: 50,
                  render: (_, __, index) => index + 1,
                },
                {
                  title: 'Tên thuộc tính',
                  width: 300,
                  render: (_, __, index) => (
                    <Form.Item
                      name={[index, 'attributeName']}
                      rules={[validateForm.required]}
                      className="mb-0"
                    >
                      <CInput disabled />
                    </Form.Item>
                  ),
                },
                {
                  title: 'Giá trị thuộc tính',
                  width: 300,
                  render: (_, record, index) => {
                    return (
                      <Show>
                        <Show.When
                          isTrue={record.attributeType === AttributeType.SKUID}
                        >
                          <Form.Item
                            name={[index, 'attributeValueObj']}
                            rules={[validateForm.required]}
                          >
                            <CInput
                              disabled={disabled}
                              placeholder="Nhập giá trị thuộc tính"
                              maxLength={50}
                              preventVietnamese
                              uppercase
                              preventSpace
                              preventSpecialExceptHyphenAndUnderscore
                            />
                          </Form.Item>
                        </Show.When>

                        <Show.When
                          isTrue={
                            record.attributeType ===
                            AttributeType.SO_NGAY_SU_DUNG
                          }
                        >
                          <Form.Item
                            name={[index, 'attributeValueObj']}
                            rules={[validateForm.required]}
                            className="mb-0"
                          >
                            <CInput
                              disabled={disabled}
                              placeholder="Nhập giá trị thuộc tính"
                              maxLength={2}
                              onlyNumber
                              suffix="Ngày"
                              preventNumber0
                              allowClear={false}
                            />
                          </Form.Item>
                        </Show.When>

                        <Show.When
                          isTrue={
                            record.attributeType === AttributeType.NHA_CUNG_CAP
                          }
                        >
                          <Form.Item
                            name={[index, 'attributeValueObj']}
                            className="mb-0"
                          >
                            <CInput
                              disabled={disabled}
                              placeholder="Nhập giá trị thuộc tính"
                              maxLength={100}
                            />
                          </Form.Item>
                        </Show.When>
                        <Show.When
                          isTrue={
                            record.attributeType ===
                            AttributeType.HET_TOC_DO_CAO_GIAM_XUONG
                          }
                        >
                          <Form.Item
                            name={[index, 'attributeValueObj']}
                            className="mb-0"
                          >
                            <CInput
                              disabled={disabled}
                              // preventNumber0
                              allowClear={false}
                              placeholder="Nhập giá trị"
                              maxLength={10}
                              numberAndExceptUnderscore
                              addonAfter={
                                <CSelect
                                  defaultValue={'Kbps'}
                                  onChange={(e) => {
                                    setUnitHetTocDoCaoGiamXuong(e);
                                  }}
                                  disabled={disabled}
                                  value={unitHetTocDoCaoGiamXuong}
                                  options={[
                                    { label: 'Mbps', value: 'Mbps' },
                                    { label: 'Kbps', value: 'Kbps' },
                                  ]}
                                  style={{ width: 130 }}
                                  placeholder="Chọn đơn vị"
                                  allowClear={false}
                                />
                              }
                            />
                          </Form.Item>
                        </Show.When>
                        <Show.When
                          isTrue={
                            record.attributeType ===
                            AttributeType.DUNG_LUONG_TOC_DO_CAO
                          }
                        >
                          <Form.Item
                            name={[index, 'attributeValueObj']}
                            className="mb-0"
                          >
                            <CInput
                              disabled={disabled}
                              onlyNumber
                              preventNumber0
                              allowClear={false}
                              placeholder="Nhập giá trị thuộc tính"
                              maxLength={10}
                              addonAfter={
                                <CSelect
                                  disabled={disabled}
                                  defaultValue={'GB'}
                                  onChange={(e) => {
                                    setUnitDungLuongTocDoCao(e);
                                  }}
                                  value={unitDungLuongTocDoCao}
                                  options={[
                                    { label: 'MB', value: 'MB' },
                                    { label: 'GB', value: 'GB' },
                                    { label: 'MB/ngày', value: 'MB/ngày' },
                                    { label: 'GB/ngày', value: 'GB/ngày' },
                                  ]}
                                  style={{ width: 130 }}
                                  placeholder="Chọn đơn vị"
                                  allowClear={false}
                                />
                              }
                            />
                          </Form.Item>
                        </Show.When>
                        <Show.When
                          isTrue={
                            record.attributeType === AttributeType.LOAI_GOI
                          }
                        >
                          <Form.Item
                            name={[index, 'attributeValueObj']}
                            className="mb-0"
                          >
                            <CInput
                              disabled={disabled}
                              placeholder="Nhập giá trị thuộc tính"
                              maxLength={100}
                            />
                          </Form.Item>
                        </Show.When>
                        <Show.When isTrue={
                          record.attributeType ===
                          AttributeType.COVERAGE_RANGE
                        }>
                           <Form.Item
                            name={[index, 'attributeValueObj']}
                            className="mb-0"
                            rules={[validateForm.required]}
                          >
                            <CSelect
                              onSearch={handleSearchCoverageRanges}
                              onPopupScroll={handleScroll}
                              filterOption={false}
                              placeholder="Chọn giá trị thuộc tính"
                              showSearch
                              onClear={() => {
                                form.setFieldValue([
                                  'attributeValueList',
                                  index,
                                  'attributeValueObj',
                                ], null);
                                isClearingRef.current = true;
                                setSearchCoverageRanges('');
                                setTimeout(() => {
                                  isClearingRef.current = false;
                                }, 100);
                              }}
                              disabled={disabled}
                              loading={isLoadingProductCategoryDetail || loadingCoverageRanges }
                              options={form
                                .getFieldValue([
                                  'attributeValueList',
                                  index,
                                  'attributeValue',
                                ])
                                ?.map((item: any) => ({
                                  label: item.label,
                                  value: JSON.stringify({
                                    id: item.id,
                                    value: item.value,
                                  }),
                                }))}
                            />
                          </Form.Item>
                        </Show.When>
                        <Show.Else>
                          <Form.Item
                            name={[index, 'attributeValueObj']}
                            className="mb-0"
                          >
                            <CSelect
                              placeholder="Chọn giá trị thuộc tính"
                              showSearch
                              disabled={disabled}
                              loading={isLoadingProductCategoryDetail}
                              options={form
                                .getFieldValue([
                                  'attributeValueList',
                                  index,
                                  'attributeValue',
                                ])
                                ?.map((item: any) => ({
                                  label: item.label,
                                  value: JSON.stringify({
                                    id: item.id,
                                    value: item.value,
                                  }),
                                }))}
                            />
                          </Form.Item>
                        </Show.Else>
                      </Show>
                    );
                  },
                },
                {
                  hidden: true,
                  render: (_, __, index) => (
                    <Form.Item name={[index, 'attributeId']} />
                  ),
                },
                {
                  hidden: true,
                  render: (_, __, index) => (
                    <Form.Item name={[index, 'attributeValue']} />
                  ),
                },
              ]}
              dataSource={attributeValues}
              pagination={false}
              scroll={undefined}
            />
          )}
        </Form.List>
      )}
    </Card>
  );
};

export default Attribute;
