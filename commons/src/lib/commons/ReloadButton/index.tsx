import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'antd';
import { useIntl } from 'react-intl';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';

interface Props {
  onClick: any;
}

export const CReloadButton = (props: Props) => {
  const intl = useIntl();
  return (
    <Tooltip title={intl.formatMessage({ id: 'common.refresh' })}>
      <FontAwesomeIcon
        icon={faRotateLeft}
        size="lg"
        className="cursor-pointer self-center"
        onClick={props.onClick}
        title="Làm mới"
      />
    </Tooltip>
  );
};
