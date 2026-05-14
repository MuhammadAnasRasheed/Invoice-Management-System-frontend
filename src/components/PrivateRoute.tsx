import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hook';

export const PrivateRoute = () => {
  const { token } = useAppSelector((state) => state.auth);
  return token ? <Outlet /> : <Navigate to="/login" />;
};