import { DownloadOutlined } from '@ant-design/icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton from '@react/commons/Button';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { ParamsOption } from '@react/commons/types';
import { decodeSearchParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Form, Tooltip } from 'antd';
import { NumberStockTypes } from 'apps/Internal/src/constants/constants';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { useGetNumberStocks } from 'apps/Internal/src/hooks/useGetNumberStocks';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QUERY_KEY } from '../constant';
import { useExportFile } from '../queryHook/useExportExel';

const Header: React.FC = () => {
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { data: optionStock = [], isLoading: loadingStock } =
    useGetNumberStocks([
      NumberStockTypes.GENERAL,
      NumberStockTypes.SPECIFIC,
      NumberStockTypes.SALE,
      NumberStockTypes.CANCEL_AWAITING,
      NumberStockTypes.CANCELED,
    ]);

  const { STOCK_ISDN_STATUS = [], STOCK_ISDN_TRANSFER_STATUS = [] } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  console.log('🚀 ~ STOCK_ISDN_STATUS:', STOCK_ISDN_STATUS);

  const { handleSearch } = useSearchHandler(QUERY_KEY.GET_SEARCH_NUMBER);

  const items: ItemFilter[] = [
    {
      label: 'Kho',
      value: (
        <Form.Item name="stockId" className="w-40">
          <CSelect options={optionStock} placeholder="Kho" />
        </Form.Item>
      ),
    },
    {
      label: 'Trạng thái số',
      value: (
        <Form.Item name="status" className="w-40">
          <CSelect options={STOCK_ISDN_STATUS} placeholder="Trạng thái số" />
        </Form.Item>
      ),
    },
    {
      label: 'Trạng thái điều chuyển',
      value: (
        <Form.Item name="transferStatus" className="w-60">
          <CSelect
            options={STOCK_ISDN_TRANSFER_STATUS}
            placeholder="Trạng thái điều chuyển"
            isLoading={loadingStock}
          />
        </Form.Item>
      ),
    },
  ];
  useEffect(() => {
    if (params['number']) {
      form.setFieldValue('number', params['number']);
    }
    if (params['stockId']) {
      form.setFieldValue('stockId', Number(params['stockId']));
    }
    if (params['status']) {
      form.setFieldValue('status', String(params['status']));
    }
    if (params['transferStatus']) {
      form.setFieldValue('transferStatus', params['transferStatus']);
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
              <Tooltip title="Nhập số" placement="right">
                <Form.Item className="w-50" name="number">
                  <CInput
                    maxLength={20}
                    onlyNumber
                    max="20"
                    placeholder="Nhập số"
                    prefix={<FontAwesomeIcon icon={faSearch} />}
                  />
                </Form.Item>
              </Tooltip>
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
