import CDatePicker from '@react/commons/DatePicker';
import CTable from '@react/commons/Table';
import { DateFormat, MAX_NUMBER } from '@react/constants/app';
import validateForm from '@react/utils/validator';
import { Card, Col, Form, Row } from 'antd';
import {
  disabledFromDate,
  disabledFromTime,
  disabledToDate,
  disabledToTime,
} from '../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Dayjs } from 'dayjs';
import { useEffect } from 'react';
import { TableFormProps } from '../types';
import { CNumberInput } from '@react/commons/index';

const TableForm: React.FC<TableFormProps> = ({ title, name, disabled }) => {
  const form = Form.useFormInstance();
  const data = Form.useWatch(name, form) || [];
  const toDateLast = Form.useWatch([name, data.length - 1, 'toDate'], form);

  useEffect(() => {
    if (data.length === 1) {
      form.setFields([
        { name: [name, 0, 'fromDate'], errors: [] },
        { name: [name, 0, 'toDate'], errors: [] },
      ]);
    }
  }, [data.length]);

  const handleGenFromDate = (date: Dayjs, index: number) => {
    form.setFieldValue([name, index, 'fromDate'], date.add(1, 'm'));
  };

  const handleChangeToDate = (date: Dayjs, index: number) => {
    if (data.length - 1 > index) {
      handleGenFromDate(date, index + 1);
    }
  };

  const handleAdd = (date: Dayjs) => {
    handleGenFromDate(date, data.length);
  };

  const handleRemove = (index: number, callback: () => void) => {
    const toDateBefore = form.getFieldValue([name, index - 1, 'toDate']);
    const priceAfter = form.getFieldValue([name, index + 1, 'price']);

    if (data.length - 1 > index && !priceAfter) {
      form.setFieldValue([name, index + 1, 'price'], '');
    }

    if (data.length - 1 > index && toDateBefore) {
      handleGenFromDate(toDateBefore, index + 1);
      callback();
    } else {
      callback();
    }
  };

  return (
    <Card>
      <div className="font-medium text-base text-primary mb-5">{title}</div>
      <Form.List name={name}>
        {(_, { add, remove }) => (
          <Row gutter={24} align="bottom" justify="space-between">
            <Col flex={1}>
              <CTable
                columns={[
                  {
                    title: 'STT',
                    align: 'center',
                    width: 50,
                    render: (_, __, index) => (
                      <div className="mt-1.5">{index + 1}</div>
                    ),
                  },
                  {
                    title: (
                      <span className="label-required-suffix">
                        {name === 'productPriceDTOS' ? 'Giá hàng hóa' : 'VAT'}
                      </span>
                    ),
                    width: 150,
                    render: (_, __, index) => (
                      <Form.Item
                        name={[index, 'price']}
                        rules={[validateForm.required]}
                        validateTrigger="onBlur"
                        className="mb-0"
                      >
                        <CNumberInput
                          placeholder={
                            name === 'productPriceDTOS'
                              ? 'Nhập giá hàng hóa'
                              : 'Nhập VAT'
                          }
                          isAllowed={({ floatValue }) =>
                            floatValue || floatValue === 0
                              ? name === 'productPriceDTOS'
                                ? floatValue <= MAX_NUMBER
                                : floatValue > 0 && floatValue <= 100
                              : true
                          }
                          addonAfter={name === 'productPriceDTOS' ? 'VND' : '%'}
                          disabled={disabled}
                        />
                      </Form.Item>
                    ),
                  },
                  {
                    title: 'Thời gian bắt đầu',
                    width: 300,
                    render: (_, __, index) => {
                      const toDate = form.getFieldValue([
                        name,
                        index,
                        'toDate',
                      ]);
                      return (
                        <Form.Item
                          name={[index, 'fromDate']}
                          rules={
                            data.length > 1 || toDate
                              ? [validateForm.required]
                              : []
                          }
                          className="mb-0"
                        >
                          <CDatePicker
                            showTime={{ format: 'HH:mm' }}
                            format={DateFormat.DATE_TIME_NO_SECOND}
                            disabled={disabled || index > 0}
                            disabledDate={(e) =>
                              e && disabledFromDate(e, toDate)
                            }
                            disabledTime={(e) =>
                              e && disabledFromTime(e, toDate)
                            }
                          />
                        </Form.Item>
                      );
                    },
                  },
                  {
                    title: 'Thời gian kết thúc',
                    width: 300,
                    render: (_, __, index) => {
                      const fromDate = form.getFieldValue([
                        name,
                        index,
                        'fromDate',
                      ]);
                      const toDateAfter = form.getFieldValue([
                        name,
                        index + 1,
                        'toDate',
                      ]);
                      return (
                        <Form.Item
                          name={[index, 'toDate']}
                          rules={
                            data.length > 1 || fromDate
                              ? [validateForm.required]
                              : []
                          }
                          className="mb-0"
                        >
                          <CDatePicker
                            showTime={{ format: 'HH:mm' }}
                            format={DateFormat.DATE_TIME_NO_SECOND}
                            disabled={disabled}
                            disabledDate={(e) =>
                              e && disabledToDate(e, fromDate, toDateAfter)
                            }
                            disabledTime={(e) =>
                              e && disabledToTime(e, fromDate, toDateAfter)
                            }
                            onChange={(e) => handleChangeToDate(e, index)}
                          />
                        </Form.Item>
                      );
                    },
                  },
                  {
                    title: '',
                    align: 'center',
                    width: 40,
                    hidden: disabled || data.length < 2,
                    render: (_, __, index) => (
                      <FontAwesomeIcon
                        icon={faMinus}
                        className="cursor-pointer mt-3"
                        onClick={() => handleRemove(index, () => remove(index))}
                      />
                    ),
                  },
                ]}
                dataSource={data}
                pagination={false}
                scroll={undefined}
                rowClassName="align-top"
              />
            </Col>
            <Col span={disabled ? 0 : 1} className="text-center">
              <FontAwesomeIcon
                icon={faPlus}
                className={`${
                  toDateLast
                    ? 'cursor-pointer'
                    : 'cursor-not-allowed opacity-25'
                } mb-3.5`}
                onClick={() => toDateLast && handleAdd(toDateLast)}
              />
            </Col>
          </Row>
        )}
      </Form.List>
    </Card>
  );
};

export default TableForm;