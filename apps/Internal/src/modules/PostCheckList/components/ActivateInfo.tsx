import { Col, Flex, Form, Row, Space, Tooltip } from 'antd';
import { Button, CInput, CSelect } from '@react/commons/index';
import CTable from '@react/commons/Table';
import { columnsHistory } from '../constants';
import { useCallback, useMemo, useState } from 'react';
import Show from '@react/commons/Template/Show';
import useStorePostCheckList from '../store';
import { useDetailPostCheckList } from '../hooks/useDetailPostCheckList';
import { useParams } from 'react-router-dom';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import CadastralSelect from 'apps/Internal/src/components/Select/CadastralSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { CriteriaType } from '@react/commons/types';
import dayjs from 'dayjs';
import { DateFormat } from '@react/constants/app';
import PreviewImageUpload from 'apps/Internal/src/components/PreviewImageUpload';

const ThongTinKichHoat = () => {
  const { id } = useParams();
  const form = Form.useFormInstance();
  const { setIsHiddenModalHistory, subDocumentHistoryDTOS, setIdHistory } =
    useStorePostCheckList();
  const [openModalHistory, setOpenModalHistory] = useState<boolean>(false);
  const violationCriteria = Form.useWatch('violationCriteria', form) || [];
  const { data } = useDetailPostCheckList(id ?? '');
  const { data: sexData } = useGetApplicationConfig('SEX');
  const { data: idTypeData } = useGetApplicationConfig('ID_TYPE');
  console.log('data', data);
  const handleGenError = useCallback(
    (name: string) => {
      const errors = violationCriteria
        ?.filter((item: any) => item.field === name)
        ?.map(
          (item: any) =>
            `${CriteriaType[item.code as keyof typeof CriteriaType]}: ${
              item.name
            }`
        )
        ?.join(', ');

      errors && form.setFields([{ name, errors: [''] }]);

      return errors;
    },
    [violationCriteria]
  );
  const urlImageVideo = useMemo(() => {
    if (data) {
      const urlImageVideo = data?.imageResponseDTOList?.find(
        (item: any) => item.imageType === '6'
      )?.imagePath;
      return urlImageVideo;
    }
    return '';
  }, [data]);
  return (
    <>
      <fieldset>
        <legend>
          <span>Thông tin kích hoạt</span>
        </legend>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item name="imageResponseDTOList">
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <div className="flex flex-col items-center w-full">
                    <PreviewImageUpload
                      url={data?.cardFront ?? ''}
                      label="Ảnh GTTT mặt trước"
                      isProfilePicture
                    />
                  </div>
                </Col>
                <Col span={6}>
                  <div className="flex flex-col items-center w-full">
                    <PreviewImageUpload
                      url={data?.cardBack ?? ''}
                      label="Ảnh GTTT mặt sau"
                      isProfilePicture
                    />
                  </div>
                </Col>
                <Col span={6}>
                  <div className="flex flex-col items-center w-full">
                    <PreviewImageUpload
                      url={data?.selfie ?? ''}
                      label="Ảnh chân dung"
                      isProfilePicture
                    />
                  </div>
                </Col>
                <Col span={6}>
                  <div className="flex flex-col items-center w-full">
                    <PreviewImageUpload
                      url={data?.contract ?? ''}
                      label="Ảnh hợp đồng/BBXN"
                      isProfilePicture={false}
                    />
                  </div>
                </Col>
                {urlImageVideo && (
                  <Col span={6}>
                    <div className="flex flex-col items-center w-full">
                      <PreviewImageUpload
                        url={urlImageVideo}
                        label="Ảnh video call"
                      />
                    </div>
                  </Col>
                )}
              </Row>
            </Form.Item>
            <Form.Item name="uploadDate" className="text-center font-semibold">
              <Space size={5}>
                Thời gian upload giấy tờ:
                {data?.uploadDate &&
                  dayjs(data.uploadDate).format(DateFormat.DATE_TIME)}
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </fieldset>
      <fieldset>
        <legend>Thông tin giấy tờ tùy thân</legend>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item required label="Loại giấy tờ" name="idType">
              <CSelect
                placeholder="Loại giấy tờ"
                options={idTypeData?.map(({ code, value }) => ({
                  label: code,
                  value,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item required label="Họ và tên" name={'name'}>
              <CInput
                placeholder="Họ và tên"
                suffix={
                  handleGenError('name') && (
                    <Tooltip placement="top" title={handleGenError('name')}>
                      <FontAwesomeIcon
                        className="text-red-500 text-lg"
                        icon={faExclamationCircle}
                      />
                    </Tooltip>
                  )
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item required label="Số giấy tờ" name="idNo">
              <CInput
                placeholder="Số giấy tờ"
                suffix={
                  handleGenError('idNo') && (
                    <Tooltip placement="top" title={handleGenError('idNo')}>
                      <FontAwesomeIcon
                        className="text-red-500 text-lg"
                        icon={faExclamationCircle}
                      />
                    </Tooltip>
                  )
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item required label="Nơi cấp" name="idIssuePlace">
              <CInput placeholder="Nơi cấp" maxLength={50} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item required label="Ngày cấp" name="idIssueDate">
              <CInput placeholder="Ngày cấp" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item required label="Ngày sinh" name="birthDate">
              <CInput
                placeholder="Ngày sinh"
                suffix={
                  handleGenError('birthDate') && (
                    <Tooltip
                      placement="top"
                      title={handleGenError('birthDate')}
                    >
                      <FontAwesomeIcon
                        className="text-red-500 text-lg"
                        icon={faExclamationCircle}
                      />
                    </Tooltip>
                  )
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item required label="Giới tính" name="sex">
              <CSelect
                placeholder="Giới tính"
                options={sexData?.map(({ name, value }) => ({
                  label: name,
                  value,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item required label="Địa chỉ TT" name="address">
              <CInput placeholder="Địa chỉ TT" />
            </Form.Item>
          </Col>
          <CadastralSelect
            col={<Col span={12} />}
            formName={{
              province: 'province',
              district: 'district',
              village: 'precinct',
            }}
          />
          <Col span={12}>
            <Form.Item label="Ngày hết hạn giấy tờ" name="idIssueDateExpire">
              <CInput placeholder="Ngày hết hạn giấy tờ" />
            </Form.Item>
          </Col>
          <Show.When isTrue={true}>
            <Col span={12}>
              <Form.Item label="Ngày hết hạn" name="expireDateNote">
                <CInput placeholder="Ngày hết hạn" />
              </Form.Item>
            </Col>
          </Show.When>
          <Form.Item name="violationCriteria" hidden />
          <Col className="mt-4" span={24}>
            <strong className="inline-block w-[148px]">Lịch sử thay đổi</strong>
            <Button
              disabled={false}
              onClick={() => setOpenModalHistory(!openModalHistory)}
            >
              Lịch sử
            </Button>
          </Col>
          <Show.When isTrue={openModalHistory}>
            <Col className="mt-2" span={24}>
              <CTable
                onRow={(record) => {
                  return {
                    onClick: () => {
                      setIsHiddenModalHistory(true);
                      setIdHistory(record.id);
                    },
                  };
                }}
                pagination={false}
                dataSource={subDocumentHistoryDTOS}
                columns={columnsHistory()}
              />
            </Col>
          </Show.When>
        </Row>
      </fieldset>
    </>
  );
};
export default ThongTinKichHoat;
