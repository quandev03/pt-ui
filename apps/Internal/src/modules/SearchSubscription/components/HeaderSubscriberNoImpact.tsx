import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton from '@react/commons/Button';
import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { DateFormat } from '@react/constants/app';
import { decodeSearchParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { MESSAGE } from '@react/utils/message';
import { Form, Space } from 'antd';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ImpactModal from './ImpactModal';
import ImpactByFileModal from './ImpactByFileModal';
import useSubscriptionStore from '../store';
import { pathRoutes } from 'apps/Internal/src/constants/routes';

const HeaderSubscriberNoImpact: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { subscriberNoImpactIds } = useSubscriptionStore();
  const [isOpenImpact, setIsOpenImpact] = useState(false);
  const [isOpenImpactByFile, setIsOpenImpactByFile] = useState(false);
  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.GET_LIST_SUBSCRIBER_NO_IMPACT
  );

  useEffect(() => {
    if (params) {
      form.setFieldsValue({
        ...params,
        rangePicker: [
          params.fromDate
            ? dayjs(params.fromDate, DateFormat.DEFAULT)
            : dayjs().subtract(29, 'd'),
          params.toDate ? dayjs(params.toDate, DateFormat.DEFAULT) : dayjs(),
        ],
      });
    }
  }, [params]);

  const handleFinish = (values: any) => {
    handleSearch({
      ...params,
      textSearch: values.textSearch,
      fromDate: values.rangePicker
        ? dayjs(values.rangePicker[0]).format(DateFormat.DEFAULT)
        : dayjs().subtract(29, 'd').format(DateFormat.DEFAULT),
      toDate: values.rangePicker
        ? dayjs(values.rangePicker[1]).format(DateFormat.DEFAULT)
        : dayjs().format(DateFormat.DEFAULT),
    });
  };

  const items: ItemFilter[] = [
    {
      showDefault: true,
      label: 'Ngày thực hiện',
      value: (
        <Form.Item
          name="rangePicker"
          className="w-72"
          rules={[
            {
              validator: (_, value) => {
                if (value) {
                  const toDate = dayjs(value[1]).subtract(1, 'M');
                  if (toDate.isAfter(value[0], 'D')) {
                    return Promise.reject(MESSAGE.G12);
                  }
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <CRangePicker allowClear={false} />
        </Form.Item>
      ),
    },
  ];

  return (
    <>
      <TitleHeader>Danh sách thuê bao cấm tác động</TitleHeader>
      <RowHeader>
        <Form
          form={form}
          onFinish={handleFinish}
          initialValues={{
            rangePicker: [dayjs().subtract(29, 'd'), dayjs()],
          }}
        >
          <div className="w-max">
            <CFilter
              items={items}
              validQuery={REACT_QUERY_KEYS.GET_LIST_SUBSCRIBER_NO_IMPACT}
              searchComponent={
                <Form.Item name="textSearch">
                  <CInput
                    placeholder="Nhập số thuê bao hoặc user thực hiện"
                    prefix={<FontAwesomeIcon icon={faSearch} />}
                    maxLength={100}
                    className="w-80"
                  />
                </Form.Item>
              }
            />
          </div>
        </Form>
        <Space>
          <CButton
            disabled={!subscriberNoImpactIds.length}
            onClick={() => setIsOpenImpact(true)}
          >
            Mở tác động
          </CButton>
          <CButton onClick={() => setIsOpenImpactByFile(true)}>
            Cấm/Mở theo file
          </CButton>
          <CButton onClick={() => navigate(pathRoutes.subscriberImpactByFile)}>
            Kết quả cấm/mở theo file
          </CButton>
        </Space>
      </RowHeader>
      <ImpactModal isOpen={isOpenImpact} setIsOpen={setIsOpenImpact} />
      <ImpactByFileModal
        isOpen={isOpenImpactByFile}
        setIsOpen={setIsOpenImpactByFile}
      />
    </>
  );
};

export default HeaderSubscriberNoImpact;
