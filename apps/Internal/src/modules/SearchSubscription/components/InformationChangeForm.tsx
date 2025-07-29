import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { Form, Row, Tooltip } from 'antd';
import CadastralSelect from 'apps/Internal/src/components/Select/CadastralSelect';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';

const InformationChangeForm: React.FC<{ name: string }> = ({ name }) => {
  const form = Form.useFormInstance();
  const { data: sexData } = useGetApplicationConfig('SEX');
  const { data: idTypeData } = useGetApplicationConfig('ID_TYPE');

  return (
    <>
      <legend className="!mb-3">
        {name === 'olds' ? 'Thông tin cũ' : 'Thông tin cập nhật'}
      </legend>
      <Form.List name={name}>
        {() => (
          <>
            <Form.Item label="Họ và tên" name="name">
              <CInput />
            </Form.Item>
            <Form.Item label="Loại GTTT" name="idType">
              <CSelect
                suffixIcon={null}
                options={idTypeData?.map(({ code, value }) => ({
                  label: code,
                  value,
                }))}
              />
            </Form.Item>
            <Form.Item label="Số GTTT" name="idNo">
              <CInput />
            </Form.Item>
            <Tooltip
              title={form.getFieldValue([name, 'idIssuePlace'])}
              placement="topRight"
            >
              <Form.Item label="Nơi cấp" name="idIssuePlace">
                <CInput styles={{ input: { textOverflow: 'ellipsis' } }} />
              </Form.Item>
            </Tooltip>
            <Form.Item label="Ngày cấp" name="idIssueDate">
              <CInput />
            </Form.Item>
            <Form.Item label="Ngày sinh" name="birthDate">
              <CInput />
            </Form.Item>
            <Form.Item label="Giới tính" name="sex">
              <CSelect
                disabled
                suffixIcon={null}
                options={sexData?.map(({ name, value }) => ({
                  label: name,
                  value,
                }))}
              />
            </Form.Item>
            <Tooltip
              title={form.getFieldValue([name, 'address'])}
              placement="topRight"
            >
              <Form.Item label="Địa chỉ thường trú" name="address">
                <CInput styles={{ input: { textOverflow: 'ellipsis' } }} />
              </Form.Item>
            </Tooltip>
          </>
        )}
      </Form.List>
      <Row>
        <CadastralSelect
          col={{
            props: {
              span: 24,
            },
          }}
          required={false}
          formName={{
            province: `province_${name}`,
            district: `district_${name}`,
            village: `precinct_${name}`,
          }}
        />
      </Row>
    </>
  );
};

export default InformationChangeForm;
