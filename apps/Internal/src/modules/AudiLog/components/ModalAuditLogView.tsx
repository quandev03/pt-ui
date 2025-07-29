import CModal from '@react/commons/Modal';
import { Col, Row } from 'antd';
import dayjs from 'dayjs';
import { forOwn, isEqual, isObject } from 'lodash';
import { memo } from 'react';
import JsonViewerWithDiff from './JsonViewerWithDiff';
import { useGetAuditLogDetail } from '../hooks/useGetAuditLogDetailt';

export interface Props {
  isOpen: boolean;
  onCancel: () => void;
  id: string;
}

const findDifferences = (
  oldData: Record<string, any>,
  newData: Record<string, any>
): Record<string, any> => {
  const diffs: Record<string, any> = {};
  const compare = (
    obj1: Record<string, any>,
    obj2: Record<string, any>,
    path = ''
  ) => {
    forOwn({ ...obj1, ...obj2 }, (value, key) => {
      const currentPath = path ? `${path}.${key}` : key;

      if (isObject(obj1[key]) && isObject(obj2[key])) {
        compare(obj1[key], obj2[key], currentPath);
      } else if (!isEqual(obj1[key], obj2[key])) {
        diffs[currentPath] = { oldValue: obj1[key], newValue: obj2[key] };
      }
    });
  };

  compare(oldData, newData);
  return diffs;
};

const ModalAuditLogView: React.FC<Props> = ({ isOpen, onCancel, id }) => {
  const { data, isLoading } = useGetAuditLogDetail(id);

  const differences = findDifferences(
    data?.preValue ?? {},
    data?.postValue ?? {}
  );

  return (
    <CModal
      open={isOpen}
      onCancel={onCancel}
      width={1200}
      footer={null}
      title="Xem chi tiết"
      destroyOnClose
      loading={isLoading}
    >
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <div className="flex gap-2">
            <p className="font-bold inline-block">Người tác động: </p>
            <p className="inline-block">{data?.fullname}</p>
          </div>
        </Col>
        <Col span={12}>
          <div className="flex gap-2">
            <p className="font-bold inline-block">Thời gian tác động: </p>
            <p className="inline-block">
              {data?.actionTime
                ? dayjs(data.actionTime).format('DD/MM/YYYY HH:mm:ss')
                : ''}
            </p>
          </div>
        </Col>
        <Col span={12}>
          <div className="flex gap-2">
            <p className="font-bold inline-block">Loại tác động: </p>
            <p className="inline-block">{data?.actionName}</p>
          </div>
        </Col>
        <Col span={12}>
          <div className="flex gap-2">
            <p className="font-bold inline-block">Chức năng: </p>
            <p className="inline-block">{data?.targetName}</p>
          </div>
        </Col>
        <Col span={12}>
          <div className="flex flex-col">
            <p className="font-bold inline-block">Thông tin cũ:</p>{' '}
            <JsonViewerWithDiff
              data={data?.preValue ?? {}}
              differences={differences}
            />
          </div>
        </Col>
        <Col span={12}>
          <div className="flex flex-col">
            <p className="font-bold inline-block">Thông tin mới:</p>{' '}
            <JsonViewerWithDiff
              data={data?.postValue ?? {}}
              differences={differences}
              isNewData
            />
          </div>
        </Col>
      </Row>
    </CModal>
  );
};

export default memo(ModalAuditLogView);
