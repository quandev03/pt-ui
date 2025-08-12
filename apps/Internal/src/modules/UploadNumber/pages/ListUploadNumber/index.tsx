import { LayoutList } from '@vissoft-react/common';
import { memo } from 'react';
import { useLogicListUploadNumber } from './useLogicListUploadNumber';

export const ListUploadNumber = memo(() => {
  const { filters, actionComponent } = useLogicListUploadNumber();
  return (
    <LayoutList
      actionComponent={actionComponent}
      // data={listUser}
      // columns={columns}
      title="Tài khoản nhân sự"
      filterItems={filters}
      // loading={loadingTable}
    />
  );
});
