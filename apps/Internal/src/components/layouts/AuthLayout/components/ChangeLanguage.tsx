import { Select, Space } from 'antd';
import FlagEN from 'apps/Internal/src/assets/images/FlagEN.svg';
import FlagVN from 'apps/Internal/src/assets/images/FlagVN.svg';
import useLanguageStore from '../../../../languages/store';
import useConfigAppStore from '../../store';
import {
  IconFlag,
  WrapperChangeLanguage,
  WrapperFlagLanguage,
} from '../styled';
import { LanguageType } from '@react/languages/type';

const ChangeLanguage = () => {
  const { type, changedLanguage } = useLanguageStore();
  const { collapsedMenu } = useConfigAppStore();
  const handleChange = (value: LanguageType) => {
    changedLanguage(value);
  };
  return (
    <WrapperChangeLanguage>
      {collapsedMenu ? (
        <WrapperFlagLanguage>
          {type === LanguageType.VI ? (
            <img
              src={FlagVN}
              alt="Logo"
              onClick={() => handleChange(LanguageType.EN)}
            />
          ) : (
            <img
              src={FlagEN}
              alt="Logo"
              onClick={() => handleChange(LanguageType.VI)}
            />
          )}
        </WrapperFlagLanguage>
      ) : (
        <Select
          style={{ width: '100%', textAlign: 'center' }}
          onChange={handleChange}
          value={type}
        >
          <Select.Option value={LanguageType.VI} label="China">
            <Space>
              <IconFlag>
                <img src={FlagVN} alt="Logo" />
              </IconFlag>
              Tiếng Việt
            </Space>
          </Select.Option>
          <Select.Option value={LanguageType.EN} label="USA">
            <Space>
              <IconFlag>
                <img src={FlagEN} alt="Logo" />
              </IconFlag>
              English
            </Space>
          </Select.Option>
        </Select>
      )}
    </WrapperChangeLanguage>
  );
};

export default ChangeLanguage;
