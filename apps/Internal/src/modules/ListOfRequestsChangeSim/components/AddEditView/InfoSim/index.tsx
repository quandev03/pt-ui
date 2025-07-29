import { FC, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesDown, faAnglesUp } from '@fortawesome/free-solid-svg-icons';
import { Collapse, Spin } from 'antd';
import ChangeSim from './ChangeSim';
import ConsigneeInfor from './ConsigneeInfor';
import SignInfo from './SignInfo';
import { ActionType } from '@react/constants/app';
import { useListOrgUnit } from 'apps/Internal/src/modules/ListOfRequestsChangeSim/hooks/useListOrgUnit';
import { useGetOrgByUser } from 'apps/Internal/src/hooks/useGetOrgByUser';
type Props = {
  typeModal: ActionType;
};

const InfoSim: FC<Props> = ({ typeModal }) => {
  const [activeKey, setActiveKey] = useState<string>('1');
  const handleChangeCollapse = () => {
    setActiveKey(activeKey === '1' ? '' : '1');
  };
  const { isFetching: isLoadingOrgUnit } = useListOrgUnit({
    'org-type': 'NBO',
    'org-sub-type': '04',
  });
  const { isFetching: isLoadingOrg } = useGetOrgByUser();
  return (
    <fieldset>
      <legend>
        Thông tin đổi SIM
        <FontAwesomeIcon
          className="cursor-pointer"
          onClick={handleChangeCollapse}
          icon={activeKey === '1' ? faAnglesUp : faAnglesDown}
        />
      </legend>
      <Collapse activeKey={activeKey} ghost>
        <Collapse.Panel showArrow={false} header={null} key="1">
          <Spin spinning={isLoadingOrgUnit || isLoadingOrg}>
            <ChangeSim typeModal={typeModal} />
            <ConsigneeInfor typeModal={typeModal} />
            {typeModal === ActionType.ADD && <SignInfo />}
          </Spin>
        </Collapse.Panel>
      </Collapse>
    </fieldset>
  );
};

export default InfoSim;
