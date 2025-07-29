import { Modal } from 'antd';
import ColseIcon from 'assets/imgs/CloseIcon.svg';
import useLanguageStore from 'languages/store';
import { IntlShape } from 'react-intl';
import CButton from '../Button';
import { StyledContentConfirm, StyledTitle } from './styles';
import { TypeCustom } from '../Button/enum';

interface ModalErrorProps {
  message: string;
}

const ModalError = (props: ModalErrorProps) => {
  const { message } = props;
  const { confirm, destroyAll } = Modal;

  const intl: IntlShape | undefined = useLanguageStore.getState().intl;

  confirm({
    title: (
      <StyledTitle>{intl?.formatMessage({ id: 'common.error' })}</StyledTitle>
    ),
    icon: null,
    closeIcon:<img src={ColseIcon} alt="Logo"  />,
    footer: null,
    closable: true,
    content: (
      <StyledContentConfirm>
        {message && <p>{intl?.formatMessage({ id: message })}</p>}
        <div className="btnWrap">
          <CButton
            typeCustom={TypeCustom.Primary}
            onClick={() => {
              destroyAll();
            }}
            className="btnConfirm"
          >
            {intl?.formatMessage({ id: 'common.accept' })}
          </CButton>
        </div>
      </StyledContentConfirm>
    ),
  });
};

export default ModalError;
