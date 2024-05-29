import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router";
import { IRoute } from "../models/route";

const EmployeeList = lazy(() => import("../components/Employee-list"));
const Login = lazy(() => import("../components/Login"));

export const routeList: IRoute[] = [
  {
    id: 1,
    path: "/",
    component: () => <Navigate to={"/login"} />,
    exact: true,
    isProtectedRoute: false,
  },
  {
    id: 2,
    path: "/login",
    component: Login,
    exact: true,
    isProtectedRoute: false,
  },
  {
    id: 3,
    path: "/employee-list",
    component: EmployeeList,
    exact: true,
    isProtectedRoute: false,
  },
];
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {routeList.map((routeItem) => {
        const LazyComponent = routeItem.component as React.ComponentType;
        return (
          <Route
            key={routeItem.id}
            path={routeItem.path}
            element={
              <Suspense>
                <LazyComponent />
              </Suspense>
            }
          />
        );
      })}
    </Routes>
  );
};

export default AppRoutes;
