import { Col, Form, Row } from 'antd';
import { StoreValue } from 'antd/es/form/interface';
import { FormListFieldData } from 'antd/lib';
import { debounce } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { useInfinityProductByCategory } from '../hook';
import { ICategoryProduct, IProductAuthorization } from '../types';
import {
  CSelect,
  IPage,
  Show,
  useGetDataFromQueryKey,
} from '@vissoft-react/common';
import { Minus, Plus } from 'lucide-react';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/query-key';

type Props = {
  field: FormListFieldData;
  fields: FormListFieldData[];
  remove: (index: number | number[]) => void;
  add: (defaultValue?: StoreValue, insertIndex?: number) => void;
  isEdit: boolean;
  data: IProductAuthorization[] | undefined;
};

const ProductAuthorizationItem = ({
  field,
  fields,
  add,
  remove,
  isEdit,
  data,
}: Props) => {
  const form = Form.useFormInstance();
  const payload: { type: any; productIds: any[] }[] = Form.useWatch(
    'payload',
    form
  );

  const [searchValue, setSearchValue] = useState('');
  const nameType = Form.useWatch(['payload', field.name, 'type'], form);
  const {
    data: products,
    fetchNextPage,
    hasNextPage,
  } = useInfinityProductByCategory({
    categoryId: nameType,
    page: 0,
    size: 20,
    q: searchValue,
    status: '1',
  });

  const optionProducts = useMemo(() => {
    if (!products) return [];
    const result = products.map((item) => ({
      label: item.productName,
      value: item.id,
    }));
    if (isEdit) {
      return result;
    }
    if (!data || data.length === 0) {
      return [];
    }
    const currentOption = data.find((item) => {
      return item.categoryId === nameType;
    });
    if (currentOption) {
      return currentOption.productInfos.map((item) => ({
        label:
          item.productName +
          (item.productStatus === 0 ? ' (Ngưng hoạt động)' : ''),
        value: item.productId,
        disabled: item.productStatus === 0,
      }));
    }
    return [];
  }, [products, data, isEdit]);

  const listProductCategory = useGetDataFromQueryKey<IPage<ICategoryProduct>>([
    REACT_QUERY_KEYS.GET_LIST_CATEGORY_PRODUCT,
  ]);

  const optionCategory = useMemo(() => {
    if (!listProductCategory) return [];
    const result = listProductCategory.content
      .filter(
        (item) => item.status && [4, 2, 1, 3, 5, 7].includes(item.categoryType)
      )
      .map((item) => {
        const ids = payload ? payload.map((item) => item.type) : [];
        return {
          label: item.categoryName,
          value: item.id,
          disabled: ids.includes(item.id),
        };
      });
    if (isEdit) {
      return result;
    }
    if (!data || data.length === 0) {
      return [];
    }
    const currentOption = data.filter((item) => {
      return item.categoryId === nameType;
    });
    if (currentOption) {
      return currentOption.map((item) => ({
        label:
          item.categoryName +
          (item.categoryStatus === 0 ? ' (Ngưng hoạt động)' : ''),
        value: item.categoryId,
        disabled: item.categoryStatus === 0,
      }));
    }
    return [];
  }, [listProductCategory, payload, data, isEdit]);
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.target as HTMLDivElement;
      if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
        if (hasNextPage) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, hasNextPage]
  );

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchValue(value);
    }, 500),
    []
  );

  const handleSearchValue = (value: string) => {
    debouncedSearch(value);
  };

  return (
    <div className="flex gap-5 items-center w-full">
      <div className="border rounded-md p-4 flex-1 ">
        <Row gutter={[24, 12]}>
          <Col span={12}>
            <Form.Item
              key={field.key}
              name={[field.name, 'type']}
              labelCol={{ flex: '170px' }}
              label="Chọn loại sản phẩm"
              required
              rules={[
                {
                  validator(rule, value, callback) {
                    if (!value || value.length === 0) {
                      return Promise.reject('Không được để trống trường này');
                    } else {
                      return Promise.resolve();
                    }
                  },
                },
              ]}
            >
              <CSelect
                options={optionCategory}
                onChange={() => {
                  form.setFieldValue(
                    ['payload', field.name, 'productIds'],
                    null
                  );
                }}
                placeholder="Chọn loại sản phẩm"
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              key={field.key}
              name={[field.name, 'productIds']}
              label={'Sản phẩm'}
              labelCol={{ flex: '170px' }}
              required
              rules={[
                {
                  validator(rule, value, callback) {
                    if (!value || value.length === 0) {
                      return Promise.reject('Không được để trống trường này');
                    } else {
                      return Promise.resolve();
                    }
                  },
                },
              ]}
            >
              <CSelect
                options={optionProducts}
                mode="multiple"
                onPopupScroll={handleScroll}
                showSearch
                placeholder="Chọn sản phẩm"
                onSearch={handleSearchValue}
                filterOption={false}
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
      <div>
        <Show>
          <Show.When isTrue={isEdit}>
            {fields.length !== 1 ? (
              <Minus
                onClick={() => remove(field.name)}
                className="mr-6 cursor-pointer"
                size={16}
              />
            ) : null}
            <Plus
              onClick={() => add({ type: null, productIds: null })}
              className="mr-6 cursor-pointer"
              size={16}
            />
          </Show.When>
        </Show>
      </div>
    </div>
  );
};

export default ProductAuthorizationItem;
