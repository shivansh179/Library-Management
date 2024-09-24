import { Outlet, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const UserRoute = () => {
  const [user] = useAuthState(auth);
  
  return user ? <Outlet /> : <Navigate to="/signin" />;
};

export default UserRoute;
