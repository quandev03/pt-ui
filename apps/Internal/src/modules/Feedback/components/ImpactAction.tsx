import React, { FC } from 'react';
import { collumnActionImpact } from '../constants';
import { CTable } from '@react/commons/index';

/**
 * @author
 * @function @ImpactAction
 **/

export const ImpactAction = ({ listAction }: { listAction: any[] }) => {
  return (
    <CTable
      scroll={{ y: 325 }}
      rowKey={'id'}
      columns={collumnActionImpact}
      dataSource={listAction}
      style={{ marginBottom: 16 }}
    ></CTable>
  );
};
