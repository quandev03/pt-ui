import CTable from "@react/commons/Table";
import { useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { decodeSearchParams, queryParams } from "@react/helpers/utils";
import useList from "../hook/useList";
import { AnyElement } from "@react/commons/types";
import { pathRoutes } from "apps/Internal/src/constants/routes";
import { CModalConfirm } from '@react/commons/index';
import { useCancel } from "../hook/useCancel";
import { ColumnsType } from "antd/es/table";
import { DeliveryOrderMethod } from "@react/constants/app";
import { getColumnsTableInternalImportExportWarehouse } from "../constants";
const Body = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const params = decodeSearchParams(searchParams)
    const handleDetail = useCallback((record: AnyElement) => {
        if (Number(record.moveMethod) === Number(DeliveryOrderMethod.IMPORT)) {
            navigate(pathRoutes.internalImportWarehouseView(record.id))
        }
        else {
            navigate(pathRoutes.internalExportWarehouseView(record.id))
        }
    }, [navigate])
    const columns: ColumnsType<AnyElement> = useMemo(() => {
        return getColumnsTableInternalImportExportWarehouse(params, {
            onDetail: handleDetail,
        });
    }, [params, handleDetail])
    const { data: listData, isFetching } = useList(queryParams(params))
    const dataTable = useMemo(() => {
        if (!listData) return []
        return listData
    }, [listData])
    return (
        <div>
            <CTable
                loading={isFetching}
                columns={columns}
                rowKey={'id'}
                dataSource={dataTable.content ?? []}
                pagination={{
                    current: +params.page + 1,
                    pageSize: +params.size,
                    total: dataTable.totalElements ?? 0
                }}
            />
        </div>
    );
};
export default Body;
