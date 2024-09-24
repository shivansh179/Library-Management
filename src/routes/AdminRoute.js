import { Outlet, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const AdminRoute = () => {
  const [user] = useAuthState(auth);

  // Logic to check if user is admin (you can modify based on your logic)
  const isAdmin = user && user.email === 'admin@example.com';

  return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
