import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton from '@react/commons/Button';
import CSelect from '@react/commons/Select';
import { BtnGroupFooter, TitleHeader } from '@react/commons/Template/style';
import { decodeSearchParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Col } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RowHeader } from '../page/style';
import { useExportSerialReport, useGetListOrgUser } from '../queryHook/useList';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';

const Header: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { handleSearch } = useSearchHandler(REACT_QUERY_KEYS.INVENTORY_DETAIL);
  const { data: dataOrgUser, isFetching: isLoadingOrg } = useGetListOrgUser();

  const optionOrgUser = useMemo(() => {
    if (!dataOrgUser) {
      return [];
    } else {
      return dataOrgUser.map((org) => {
        return {
          label: org.orgName,
          value: String(org.orgId),
        };
      });
    }
  }, [dataOrgUser]);

  useEffect(() => {
    if (dataOrgUser && dataOrgUser.length > 0 && !params.inventoryCode) {
      const itemCurrent = dataOrgUser.find((item) => item.isCurrent);
      itemCurrent && handleSearch({ inventoryCode: itemCurrent.orgId });
    }
  }, [dataOrgUser, handleSearch, params.inventoryCode]);

  const handleInventoryChange = (value: string) => {
    handleSearch({ inventoryCode: value });
  };

  const { isPending: isLoadingExportSerial, mutate: exportSerialMutate } =
    useExportSerialReport();

  const handleExportSerial = () => {
    exportSerialMutate(params);
  };

  return (
    <>
      <TitleHeader>Xem thông tin kho</TitleHeader>
      <RowHeader>
        <Col span={5}>
          <CSelect
            options={optionOrgUser}
            isLoading={isLoadingOrg}
            placeholder="Chọn kho"
            onChange={(value) => {
              handleInventoryChange(value);
            }}
            allowClear={false}
            value={params?.inventoryCode ?? ''}
            className="w-full"
          />
        </Col>
        <BtnGroupFooter>
          <CButton
            icon={<FontAwesomeIcon icon={faDownload} />}
            onClick={handleExportSerial}
            loading={isLoadingExportSerial}
          >
            Xuất báo cáo hàng tồn
          </CButton>
          {/* <CButton
            icon={<FontAwesomeIcon icon={faDownload} />}
            onClick={handleExport}
            loading={isLoadingExport}
          >
            Xuất báo cáo
          </CButton> */}
        </BtnGroupFooter>
      </RowHeader>
    </>
  );
};

export default Header;
