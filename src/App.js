import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import AdminRoute from './routes/AdminRoute';
import UserRoute from './routes/UserRoute';
 
function App() {
  return (
    <Router>
      <Routes>
         
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* User Dashboard */}
        <Route path="/user" element={<UserRoute />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
