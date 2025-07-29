import { DatePicker, Form } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker/generatePicker/interface';
import React, { FC, FocusEvent, useEffect } from 'react';
import { DateFormat } from '../../constants/app';
import { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

type NoUndefinedRangeValueType = [Dayjs | null, Dayjs | null];

export const CRangePickerExpired: FC<RangePickerProps> = React.memo(
    ({ id, children, onBlur, style, ...rest }) => {
        const form = Form.useFormInstance();
        const field = id as string;

        const validateDateRange = async (value: NoUndefinedRangeValueType | null) => {
            const [start, end] = value || [];
            if (start && end) {
                const diffInDays = end.diff(start, 'days');
                if (diffInDays > 30) {
                    form.setFields([
                        {
                            name: field,
                            errors: ['Thời gian tìm kiếm không được vượt quá 30 ngày'],
                        },
                    ]);
                    return Promise.reject(new Error('Thời gian tìm kiếm không được vượt quá 30 ngày'));
                } else {
                    form.setFields([{ name: field, errors: [] }]);
                }
            }
            return Promise.resolve();
        };

        const handleBlur = (
            e: FocusEvent<HTMLElement>,
            info: {
                range?: 'start' | 'end';
            }
        ) => {
            const value = form.getFieldValue(field);
            validateDateRange(value).then(() => {
                form.validateFields([field]);
            }).catch((error) => {
                console.error(error);
            });
            onBlur && onBlur(e, info);
        };

        const handleChange = (dates: NoUndefinedRangeValueType | null, dateStrings: [string, string]) => {
            validateDateRange(dates).then(() => {
                form.validateFields([field]);
            }).catch((error) => {
                console.error(error);
            });
        };

        useEffect(() => {
            form.setFields([{ name: field, errors: [] }]);
        }, [field, form]);

        return (
            <RangePicker onChange={handleChange} onBlur={handleBlur} format={DateFormat.DEFAULT} {...rest}>
                {children}
            </RangePicker>
        );
    }
);
