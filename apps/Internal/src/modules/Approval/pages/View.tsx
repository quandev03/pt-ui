import { CButtonClose } from '@react/commons/Button';
import ButtonApprove from '@react/commons/Button/ButtonApprove';
import ButtonRefuse from '@react/commons/Button/ButtonRefuse';
import { ApprovalObject, ApprovalProcessCode } from '@react/commons/types';
import { ActionType } from '@react/constants/app';
import { decodeSearchParams } from '@react/helpers/utils';
import { Result, Row, Space } from 'antd';
import InternalExportProposal from 'apps/Internal/src/modules/InternalExportProposalSend/page/add';
import MerchantOrder from 'apps/Internal/src/modules/MerchantOrder/pages/AddView';
import Order from 'apps/Internal/src/modules/Order/pages/ActionOrder';
import UploadOrder from 'apps/Internal/src/modules/SimUploadForm/page/ActionUploadForm';
import { includes } from 'lodash';
import { useMemo, useState } from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import InternalExportProposalSend from '../../InternalExportProposalSend/components/ModalAddView';
import { useViewOrder } from '../../MerchantOrder/hooks/useViewOrder';
import ActionPartnerCatalog from '../../PartnerCatalog/pages/ActionPartnerCatalog';
import DistributeNumber from '../../DistributeNumber/page/ActionPage';
import AirtimeBonusTransactionPartner from '../../AirtimeBonusTransactionPartner/pages/add';
import ModalConfirm from '../components/ModalConfirm';
import { useCheckApproval } from '../hooks/useCheckApproval';
import { useHandleApproval } from '../hooks/useHandleApproval';
import { AddEditViewProps, ApprovalStatus } from '../types';
import TransferNumber from '../../TransferNumber/page/ActionPage';
import RevokeNumber from '../../RevokeNumber/page/ActionPage';
import UploadNumber from '../../UploadNumber/page/ActionPage';
import { RedirectLocationState } from '../../Auth/components/LoginButton';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useDecryptOperationsId } from 'apps/Internal/src/hooks/useDecryptOperationsId';

const ViewPage: React.FC<AddEditViewProps> = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { object, approvalId, processCode } = decodeSearchParams(searchParams);
  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [isOpenConfirm, setIsOpenConfirm] = useState<boolean>(false);
  const { mutate: mutateApproval } = useHandleApproval();
  const { data: idDecrypt } = useDecryptOperationsId(
    id as string,
    object === ApprovalObject.SALE_ORDER
  );
  const { data: isCheckApproval, refetch: refetchCheckApproval } =
    useCheckApproval({
      objectName: object,
      recordId: object === ApprovalObject.SALE_ORDER ? idDecrypt : id,
    });
  const { data: dataOrder, isFetching: isLoadingOrder } = useViewOrder(
    id,
    object === ApprovalObject.DELIVERY_ORDER
  );

  const handleCancel = () => {
    if (locationState) {
      // state is any by default
      const { redirectTo } = locationState as RedirectLocationState;
      navigate(`${redirectTo.pathname}${redirectTo.search}`);
    } else {
      navigate(pathRoutes.approval);
    }
  };

  const getNumberManager = (processCode: ApprovalProcessCode) => {
    switch (processCode) {
      case ApprovalProcessCode.NUMBER_DISTRIBUTION:
        return <DistributeNumber isEnabledApproval />;
      case ApprovalProcessCode.TRANSFER_WAREHOUSE:
        return <TransferNumber isEnabledApproval typeModal={ActionType.VIEW} />;
      case ApprovalProcessCode.BACK_NUMBER:
        return <RevokeNumber isEnabledApproval typeModal={ActionType.VIEW} />;
      case ApprovalProcessCode.UPLOAD_NUMBER:
        return <UploadNumber isEnabledApproval actionType={ActionType.VIEW} />;
      default:
        return (
          <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
          />
        );
    }
  };

  const getContent = useMemo(() => {
    switch (object) {
      case ApprovalObject.SALE_ORDER:
        return <Order isEnabledApproval />;
      case ApprovalObject.ORGANIZATION_UNIT:
        return <ActionPartnerCatalog isEnabledApproval />;
      case ApprovalObject.AIR_TIME_TRANSACTION:
        return (
          <AirtimeBonusTransactionPartner
            typeModal={ActionType.VIEW}
            isEnabledApproval
          />
        );
      case ApprovalObject.DELIVERY_ORDER:
        if (!dataOrder) return;
        if (dataOrder?.supplierId) {
          // supplierId cua don hang NCC
          return (
            <MerchantOrder isEnabledApproval actionType={ActionType.VIEW} />
          );
        }
        return (
          <InternalExportProposal
            isEnabledApproval
            actionType={ActionType.VIEW}
          />
        );
      case ApprovalObject.ISDN_TRANSACTION:
        return getNumberManager(processCode);
      case ApprovalObject.DELEVERY_ORDER:
        return (
          <InternalExportProposalSend
            isEnabledApproval
            actionType={ActionType.VIEW}
          />
        );
      case ApprovalObject.STOCK_PRODUCT_UPLOAD_ORDER:
        return <UploadOrder isEnabledApproval />;
      default:
        return (
          <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
          />
        );
    }
  }, [isLoadingOrder, dataOrder, processCode, object]);

  const handleApprove = (status: ApprovalStatus) => {
    setIsApproved(!!status);
    setIsOpenConfirm(true);
  };
  const handleSubmitConfirm = (values: any, handleCancel: () => void) => {
    mutateApproval(
      {
        id: approvalId,
        status: +isApproved,
        message: values.message,
      },
      {
        onSuccess: () => {
          refetchCheckApproval();
          handleCancel();
        },
      }
    );
  };
  return (
    <div>
      {getContent}
      {includes(Object.values(ApprovalObject), object) && getContent && (
        <Row justify="end" className="mt-4">
          <Space size="small">
            {isCheckApproval && (
              <>
                <ButtonRefuse
                  onClick={() => handleApprove(ApprovalStatus.REFUSE)}
                />
                <ButtonApprove
                  onClick={() => handleApprove(ApprovalStatus.APPROVAl)}
                />
              </>
            )}
            <CButtonClose type="default" onClick={handleCancel} />
          </Space>
        </Row>
      )}
      <ModalConfirm
        onSubmit={handleSubmitConfirm}
        isOpen={isOpenConfirm}
        setIsOpen={setIsOpenConfirm}
        isApproved={isApproved}
      />
    </div>
  );
};

export default ViewPage;
