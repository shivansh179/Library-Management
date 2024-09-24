import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [admins, setAdmins] = useState([]);
  const navigate = useNavigate();

  // Fetch admin emails from admin.json
  useEffect(() => {
    const fetchAdmins = async () => {
      const response = await fetch('/admin.json');
      const data = await response.json();
      setAdmins(data.admins);
    };
    fetchAdmins();
  }, []);

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = userCredential.user.email;

      // Check if email is in the list of admins
      if (admins.includes(userEmail)) {
        // Navigate to admin dashboard if email is an admin
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800">Sign In</h1>
        <div className="mt-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150"
          />
        </div>
        <div className="mt-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150"
          />
        </div>
        <button onClick={handleSignIn} className="mt-6 p-2 bg-blue-600 text-white rounded-md w-full hover:bg-blue-500 transition duration-150">
          Sign In
        </button>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default SignIn;
