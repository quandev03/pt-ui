import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import { Card, Form, Col, Row } from 'antd';
import { ActionType, DateFormat } from '@react/constants/app';
import CDatePicker from '@react/commons/DatePicker';
import CSelect from '@react/commons/Select';
import Show from '@react/commons/Template/Show';
import CTable from '@react/commons/Table';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import dayjs, { Dayjs } from 'dayjs';
import { debounce, isArray, range } from 'lodash';
import { CInput, CNumberInput } from '@react/commons/index';
import { useWatch } from 'antd/es/form/Form';
import { useGetSaleChannels } from '../hook/useGetSaleChannels';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { AnyElement, ParamsOption } from '@react/commons/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import {
  PromCodeMethods,
  PromotionProgramService,
  PromotionProductType,
  PromotionProgramPromMethod,
  IDetailPromotionProgram,
  PromotionProgramPromotionProduct,
  PromotionProductTypeString,
} from '../types';
import { useColumnPromotionalPriceConfiguration } from '../hook/useColumnPromotionalPriceConfiguration';
import useGetListPackage from '../hook/useGetListPackage';

interface FormCodeConfigurationProps {
  typeModal: ActionType;
  dataTable: AnyElement[];
  setDataTable: (data: AnyElement[]) => void;
}
export const FormCodeConfiguration = ({
  typeModal,
  dataTable,
  setDataTable,
}: FormCodeConfigurationProps) => {
  const form = useFormInstance();
  const fromDate: Dayjs = useWatch('startDate', form);
  const toDate: Dayjs = useWatch('endDate', form);
  const checkChannel = useWatch('channel', form);
  const checkPromCodeMethod = useWatch('promCodeMethod', form);
  const valueProgramService = useWatch('programService', form);
  const valuePromotionType = useWatch('promotionType', form);
  const checkPromValue = useWatch('promValue', form);
  const checkPromMethod = useWatch('promMethod', form);
  const promotionPackageValue = useWatch('promotionPackage', form);
  const {
    PROMOTION_PROGRAM_PROGRAM_SERVICE = [],
    PROMOTION_PROGRAM_PROM_METHOD = [],
    PROMOTION_PROGRAM_USER_LIMIT = [],
    PROMOTION_PROGRAM_PROMOTION_TYPE = [],
    PROMOTION_PROGRAM_PROMOTION_PRODUCT = [],
    PROMOTION_PROGRAM_SIM_TYPE = [],
  } = useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  // list gói cước
  const [paramsPackage, setParamsPackage] = useState<AnyElement>({
    page: 0,
    size: 20,
  });
  const {
    data: listPackage = [],
    fetchNextPage: listPackageFetchNextPage,
    hasNextPage: listPackageHasNextPage,
  } = useGetListPackage(paramsPackage);
  const handleScrollDatasets = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.target as HTMLDivElement;
      if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
        if (listPackageHasNextPage) {
          listPackageFetchNextPage();
        }
      }
    },
    [listPackageFetchNextPage, listPackageHasNextPage]
  );
  const handleSearch = debounce((value: string) => {
    setParamsPackage({
      ...paramsPackage,
      searchValue: value,
      page: 0,
    });
  }, 500);
  // list gói cước
  const { data: dataSaleChannels, isPending: loadingSaleChannels } =
    useGetSaleChannels();
  const listSaleChannels = useMemo(() => {
    if (!dataSaleChannels) return [];
    return dataSaleChannels;
  }, [dataSaleChannels]);
  const columns = useColumnPromotionalPriceConfiguration(form, typeModal);
  const disabledStartDate = (
    startValue: string | number | Date | dayjs.Dayjs | null | undefined
  ) => {
    const endValue = form.getFieldValue('endDate');
    return endValue && dayjs(startValue).isAfter(dayjs(endValue));
  };

  const disabledEndDate = (
    endValue: string | number | Date | dayjs.Dayjs | null | undefined
  ) => {
    if (!fromDate) return false;
    const hour = fromDate.get('hour');
    const minute = fromDate.get('minute');
    let isBeforeValue = fromDate;
    if (hour || minute) {
      isBeforeValue = isBeforeValue.add(-1, 'day');
    }
    return (
      dayjs(isBeforeValue.add(1, 'hour')).isBefore(
        isBeforeValue.add(1, 'hour')
      ) || dayjs(endValue).isBefore(isBeforeValue)
    );
  };

  const disabledFromTime = (current: Dayjs, toDate: Dayjs) => {
    if (toDate && current.isSame(toDate, 'D')) {
      return {
        disabledHours: () =>
          range(0, 24).splice(toDate.get('h'), 24 - toDate.get('h')),
        disabledMinutes: () =>
          current.isSame(toDate.add(-1, 'h'), 'h')
            ? range(0, 60).splice(toDate.get('m') + 1, 60 - toDate.get('m'))
            : [],
      };
    }
    return {};
  };

  const disabledToTime = (current: Dayjs, fromDate: Dayjs | null) => {
    if (fromDate && current.isSame(fromDate, 'D')) {
      return {
        disabledHours: () => range(0, 24).splice(0, fromDate.get('h')),
        disabledMinutes: () =>
          current.isSame(fromDate, 'h')
            ? range(0, 60).splice(0, fromDate.get('m'))
            : [],
      };
    }
    return {};
  };
  useEffect(() => {
    if (typeModal === ActionType.ADD && valueProgramService) {
      let newData: AnyElement[] = [];
      if (valueProgramService === PromotionProgramService.GIA_HAN_GOI) {
        newData = [
          {
            promotionProduct:
              PROMOTION_PROGRAM_PROMOTION_PRODUCT.find(
                (item) =>
                  item.value === PromotionProgramPromotionProduct.GOI_CUOC
              )?.label || '',
            promotionType: PromotionProductType.PERCENT,
            promotionValuePromotionProgramLine: null,
          },
        ];
      } else if (
        valueProgramService === PromotionProgramService.BAN_BO_HOA_MANG
      ) {
        newData = PROMOTION_PROGRAM_PROMOTION_PRODUCT.map((item) => ({
          promotionProduct: item.label,
          promotionType: PromotionProductType.PERCENT,
          promotionValuePromotionProgramLine: null,
        }));
      }
      form.setFieldsValue({
        promotionProgramLines: newData,
      });
      setDataTable(newData);
    }
  }, [
    valueProgramService,
    typeModal,
    PROMOTION_PROGRAM_PROMOTION_PRODUCT,
    form,
    setDataTable,
  ]);
  const handlePromotionPackageChange = useCallback(
    (selectedValues: string[]) => {
      if (selectedValues.includes('ALL')) {
        form.setFieldsValue({
          promotionPackage: ['ALL'],
        });
      } else {
        form.setFieldsValue({
          promotionPackage: selectedValues,
        });
      }
    },
    [form]
  );

  const isAllSelected = useMemo(() => {
    return promotionPackageValue && promotionPackageValue.includes('ALL');
  }, [promotionPackageValue]);

  const promotionPackageOptions = useMemo(() => {
    const allOption = {
      label: 'Tất cả',
      value: 'ALL',
    };

    const otherOptions = listPackage.map((option) => ({
      ...option,
      disabled: isAllSelected && option.value !== 'ALL',
    }));

    return [allOption, ...otherOptions];
  }, [listPackage, isAllSelected]);

  return (
    <>
      <strong className="text-[#2C3D94] mt-6 mb-2 block">Cấu hình mã</strong>
      <Card>
        <Row gutter={24}>
          <Col span={12} xl={12}>
            <Form.Item
              label="Ngày bắt đầu"
              name="startDate"
              rules={[validateForm.required]}
            >
              <CDatePicker
                disabledDate={disabledStartDate}
                disabledTime={(e) => e && disabledFromTime(e, toDate)}
                format={DateFormat.DATE_TIME_NO_SECOND}
                placeholder="Chọn ngày bắt đầu"
                showTime={{ format: 'HH:mm' }}
              />
            </Form.Item>
          </Col>
          <Col span={12} xl={12}>
            <Form.Item
              label="Ngày kết thúc"
              name="endDate"
              rules={[validateForm.required]}
            >
              <CDatePicker
                disabledDate={disabledEndDate}
                disabledTime={(e) =>
                  e &&
                  disabledToTime(e, fromDate ? fromDate.add(1, 'hour') : null)
                }
                format={DateFormat.DATE_TIME_NO_SECOND}
                placeholder="Chọn ngày kết thúc"
                showTime={{ format: 'HH:mm' }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              rules={[validateForm.required]}
              label="Áp dụng cho dịch vụ"
              name="programService"
            >
              <CSelect
                onKeyDown={(e) => {
                  if (e.key !== 'Tab') {
                    e.preventDefault();
                  }
                }}
                disabled={typeModal !== ActionType.ADD}
                options={PROMOTION_PROGRAM_PROGRAM_SERVICE}
                allowClear={false}
                placeholder="Chọn dịch vụ"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              rules={[validateForm.required]}
              label="Áp dụng cho kênh"
              name="channel"
            >
              <CSelect
                onKeyDown={(e) => {
                  if (e.key !== 'Tab') {
                    e.preventDefault();
                  }
                }}
                mode="multiple"
                loading={loadingSaleChannels}
                disabled={typeModal !== ActionType.ADD}
                options={listSaleChannels}
                allowClear={false}
                placeholder="Chọn kênh"
              />
            </Form.Item>
          </Col>
          <Show.When
            isTrue={
              valueProgramService === PromotionProgramService.GIA_HAN_GOI ||
              valueProgramService === PromotionProgramService.BAN_BO_HOA_MANG
            }
          >
            <Col span={12}>
              <Form.Item
                rules={[validateForm.required]}
                label="Khuyến mại theo"
                name="promotionType"
              >
                <CSelect
                  disabled={typeModal !== ActionType.ADD}
                  options={PROMOTION_PROGRAM_PROMOTION_TYPE}
                  allowClear={false}
                  placeholder="Chọn khuyến mại theo"
                />
              </Form.Item>
            </Col>
          </Show.When>
          <Show.When
            isTrue={
              valuePromotionType &&
              valuePromotionType === PromotionProgramPromMethod.SAN_PHAM
            }
          >
            <Col span={12}>
              <Form.Item
                rules={[validateForm.required]}
                name="promotionPackage"
                label="Gói cước"
              >
                <CSelect
                  mode="multiple"
                  onPopupScroll={handleScrollDatasets}
                  placeholder="Chọn gói cước"
                  options={promotionPackageOptions}
                  onSearch={handleSearch}
                  onChange={handlePromotionPackageChange}
                />
              </Form.Item>
            </Col>
          </Show.When>
          <Show.When
            isTrue={
              valueProgramService === PromotionProgramService.BAN_BO_HOA_MANG &&
              valuePromotionType &&
              valuePromotionType === PromotionProgramPromMethod.SAN_PHAM &&
              valueProgramService
            }
          >
            <Col span={12}>
              <Form.Item
                rules={[validateForm.required]}
                name="simType"
                label="Loại SIM"
              >
                <CSelect
                  placeholder="Chọn loại SIM"
                  options={PROMOTION_PROGRAM_SIM_TYPE}
                />
              </Form.Item>
            </Col>
          </Show.When>
          <Show.When
            isTrue={
              valueProgramService &&
              (valueProgramService ===
                PromotionProgramService.BAN_SIM_OUTBOUND ||
                valueProgramService === PromotionProgramService.BAN_GOI_MOI)
            }
          >
            <Col span={12}>
              <Form.Item
                rules={[{ required: true, message: MESSAGE.G06 }]}
                label="Loại khuyến mại"
                name="promMethod"
              >
                <CSelect
                  disabled={typeModal !== ActionType.ADD}
                  onChange={() => {
                    form.setFieldsValue({
                      promValue: null,
                    });
                  }}
                  onKeyDown={(e) => {
                    if (e.key !== 'Tab') {
                      e.preventDefault();
                    }
                  }}
                  options={PROMOTION_PROGRAM_PROM_METHOD}
                  allowClear={false}
                  placeholder="Chọn loại khuyến mại"
                />
              </Form.Item>
            </Col>
          </Show.When>

          {/* Giá trị KM*/}
          <Show.When
            isTrue={
              checkPromMethod === PromotionProductTypeString.PERCENT &&
              (valueProgramService ===
                PromotionProgramService.BAN_SIM_OUTBOUND ||
                valueProgramService === PromotionProgramService.BAN_GOI_MOI)
            }
          >
            <Col span={12}>
              <Form.Item
                rules={[
                  validateForm.required,
                  validateForm.minNumber(
                    1,
                    'Giá trị khuyến mại phải lớn hơn 0'
                  ),
                ]}
                label="Giá trị khuyến mại"
                name="promValue"
              >
                <CInput
                  disabled={typeModal === ActionType.VIEW}
                  allowClear={false}
                  onKeyDown={(e) => {
                    const key = e.key;
                    const allowedKeys = [
                      'Backspace',
                      'ArrowLeft',
                      'ArrowRight',
                      'Delete',
                      'Tab',
                    ];
                    const currentValue = checkPromValue;
                    if (!/^\d$/.test(key) && !allowedKeys.includes(key)) {
                      e.preventDefault();
                      return;
                    }
                    const newValue =
                      key === 'Backspace'
                        ? currentValue.slice(0, -1)
                        : currentValue + key;

                    if (Number(newValue) > 100) {
                      e.preventDefault();
                    }
                  }}
                  addonAfter={
                    <span
                      style={{ cursor: 'pointer' }}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    >
                      %
                    </span>
                  }
                  maxLength={3}
                  placeholder="Nhập giá trị khuyến mại"
                />
              </Form.Item>
            </Col>
          </Show.When>
          <Show.When
            isTrue={
              checkPromMethod &&
              valueProgramService &&
              checkPromMethod === PromotionProductTypeString.PRICE &&
              (valueProgramService === PromotionProgramService.BAN_GOI_MOI ||
                valueProgramService ===
                  PromotionProgramService.BAN_SIM_OUTBOUND)
            }
          >
            <Col span={12}>
              <Form.Item
                label="Giá trị khuyến mại"
                name="promValue"
                required
                rules={[
                  validateForm.required,
                  validateForm.minNumber(
                    1,
                    'Giá trị khuyến mại phải lớn hơn 0'
                  ),
                ]}
              >
                <CNumberInput
                  disabled={typeModal === ActionType.VIEW}
                  maxLength={11}
                  placeholder="Nhập giá trị khuyến mại"
                  addonAfter="VND"
                />
              </Form.Item>
            </Col>
          </Show.When>
          <Show.When
            isTrue={
              (valuePromotionType &&
                valuePromotionType !== PromotionProgramPromMethod.SAN_PHAM) ||
              valueProgramService ===
                PromotionProgramService.BAN_SIM_OUTBOUND ||
              valueProgramService === PromotionProgramService.BAN_GOI_MOI
            }
          >
            <Col span={12}>
              <Form.Item
                label="Giá trị đơn hàng tối thiểu"
                name="minPrice"
                required
                rules={[
                  {
                    validator(_, value) {
                      if (!value || value.length === 0) {
                        return Promise.reject('Không được để trống trường này');
                      } else {
                        return Promise.resolve();
                      }
                    },
                  },
                ]}
              >
                <CNumberInput
                  maxLength={11}
                  disabled={typeModal === ActionType.VIEW}
                  placeholder="Nhập giá trị đơn hàng tối thiểu"
                  addonAfter="VND"
                />
              </Form.Item>
            </Col>
          </Show.When>
          <Show.When
            isTrue={
              checkChannel &&
              isArray(checkChannel) &&
              checkChannel.includes('APP') &&
              checkPromCodeMethod === PromCodeMethods.ONE_CODE
            }
          >
            <Col span={12}>
              <Form.Item
                rules={[validateForm.required]}
                label="Số lần sử dụng cho mỗi KH"
                name="userLimit"
              >
                <CSelect
                  disabled={typeModal !== ActionType.ADD}
                  options={PROMOTION_PROGRAM_USER_LIMIT}
                  allowClear={false}
                  placeholder="Chọn số lần sử dụng"
                />
              </Form.Item>
            </Col>
          </Show.When>
          <Show.When
            isTrue={
              valueProgramService &&
              valueProgramService !==
                PromotionProgramService.BAN_SIM_OUTBOUND &&
              valueProgramService !== PromotionProgramService.BAN_GOI_MOI
            }
          >
            <Col className="mt-4" span={24}>
              <CTable
                columns={columns}
                dataSource={dataTable ?? []}
                pagination={false}
              />
            </Col>
          </Show.When>
        </Row>
      </Card>
    </>
  );
};
