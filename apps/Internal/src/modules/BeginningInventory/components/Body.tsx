import { Card } from "antd";
import TableProduct from "./TableProducts";
import { ActionType } from "@react/constants/app";

export const Body = () => {
    return (
        <Card>
            <TableProduct actionType={ActionType.ADD} />
        </Card>
    );
}