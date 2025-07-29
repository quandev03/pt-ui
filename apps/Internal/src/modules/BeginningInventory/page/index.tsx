import { TitleHeader, Wrapper } from "@react/commons/Template/style";
import { Body } from "../components/Body";
import { Header } from "../components/Header";
import { Form, Space } from "antd";
import { CButtonSave } from "@react/commons/Button";
import { useCallback } from "react";
import { IAddBeginningInventory } from "../hook/useAdd";
import useAdd from "../hook/useAdd";
import dayjs from "dayjs";
const BeginningInventoryPage = () => {
    const [form] = Form.useForm();
    const handleAddSuccess = useCallback(() => {
        form.resetFields();
    }, [form]);
    const { mutateAsync: mutateAdd } = useAdd(handleAddSuccess);
    const handleSubmit = useCallback(
        (values: IAddBeginningInventory) => {
            const data = {
                orgId: Number(values.orgId),
                endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
                productInventories: values.productInventories.map((e) => ({
                    productCode: e.productCode,
                    quantity: Number(e.quantity),
                })),

            };
            mutateAdd(data);
        },
        [mutateAdd]
    );
    return (
        <Wrapper>
            <TitleHeader>Nhập tồn đầu kỳ</TitleHeader>
            <Form onFinish={handleSubmit} form={form}>
                <Header />
                <Body />
                <div className="flex justify-end mt-6">
                    <Space>
                        <CButtonSave htmlType="submit" />
                    </Space>
                </div>
            </Form>
        </Wrapper>
    );
};
export default BeginningInventoryPage;
