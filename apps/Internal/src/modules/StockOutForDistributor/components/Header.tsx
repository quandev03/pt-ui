import {  RowHeader, Text } from "@react/commons/Template/style"
import { Col, Divider, Form, Popover, Row, Tooltip } from "antd"
import { useForm } from "antd/es/form/Form"
import CFilter, { ItemFilter } from "@react/commons/Filter"
import CInput from "@react/commons/Input"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useSearchParams } from "react-router-dom"
import { CButtonAdd } from "@react/commons/Button"
import { pathRoutes } from "apps/Internal/src/constants/routes"
import useSearchHandler from "@react/hooks/useSearchHandler"
import { REACT_QUERY_KEYS } from "apps/Internal/src/constants/querykeys"
import { decodeSearchParams } from "@react/helpers/utils"
import { ContentStyled } from "apps/Internal/src/components/layouts/AuthLayout/styled"
import { CRangePicker } from '@react/commons/DatePicker';
import { useEffect } from "react"
import dayjs from "dayjs"
import { formatDate } from "@react/constants/moment"

const Header = () => {
    const [form] = useForm()
    const navigte = useNavigate()
    const { handleSearch } = useSearchHandler(REACT_QUERY_KEYS.GET_LIST_STOCK_OUT_FOR_DISTRIBUTOR);
    const [searchParams, setSearchParams] = useSearchParams()
    const params = decodeSearchParams(searchParams)
    const handleFinish = (values: any) => {
        setSearchParams({
            ...params,
            ...values,
            q: values.q,
            fromDate: values.rangePicker?.[0]?.toISOString(),
            toDate: values.rangePicker?.[1]?.toISOString(),
            page: 0,
        });
        handleSearch(params)
    }
    const handleAdd = () => {
        navigte(pathRoutes.stockOutForDistributorAdd)
    }
    const items: ItemFilter[] = [
        {
            label: 'Ngày lập',
            value: (
              <Form.Item
                name="rangePicker"
              >
                <CRangePicker placeholder={['Từ ngày', 'Đến ngày']} allowClear={false} />
              </Form.Item>
            ),
            showDefault: true,
        }
    ];
      useEffect(() => {
        if (params) {
          const { fromDate, toDate, ...rest } = params;
          const from = fromDate ? dayjs(fromDate) : dayjs().subtract(29, 'day');
          const to = toDate ? dayjs(toDate) : dayjs();
          form.setFieldsValue({
            ...rest,
            rangePicker: [from, to],
          });
        }
      }, [params]);
    return (
        <RowHeader>
            <Form onFinish={handleFinish} form={form}>
                <Row gutter={8}>
                    <Col span={24}>
                        <CFilter searchComponent={
                            <Tooltip placement="right" title="Nhập mã phiếu hoặc mã đơn hàng">
                                <Form.Item name="q">
                                    <CInput
                                        style={{ minWidth: "290px" }}
                                        maxLength={100}
                                        placeholder="Nhập mã phiếu hoặc mã đơn hàng"
                                        prefix={<FontAwesomeIcon icon={faSearch} />}
                                    />
                                </Form.Item>
                            </Tooltip>
                        } validQuery={REACT_QUERY_KEYS.GET_LIST_STOCK_OUT_FOR_DISTRIBUTOR} items={items} />
                    </Col>
                </Row>
            </Form>
            <CButtonAdd onClick={handleAdd} />
        </RowHeader >
    )
}
export default Header