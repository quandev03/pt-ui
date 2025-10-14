import {
  ActionsTypeEnum,
  AnyElement,
  CButtonExport,
  decodeSearchParams,
  formatQueryParams,
  LayoutList,
  usePermissions,
} from '@vissoft-react/common';
import { useList } from '../hook/useList';
import { useSearchParams } from 'react-router-dom';
import { IParameter, IResLookupNumber } from '../types';
import { useCallback, useMemo } from 'react';
import useConfigAppStore from '../../Layouts/stores';
import { useFilters } from '../hook/useFilters';
import { useColumns } from '../hook/useColumns';
import { useExport } from '../hook/useExport';

export const ListPage = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { data, isPending } = useList(formatQueryParams<IParameter>(params));
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const canExport = permission
    .getAllPermissions()
    .some((item) => item.includes(ActionsTypeEnum.EXPORT_EXCEL));
  const { mutate } = useExport();
  const handleExport = useCallback(() => {
    const exportParams = { ...params } as AnyElement;
    delete (exportParams as AnyElement).page;
    delete (exportParams as AnyElement).size;
    delete (exportParams as AnyElement).requestTime;
    mutate(formatQueryParams<IParameter>(exportParams));
  }, [mutate, params]);
  const actionComponent = useMemo(() => {
    return (
      <div>
        {canExport && (
          <CButtonExport onClick={handleExport}>Xuất số</CButtonExport>
        )}
      </div>
    );
  }, [canExport, handleExport]);
  return (
    <div style={{ maxWidth: 400, margin: '20px auto' }}>
      <h2>Thêm dịch vụ</h2>
      <form >
        <div style={{ marginBottom: 10 }}>
          <label>Mã dịch vụ</label><br />
          <input
            type="text"
            name="maDV"
            value={""}
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Tên dịch vụ</label><br />
          <input
            type="text"
            name="tenDV"
            value={""}
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Đơn vị tính:</label><br />
          <input
            type="text"
            name="dvt"
            value={""}
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Đơn giá</label><br />
          <input
            type="text"
            name="gia"
            value={""}
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Trạng thái</label><br />
          <input
            type="text"
            name="gia"
            value={""}
            style={{ width: '100%', padding: 8 }}
          />
        </div>
         
        <div style={{ marginBottom: 10 }}>
          <label>Nhà cung cấp</label><br />
          <input
            type="text"
            name="ncc"
            value={""}
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Mô tả chi tiết</label><br />
          <input
            type="text"
            name="mota"
            value={""}
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '8px 16px',
            background: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Gửi
        </button>
      </form>
    </div>
  );
};
