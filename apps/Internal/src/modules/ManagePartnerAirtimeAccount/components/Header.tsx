import { CReloadButton } from '@react/commons/ReloadButton';
import CustomSearch from '@react/commons/Search';
import {
  RowHeader,
  TitleHeader,
  WrapperButton,
} from '@react/commons/Template/style';
import { decodeSearchParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { queryKeyList } from '../hook/useList';

export const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const [value, setValue] = useState('');
  const { handleSearch } = useSearchHandler(queryKeyList);
  const handleRefresh = useCallback(() => {
    setSearchParams({
      ...params,
      page: 0,
      orgName: '',
    });
    setValue('');
  }, [setSearchParams, params]);

  useEffect(() => {
    if (params.orgName) {
      setValue(params.orgName);
    }
  }, []);

  const handleFinish = useCallback(() => {
    setSearchParams({
      ...params,
      page: 0,
      orgName: value,
    });
    handleSearch(searchParams);
  }, [setSearchParams, params, handleSearch, value]);
  return (
    <>
      <TitleHeader>Danh sách tài khoản airtime đối tác</TitleHeader>
      <RowHeader>
        <WrapperButton>
          <CustomSearch
            value={value}
            setValue={setValue}
            tooltip="Tìm kiếm theo tên đối tác"
            onSearch={handleFinish}
          />
          <CReloadButton onClick={handleRefresh} />
        </WrapperButton>
      </RowHeader>
    </>
  );
};
