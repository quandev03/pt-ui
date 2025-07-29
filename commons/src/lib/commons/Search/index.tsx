import { Tooltip } from 'antd';
import { SearchProps } from 'antd/es/input/Search';
import React, { ChangeEvent, ClipboardEvent, FocusEvent } from 'react';
import { useIntl } from 'react-intl';
import CInput from '../Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faSearch } from '@fortawesome/free-solid-svg-icons';
import CButton from '../Button';
import { StyledSearch, WrapperButton } from '../Template/style';

interface Props extends SearchProps {
  onSearch: any;
  loading?: boolean;
  disabled?: boolean;
  value?: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  tooltip?: string;
  textSearch?: string;
}

const CustomSearch = (props: Props) => {
  const {
    onSearch,
    loading,
    disabled,
    value,
    setValue,
    tooltip,
    textSearch,
    ...rest
  } = props;
  const intl = useIntl();

  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    setValue && setValue(e.target.value.trim());
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue && setValue((e.target as HTMLInputElement).value);
  };

  const onPates = async (e: ClipboardEvent<HTMLInputElement>) => {
    setTimeout(() => {
      setValue && setValue((e.target as HTMLInputElement).value.trim());
    }, 0);
  };

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      onSearch(value?.trim());
    }
  };

  return (
    <>
      <Tooltip
        title={
          tooltip || intl.formatMessage({ id: 'common.placeholderSearch' })
        }
        placement="right"
        overlayClassName="quickSearchOverlay"
      >
        <CInput
          maxLength={100}
          placeholder={
            tooltip || intl.formatMessage({ id: 'common.placeholderSearch' })
          }
          prefix={<FontAwesomeIcon icon={faSearch} />}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onPaste={onPates}
          onPressEnter={handleKeyPress}
          className="w-60"
          {...rest}
        />
      </Tooltip>
      <CButton
        loading={loading}
        disabled={disabled}
        icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
        onClick={() => onSearch(value)}
        htmlType="submit"
      >
        Tìm kiếm
      </CButton>
    </>
  );
};

export const ButtonSearch = (props: Props) => {
  const { onSearch, loading, disabled, value, setValue, tooltip, ...rest } =
    props;
  const intl = useIntl();

  const onBlur = (e: any) => {
    setValue && setValue(e.target.value.trim());
  };

  const onChange = (e: any) => {
    setValue && setValue(e.target.value);
  };

  const onPates = async (e: any) => {
    setTimeout(() => {
      setValue && setValue(e.target.value.trim());
    }, 0);
  };

  return (
    <Tooltip
      title={tooltip || intl.formatMessage({ id: 'common.placeholderSearch' })}
      placement="right"
      overlayClassName="quickSearchOverlay"
    >
      <StyledSearch
        onSearch={onSearch}
        onBlur={onBlur}
        value={value}
        onChange={onChange}
        loading={loading}
        disabled={disabled}
        onPaste={onPates}
        enterButton={intl.formatMessage({ id: 'common.search' })}
        placeholder={
          tooltip || intl.formatMessage({ id: 'common.placeholderSearch' })
        }
        {...rest}
        prefix={<FontAwesomeIcon icon={faSearch} />}
      />
    </Tooltip>
  );
};

export default CustomSearch;
