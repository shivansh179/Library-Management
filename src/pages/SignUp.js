import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await addDoc(collection(db, 'users'), { name, email, uid: user.uid });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl">Sign Up</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="border p-2 mt-4"
      />
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
      <button onClick={handleSignUp} className="p-2 mt-4 bg-blue-500 text-white">Sign Up</button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default SignUp;
