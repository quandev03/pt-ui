import { DownloadOutlined } from '@ant-design/icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton from '@react/commons/Button';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { decodeSearchParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Form } from 'antd';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QUERY_KEY } from '../constant';
import { useExportFile } from '../queryHook/useExportExel';
import { ParamsOption } from '@react/commons/types';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';

const Header: React.FC = () => {
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const { STOCK_ISDN_STATUS = [] } =
  useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS_OPTION]);

  const { handleSearch } = useSearchHandler(QUERY_KEY.GET_SEARCH_NUMBER);

  const items: ItemFilter[] = [
    {
      label: 'Trạng thái',
      value: (
        <Form.Item name="status" className="w-40">
          <CSelect options={STOCK_ISDN_STATUS} placeholder="Trạng thái số" />
        </Form.Item>
      ),
    }
  ];
  useEffect(() => {
    if (params['number']) {
      form.setFieldValue('number', params['number']);
    }
    if (params['status']) {
      form.setFieldValue('status',String(params['status']));
    }
  }, []);
  const { mutate: exportFile, isPending: loadingExportFile } = useExportFile();
  return (
    <>
      <TitleHeader>Tra cứu số</TitleHeader>
      <RowHeader>
        <Form form={form} onFinish={handleSearch}>
          <CFilter
            items={items}
            validQuery={QUERY_KEY.GET_SEARCH_NUMBER}
            searchComponent={
              <Form.Item className="w-50" name="include">
                <CInput
                  maxLength={20}
                  onlyNumber
                  max="20"
                  placeholder="Nhập số"
                  prefix={<FontAwesomeIcon icon={faSearch} />}
                />
              </Form.Item>
            }
          />
        </Form>
        <CButton
          icon={<DownloadOutlined />}
          onClick={() => exportFile(params)}
          loading={loadingExportFile}
        >
          Xuất số
        </CButton>
      </RowHeader>
    </>
  );
};
export default Header;
