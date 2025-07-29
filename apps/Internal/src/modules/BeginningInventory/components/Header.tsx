import CSelect from "@react/commons/Select";
import { RowHeader } from "@react/commons/Template/style";
import { Col, Form, Row } from "antd";
import { useGetCurrentOrganization } from "../hook/useGetCurrentOrganization";
import CDatePicker from "@react/commons/DatePicker";
import dayjs from "dayjs";
import { MESSAGE } from "@react/utils/message";
import { useCallback } from "react";
import useFormInstance from "antd/es/form/hooks/useFormInstance";
import { useGetSearchStockPeriod } from "../hook/useGetSearchStockPeriod";
import { useWatch } from "antd/es/form/Form";
export const Header = () => {
    const { data: listOrganization, isPending: loadingOrganization } = useGetCurrentOrganization()
    const lastDayOfMonth = dayjs().subtract(1, 'month').endOf('month');
    const form = useFormInstance()
    const { mutate: mutateSearchStockPeriod } = useGetSearchStockPeriod((data) => {
        if(data.length !== 0){
            form.setFieldValue('productInventories', data.map((e) => ({
                productCode: e.productCode,
                productName: e.productName,
                quantity: e.beginningBalance,
                productUom: e.productUom,
            })))
        }
        else{
            form.setFieldValue('productInventories', [{}])
        }
    })
    const endDate = useWatch('endDate', form)
    const handleChangeOrg = useCallback((value: string) => {
        mutateSearchStockPeriod({ orgId: value, endDate: dayjs(endDate).format('YYYY-MM-DD') })
    }, [form, mutateSearchStockPeriod, endDate])
    return (
        <div>
            <RowHeader>
                <Row gutter={[24, 0]} style={{ width: "90%" }}>
                    <Col span={10}>
                        <Form.Item
                            label="Kho nhập"
                            name="orgId"
                            rules={[{ required: true, message: MESSAGE.G06 }]}
                        >
                            <CSelect
                                onChange={handleChangeOrg}
                                loading={loadingOrganization}
                                options={listOrganization}
                                placeholder={"Chọn kho"}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={10}>
                        <Form.Item
                            label="Tồn cuối ngày"
                            initialValue={lastDayOfMonth}
                            name="endDate"
                            rules={[{ required: true, message: MESSAGE.G06 }]}
                        >
                            <CDatePicker
                                allowClear={false}
                                disabledDate={(current) => {
                                    return !current?.endOf('month').isSame(current, 'day');
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={4}></Col>
                </Row>
            </RowHeader>
        </div >
    )
};
