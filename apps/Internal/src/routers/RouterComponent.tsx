import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import ForgotPassword from 'apps/Internal/src/modules/Auth/pages/ForgotPassword';
import { compact } from 'lodash';
import { ReactElement, useCallback, useEffect, useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSupportGetMenu } from '../components/layouts/queryHooks';
import useConfigAppStore from '../components/layouts/store';
import useConfigAppNoPersistStore from '../components/layouts/store/useConfigAppNoPersistStore';
import { pathRoutes } from '../constants/routes';
import LoginPage from '../modules/Auth/pages/Login';
import NotFoundPage from '../modules/NotFound/page';
import PersonalInfoPage from '../modules/PersonalInfo/pages';
import SignPdf from '../modules/SubscriberOwnershipTransfer/page/SignPdf';
import WelcomePage from '../modules/WelcomePage';
import ProtectedRoute from './ProtectedRoute';
import { routes } from './routes';
import { Spin } from 'antd';

const Router = () => {
  const { urlsActive, setUrlsActive } = useConfigAppNoPersistStore();
  // console.log(urlsActive);

  const { isAuthenticated } = useConfigAppStore();
  const { data: menuData = [], isFetching } =
    useSupportGetMenu(isAuthenticated);

  const genRoutes = useCallback(
    (urlsActive: string[], routes: any[], action: ActionsTypeEnum) => {
      routes.forEach((e) => {
        const props = (e?.page as ReactElement)?.props;
        switch (action) {
          case ActionsTypeEnum.CREATE:
            if (
              props?.actionMode === ActionsTypeEnum.CREATE ||
              props?.actionType === ActionType.ADD
            )
              urlsActive.push(e.path);
            break;
          case ActionsTypeEnum.READ:
            if (
              props?.actionMode === ActionsTypeEnum.READ ||
              props?.actionType === ActionType.VIEW
            )
              urlsActive.push(e.path);
            break;
          case ActionsTypeEnum.UPDATE:
            if (
              props?.actionMode === ActionsTypeEnum.UPDATE ||
              props?.actionType === ActionType.EDIT
            )
              urlsActive.push(e.path);
            break;
          case ActionsTypeEnum.COPY:
            if (props?.actionType === ActionsTypeEnum.COPY)
              urlsActive.push(e.path);
            break;
        }
      });
    },
    []
  );

  useEffect(() => {
    if (!menuData.length) return;
    const allUrlsActive: string[] = [];
    menuData.forEach((item) => {
      allUrlsActive.push(item.uri);
      const activeRoutes = routes.filter((e) => e.path?.startsWith(item.uri));
      if (item.actions?.includes(ActionsTypeEnum.CREATE)) {
        allUrlsActive.push(item.uri + '/add');
        genRoutes(allUrlsActive, activeRoutes, ActionsTypeEnum.CREATE);
      }

      if (
        item.uri === pathRoutes.list_of_service_package &&
        item.actions?.includes(ActionsTypeEnum.CREATE)
      ) {
        allUrlsActive.push(pathRoutes.packageAuthorization());
      }

      if (item.actions?.includes(ActionsTypeEnum.READ)) {
        allUrlsActive.push(item.uri + '/view/:id');
        genRoutes(allUrlsActive, activeRoutes, ActionsTypeEnum.READ);
      }

      if (
        item.uri === pathRoutes.verificationListStaff &&
        item.actions?.includes(ActionsTypeEnum.READ)
      ) {
        allUrlsActive.push(pathRoutes.censorship_history_view());
        allUrlsActive.push(pathRoutes.censorship_history_edit());
      }

      if (item.uri === pathRoutes.productCatalog) {
        if (item.actions?.includes(ActionsTypeEnum.CREATE)) {
          allUrlsActive.push(pathRoutes.productGroupAdd);
        }
        if (item.actions?.includes(ActionsTypeEnum.UPDATE)) {
          allUrlsActive.push(pathRoutes.productGroupEdit());
        }
        if (item.actions?.includes(ActionsTypeEnum.READ)) {
          allUrlsActive.push(pathRoutes.productGroupView());
        }
      }

      if (
        item.uri === pathRoutes.searchSubscription &&
        item.actions?.includes(ActionsTypeEnum.READ)
      ) {
        allUrlsActive.push(pathRoutes.searchSubscriptionImpactHistory());
        allUrlsActive.push(pathRoutes.searchSubscriptionPackageHistory());
        allUrlsActive.push(pathRoutes.searchSubscriptionPackageCapacity());
        allUrlsActive.push(pathRoutes.searchSubscriptionSmsHistory());
      }

      if (
        item.uri === pathRoutes.searchSubscriptionStaff &&
        item.actions?.includes(ActionsTypeEnum.READ)
      ) {
        allUrlsActive.push(pathRoutes.searchSubscriptionStaffImpactHistory());
        allUrlsActive.push(pathRoutes.searchSubscriptionStaffPackageHistory());
        allUrlsActive.push(pathRoutes.searchSubscriptionStaffPackageCapacity());
        allUrlsActive.push(pathRoutes.searchSubscriptionStaffSmsHistory());
      }

      if (item.uri === pathRoutes.subscriberNoImpact) {
        allUrlsActive.push(pathRoutes.subscriberImpactByFile);
      }

      if (
        item.uri === pathRoutes.businessManagement &&
        item.actions?.includes(ActionsTypeEnum.READ)
      ) {
        allUrlsActive.push(pathRoutes.subscriberEnterpriseView());
        allUrlsActive.push(pathRoutes.representativeAdd());
        allUrlsActive.push(pathRoutes.representativeView());
        allUrlsActive.push(pathRoutes.representativeEdit());
        allUrlsActive.push(pathRoutes.enterpriseHistory());
        allUrlsActive.push(pathRoutes.enterpriseHistoryDetail());
      }

      if (
        item.uri === pathRoutes.partnerCreditLimits &&
        item.actions?.includes(ActionsTypeEnum.READ)
      ) {
        allUrlsActive.push(pathRoutes.partnerCreditLimitsDebt());
      }

      if (item.actions?.includes(ActionsTypeEnum.UPDATE)) {
        allUrlsActive.push(item.uri + '/edit/:id');
        genRoutes(allUrlsActive, activeRoutes, ActionsTypeEnum.UPDATE);
      }

      if (
        item.uri === pathRoutes.partnerCreditLimits &&
        item.actions?.includes(ActionsTypeEnum.UPDATE)
      ) {
        allUrlsActive.push(pathRoutes.partnerDebtAdjustment());
      }
      if (item.actions?.includes(ActionsTypeEnum.COPY)) {
        allUrlsActive.push(item.uri + '/copy/:id');
        genRoutes(allUrlsActive, activeRoutes, ActionsTypeEnum.COPY);
      }
      if (item.uri === pathRoutes.partnerCatalog) {
        // partner-catalog
        if (item.actions?.includes(ActionsTypeEnum.PARTNER_USER_MANAGER)) {
          allUrlsActive.push(pathRoutes.partnerCatalogUserManagement());
          allUrlsActive.push(pathRoutes.partnerCatalogUserAdd());
          allUrlsActive.push(pathRoutes.partnerCatalogUserEdit());
          allUrlsActive.push(pathRoutes.partnerCatalogUserView());
        }
      }
      if (item.uri === pathRoutes.internalWarehouseDeliveryNote) {
        if (item.actions?.includes(ActionsTypeEnum.CREATE)) {
          allUrlsActive.push(pathRoutes.internalExportWarehouseDeliveryNoteAdd);
        }
        if (item.actions?.includes(ActionsTypeEnum.CREATE)) {
          allUrlsActive.push(pathRoutes.internalImportWarehouseDeliveryNoteAdd);
        }
        if (item.actions?.includes(ActionsTypeEnum.READ)) {
          allUrlsActive.push(
            pathRoutes.internalImportWarehouseDeliveryNoteView()
          );
        }
      }
      if (item.uri === pathRoutes.internalImportExportWarehouse) {
        if (item.actions?.includes(ActionsTypeEnum.CREATE)) {
          allUrlsActive.push(pathRoutes.internalExportWarehouseAdd);
          allUrlsActive.push(pathRoutes.internalImportWarehouseAdd);
          allUrlsActive.push(pathRoutes.internalExportWarehouseView());
          allUrlsActive.push(pathRoutes.internalImportWarehouseView());
        }
      }
      if (item.uri === pathRoutes.transactionSearchImportExport) {
        if (item.actions?.includes(ActionsTypeEnum.READ)) {
          allUrlsActive.push(pathRoutes.transactionSearchInternalExportView());
          allUrlsActive.push(pathRoutes.transactionSearchInternalImportView());
          allUrlsActive.push(pathRoutes.transactionSearchExportView());
          allUrlsActive.push(pathRoutes.transactionSearchImportView());
          allUrlsActive.push(pathRoutes.transactionSearchMerchantEximView());
          allUrlsActive.push(
            pathRoutes.transactionSearchInternalExportEximDistributor()
          );
          allUrlsActive.push(pathRoutes.transactionSearchExportKitView());
          allUrlsActive.push(pathRoutes.transactionSearchImportKitView());
          allUrlsActive.push(pathRoutes.transactionSearchExportSimView());
          allUrlsActive.push(pathRoutes.transactionSearchImportSimView());
        }
      }
      if (item.uri === pathRoutes.shippingReport) {
        allUrlsActive.push(pathRoutes.shippingReportDetail());
      }
    });
    setUrlsActive(compact(allUrlsActive));
  }, [menuData, setUrlsActive, isAuthenticated]);

  const currentRoutes = useMemo(() => {
    const result = routes.filter((value) => {
      return urlsActive?.some((v: string) => value.path === v);
    });
    if (isAuthenticated) {
      result.push(
        {
          path: pathRoutes.welcome,
          page: <WelcomePage />,
        },
        {
          path: pathRoutes.profile,
          page: <PersonalInfoPage />,
        },
        {
          path: '/',
          page: <WelcomePage />,
        }
      );
    }
    return result;
  }, [urlsActive, isAuthenticated]);

  if (isFetching && !urlsActive.length) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Spin />
      </div>
    );
  }
  return (
    <Routes>
      {currentRoutes?.map((item, index) => {
        return (
          <Route
            path={item.path}
            key={index}
            element={<ProtectedRoute element={item.page} />}
          />
        );
      })}
      <Route path={pathRoutes.login} element={<LoginPage />} />
      <Route path={pathRoutes.forgotPassword} element={<ForgotPassword />} />
      <Route path={'/ownership-transfer'} element={<SignPdf />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default Router;
