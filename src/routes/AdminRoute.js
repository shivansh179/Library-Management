import { Outlet, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const AdminRoute = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while the auth state is being resolved
  }

  if (error) {
    console.error("Authentication error:", error);
    return <Navigate to="/" />;
  }

  // Logic to check if user is admin
  const isAdmin = user && user.email === 'admin@example.com';

  return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
