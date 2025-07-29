import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';

const ProductCatalogPage = lazy(() => import('./pages'));
const ProductCatalogAddPage = lazy(() =>
  import('./pages/Branch').then(({ ProductCatalogAddPage }) => ({
    default: ProductCatalogAddPage,
  }))
);
const ProductCatalogEditPage = lazy(() =>
  import('./pages/Branch').then(({ ProductCatalogEditPage }) => ({
    default: ProductCatalogEditPage,
  }))
);
const ProductCatalogViewPage = lazy(() =>
  import('./pages/Branch').then(({ ProductCatalogViewPage }) => ({
    default: ProductCatalogViewPage,
  }))
);

const ProductGroupAddPage = lazy(() =>
  import('./pages/Branch').then(({ ProductGroupAddPage }) => ({
    default: ProductGroupAddPage,
  }))
);
const ProductGroupEditPage = lazy(() =>
  import('./pages/Branch').then(({ ProductGroupEditPage }) => ({
    default: ProductGroupEditPage,
  }))
);
const ProductGroupViewPage = lazy(() =>
  import('./pages/Branch').then(({ ProductGroupViewPage }) => ({
    default: ProductGroupViewPage,
  }))
);

const productCatalogRoutes: RouterConfig[] = [
  {
    path: pathRoutes.productCatalog,
    page: <ProductCatalogPage />,
  },
  {
    path: pathRoutes.productCatalogAdd,
    page: <ProductCatalogAddPage />,
  },
  {
    path: pathRoutes.productCatalogEdit(),
    page: <ProductCatalogEditPage />,
  },
  {
    path: pathRoutes.productCatalogView(),
    page: <ProductCatalogViewPage />,
  },
  {
    path: pathRoutes.productGroupAdd,
    page: <ProductGroupAddPage />,
  },
  {
    path: pathRoutes.productGroupEdit(),
    page: <ProductGroupEditPage />,
  },
  {
    path: pathRoutes.productGroupView(),
    page: <ProductGroupViewPage />,
  },
];

export default productCatalogRoutes;
