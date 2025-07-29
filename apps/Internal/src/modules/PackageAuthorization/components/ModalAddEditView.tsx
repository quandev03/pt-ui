import { Card, Checkbox, Col, Form, Row, Tooltip } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import CCheckbox from '@react/commons/Checkbox';
import { RowButton, Text, TitleHeader } from '@react/commons/Template/style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button, CInput } from '@react/commons/index';
import { FormattedMessage } from 'react-intl';
import usePackageAuthorizationStore from '../store';
import { useNavigate, useParams } from 'react-router-dom';
import Show from '@react/commons/Template/Show';
import { useView } from '../../ListOfServicePackage/queryHook/useView';
import { useGetPckMain } from '../hook/useGetPckMain';
import { useGetPckSub } from '../hook/useGetPckSub';
import { AnyElement } from '@react/commons/types';
import '../index.scss';
import { useViewPckAuthorization } from '../hook/useViewPckAuthorization';
import { useAddPckAuthorization } from '../hook/useAddPckAuthorization';
import { useUpdatePckAuthorization } from '../hook/useUpdatePckAuthorization';
import { IMainSubPackage } from '../types';
import { useGetPckAddon } from '../hook/useGetPckAddon';

const ModalAddEditView = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { resetGroupStore } = usePackageAuthorizationStore();
  const { id } = useParams();
  const { data: packageDetail, isFetched: loadingData } = useView(id ?? '');
  const { data: listPckMain, isFetched: loadingPckMain } = useGetPckMain();
  const { data: listPckSub, isFetched: loadingPckSub } = useGetPckSub();
  const { data: listPckAddon, isFetched: loadingPckAddon } = useGetPckAddon();
  const { data: pckDetail, isFetched: loadingPckDetail } =
    useViewPckAuthorization(id ?? '');

  const dataPckDetail = useMemo(() => {
    if (!pckDetail) return [];
    return pckDetail;
  }, [pckDetail]);

  const handleClose = useCallback(() => {
    form.resetFields();
    resetGroupStore();
    navigate(-1);
  }, [form, resetGroupStore, navigate]);

  const { mutate: addPckAuthorization } = useAddPckAuthorization(handleClose);
  const { mutate: updatePckAuthorization } =
    useUpdatePckAuthorization(handleClose);
  console.log(dataPckDetail);
  const handleFinishForm = useCallback(
    (values: AnyElement) => {
      const data = {
        pckId: id ?? '',
        listAttachment: [
          ...(values.mainPackage || []),
          ...(values.subPackage || []),
          ...(values.addonPackage || []),
        ],
      };
      if (dataPckDetail.listAttachment.length === 0) {
        addPckAuthorization(data);
      } else {
        updatePckAuthorization(data);
      }
    },
    [addPckAuthorization, updatePckAuthorization, id, dataPckDetail]
  );

  useEffect(() => {
    if (
      packageDetail &&
      loadingData &&
      loadingPckDetail &&
      loadingPckMain &&
      loadingPckSub &&
      loadingPckAddon
    ) {
      const listAttachments = dataPckDetail.listAttachment || [];

      const mainPackage =
        listPckMain
          ?.filter((item: IMainSubPackage) => listAttachments.includes(item.id))
          .map((item: IMainSubPackage) => item.id) || [];
      const subPackage =
        listPckSub
          ?.filter((item: IMainSubPackage) => listAttachments.includes(item.id))
          .map((item: IMainSubPackage) => item.id) || [];
      const addonPackage =
        listPckAddon
          ?.filter((item: IMainSubPackage) => listAttachments.includes(item.id))
          .map((item: IMainSubPackage) => item.id) || [];

      form.setFieldsValue({
        pckId: packageDetail.pckName,
        mainPackage,
        subPackage,
        addonPackage,
      });
    }
  }, [
    packageDetail,
    loadingData,
    loadingPckDetail,
    loadingPckMain,
    loadingPckSub,
    loadingPckAddon,
    listPckMain,
    listPckSub,
    listPckAddon,
    dataPckDetail,
    form,
  ]);

  return (
    <>
      <TitleHeader id="filterPackageAuthorization">
        <FormattedMessage id="packageAuthorization.titleCreate" />
      </TitleHeader>
      <Form colon={false} onFinish={handleFinishForm} form={form}>
        <Card>
          <Row>
            <Col span={12}>
              <Form.Item labelAlign="left" label="Chọn gói cước" name="pckId">
                <CInput readOnly />
              </Form.Item>
            </Col>
            <Col span={12}></Col>
          </Row>
          <Col span={24} className="mb-2 mt-4">
            <b className="text-base text-blue">Gói cước đi kèm</b>
          </Col>
          <Row>
            <Show.When isTrue={packageDetail?.groupType !== '1'}>
              <Col className="scrollable-content" span={7}>
                <Form.Item
                  label="Gói cước chính"
                  labelAlign="left"
                  labelCol={{ style: { alignItems: 'flex-start' } }}
                  name="mainPackage"
                >
                  <Checkbox.Group className="ml-4 mt-2.5">
                    {listPckMain &&
                      listPckMain.map((item: IMainSubPackage) => (
                        <CCheckbox key={item.id} value={item.id}>
                          <Tooltip placement="topLeft" title={item.pckName}>
                            <Text className="block ml-5">{item.pckName}</Text>
                          </Tooltip>
                        </CCheckbox>
                      ))}
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            </Show.When>
            <Col className="scrollable-content" span={7}>
              <Form.Item
                label="Gói cước addon"
                labelCol={{ style: { alignItems: 'flex-start' } }}
                labelAlign="left"
                name="addonPackage"
              >
                <Checkbox.Group className="ml-4 mt-2.5 w-max">
                  {listPckAddon &&
                    listPckAddon.map((item: IMainSubPackage) => (
                      <CCheckbox
                        key={item.id}
                        value={item.id}
                        className="w-max"
                      >
                        <Tooltip placement="topLeft" title={item.pckName}>
                          <Text className="block ml-3 w-max">
                            {item.pckName}
                          </Text>
                        </Tooltip>
                      </CCheckbox>
                    ))}
                </Checkbox.Group>
              </Form.Item>
            </Col>
            <Col className="scrollable-content" span={7}>
              <Form.Item
                label="Gói cước phụ"
                labelCol={{ style: { alignItems: 'flex-start' } }}
                labelAlign="left"
                name="subPackage"
              >
                <Checkbox.Group className="ml-4 mt-2.5 w-max">
                  {listPckSub &&
                    listPckSub.map((item: IMainSubPackage) => (
                      <CCheckbox key={item.id} value={item.id}>
                        <Tooltip placement="topLeft" title={item.pckName}>
                          <Text className="block ml-3 w-max">
                            {item.pckName}
                          </Text>
                        </Tooltip>
                      </CCheckbox>
                    ))}
                </Checkbox.Group>
              </Form.Item>
            </Col>
            <Col span={3}></Col>
          </Row>
        </Card>
        <RowButton className="mt-12">
          <Button htmlType="submit" icon={<FontAwesomeIcon icon={faPlus} />}>
            <FormattedMessage id="common.save" />
          </Button>
          <Button onClick={handleClose} type="default">
            Đóng
          </Button>
        </RowButton>
      </Form>
    </>
  );
};

export default ModalAddEditView;
