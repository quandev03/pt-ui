import { Col, Form, Row } from 'antd';
import { CInput, CSelect } from '../../../../../../commons/src/lib/commons';
import validateForm from '@react/utils/validator';
import { useEnterprisesList } from '../hooks/useListEnterprises';
import { useSubsList } from '../hooks/useListSub';
import { useEnterpriseDetail } from '../hooks/useEnterpriseDetail';
import useActivateM2M from '../store';

const ThongTinKichHoat = () => {
  const form = Form.useFormInstance();
  const { data: dataEnterprises } = useEnterprisesList();
  const { mutate: getListSub } = useSubsList((data) => {
    console.log('HAHA');
  });

  const { setIsSub } = useActivateM2M();

  const { mutate: getDetailEnterprise } = useEnterpriseDetail((data) => {
    form.setFields([
      {
        name: 'supervisorName',
        value: data.chargePerson,
      },
      {
        name: 'enterpriseName',
        value: data.enterpriseName,
      },
      {
        name: 'supervisorId',
        value: data.supervisorId,
      },
    ]);
  });
  const enterprisesOptions = dataEnterprises?.map((item: any) => ({
    label: item.enterpriseName,
    value: item.id,
  }));

  const handleChangeEnterprise = (value: any) => {
    form.resetFields([
      'responsiblePerson',
      'responsibleInfo',
      'startDate',
      'endDate',
      'idType',
      'name',
      'idNo',
      'idIssueDate',
      'idIssuePlace',
      'birthday',
      'sex',
      'address',
      'province',
      'district',
      'precinct',
      'idExpiry',
      'idFrontPath',
      'idBackPath',
      'portraitPath',
      'authorizedFilePath',
    ]);
    getListSub(value);
    form.resetFields(['supervisorName', 'contractSignerType']);
    setIsSub(true);
    getDetailEnterprise(value);
  };

  return (
    <fieldset>
      <legend>Thông tin doanh nghiệp</legend>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            label="Tên doanh nghiệp"
            name="enterpriseId"
            rules={[validateForm.required]}
            labelCol={{ span: 6 }}
          >
            <CSelect
              options={enterprisesOptions}
              placeholder="Chọn doanh nghiệp"
              onChange={(value) => handleChangeEnterprise(value)}
              allowClear={false}
            ></CSelect>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Người phụ trách" name="supervisorName">
            <CInput disabled={true} placeholder="Người phụ trách" />
          </Form.Item>
        </Col>
        <Form.Item hidden name="enterpriseName"></Form.Item>
      </Row>
    </fieldset>
  );
};

export default ThongTinKichHoat;
