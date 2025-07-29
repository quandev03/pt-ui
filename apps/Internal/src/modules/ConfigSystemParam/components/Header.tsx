import { CButtonAdd } from '@react/commons/Button';
import { CReloadButton } from '@react/commons/ReloadButton';
import CustomSearch from '@react/commons/Search';
import {
  RowHeader,
  TitleHeader,
  WrapperButton,
} from '@react/commons/Template/style';
import { DateFormat } from '@react/constants/app';
import { decodeSearchParams } from '@react/helpers/utils';
import { filterFalsy } from '@react/utils/index';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Header: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState<string>('');
  const params = decodeSearchParams(searchParams);
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    setSearchParams(
      filterFalsy({
        ...params,
        param: value,
        page: 0,
        queryTime: dayjs().format(DateFormat.TIME),
      })
    );
  };

  const handleRefresh = () => {
    setSearchValue('');
    setSearchParams({ queryTime: dayjs().format(DateFormat.TIME) });
  };

  const handleAdd = () => {
    navigate(pathRoutes.configSystemParamAdd);
  };

  return (
    <>
      <TitleHeader>Cấu hình tham số hệ thống</TitleHeader>
      <RowHeader>
        <WrapperButton>
          <CustomSearch
            tooltip={
              'Tìm kiếm theo loại cấu hình, mã cấu hình hoặc tên cấu hình'
            }
            onSearch={handleSearch}
            value={searchValue}
            setValue={setSearchValue}
            maxLength={50}
          />
          <CReloadButton onClick={handleRefresh} />
        </WrapperButton>
        <CButtonAdd onClick={handleAdd} />
      </RowHeader>
    </>
  );
};

export default Header;
