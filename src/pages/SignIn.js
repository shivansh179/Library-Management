import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore'; 

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
        // // Check if the user is a valid user in Firestore
        // const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

        // // Log the userDoc to inspect its structure
        // console.log('User Document Exists:', userDoc.exists());

        // if (userDoc.exists()) {
        //   const userData = userDoc.data();
        //   console.log('User Data:', userData); // Log user data to inspect

          // Check user role
          // if (userData.role === 'user') {
            navigate('/user/dashboard');
          // } else {
          //   setError('User role is not valid');
          // }
        // } else {
        //   setError('User not found in Firestore');
        // }
      // }
    }
    } catch (error) {
      setError(error.message);
    }
  };
  
  return (
    <div className="p-4 bg-red-400">
      <h1 className="text-2xl">Sign In</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border p-2 mt-4"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="border p-2 mt-4"
      />
      <button onClick={handleSignIn} className="p-2 mt-4 bg-blue-500 text-white">Sign In</button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default SignIn;
