import CTable from "@react/commons/Table"
import { useNavigate, useSearchParams } from "react-router-dom"
import { decodeSearchParams, queryParams } from "@react/helpers/utils"
import { useCallback, useMemo } from "react"
import { getColumnsTableStockOutForDistributor } from "../constants"
import { ACTION_MODE_ENUM } from "@react/commons/types"
import useStoreStockOutForDistributorck from "../store"
import { pathRoutes } from "apps/Internal/src/constants/routes"
import useGetListStockOutForDistributor from "../hook/useGetListStockOutForDistributor"
import useCancelDeliveryNoteOperation from "../hook/useCancelDeliveryNoteOperation"
import { CModalConfirm } from "@react/commons/index"

const Body = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const params = decodeSearchParams(searchParams)
    const { setActionMode } = useStoreStockOutForDistributorck()
    const { data: dataStockOutForDistributor } = useGetListStockOutForDistributor(queryParams(params))
    const { mutate: onCancel } = useCancelDeliveryNoteOperation()
    const handleCancel = useCallback((id: string) => {
        CModalConfirm({
            message: "Bạn có chắc chắn muốn Hủy phiếu xuất này không?",
            onOk: () => id && onCancel(id),
        });
    }, [onCancel])
    const handleView = useCallback((type: ACTION_MODE_ENUM, record: any) => {
        setActionMode(type)
        navigate(pathRoutes.stockOutForDistributorView(record.id))
    }, [setActionMode, navigate])
    const dataTable = useMemo(() => {
        if (!dataStockOutForDistributor) return []
        else {
            return dataStockOutForDistributor
        }
    }, [dataStockOutForDistributor])
    return (
        <CTable
            dataSource={dataTable.content ?? []}
            columns={getColumnsTableStockOutForDistributor(params, handleCancel, handleView)}
            pagination={{
                pageSize: params.size,
                current: params.page + 1,
                total: dataTable.totalElements,
            }}
        />
    )
}
export default Body