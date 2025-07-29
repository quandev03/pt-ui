import { FC, useState } from 'react';
import InfoEkyc from './InfoEkyc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesDown, faAnglesUp } from '@fortawesome/free-solid-svg-icons';
import { Collapse } from 'antd';
import ContactNumber from './ContactNumber';
import ProfileNew from './ProfileNew';
import { ActionType } from '@react/constants/app';

type Props = {
  typeModal: ActionType;
};

const CustomerInfo: FC<Props> = ({ typeModal }) => {
  const [activeKey, setActiveKey] = useState<string>('1');
  const handleChangeCollapse = () => {
    setActiveKey(activeKey === '1' ? '' : '1');
  };
  return (
    <fieldset>
      <legend>
        Thông tin khách hàng
        <FontAwesomeIcon
          className="cursor-pointer"
          onClick={handleChangeCollapse}
          icon={activeKey === '1' ? faAnglesUp : faAnglesDown}
        />
      </legend>
      <Collapse activeKey={activeKey} ghost>
        <Collapse.Panel showArrow={false} header={null} key="1">
          {typeModal === ActionType.ADD && (
            <>
              <InfoEkyc />
              <ContactNumber />
            </>
          )}

          <ProfileNew typeModal={typeModal} />
        </Collapse.Panel>
      </Collapse>
    </fieldset>
  );
};

export default CustomerInfo;
