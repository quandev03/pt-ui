import { lazy } from "react";
import { RouterConfig } from "../../routers/ProtectedRoute";
import { pathRoutes } from "../../constants/routes";

const PageAdd = lazy(() => import('./pages/index'));
const routes: RouterConfig[] = [
    {
        path: pathRoutes.sellBatchPackage,
        page: <PageAdd />,
    },
]
export default routes;