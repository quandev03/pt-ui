import { FormattedMessage } from 'react-intl';

export const TotalTableMessage = (total: number) => {
  return (
    <>
      <FormattedMessage id="common.total" />
      {' ' + total + ' '}
      <FormattedMessage id="common.item" />
    </>
  );
};
