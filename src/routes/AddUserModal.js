import { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Make sure auth is imported from your Firebase config file

const AddUserModal = ({ closeModal }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // New password input
  const [role, setRole] = useState('user');
  const firestore = getFirestore();

  const handleAddUser = async () => {
    try {
      // First, create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Then, add the user data to Firestore with the generated UID
      await addDoc(collection(firestore, 'users'), {
        uid: user.uid, // Store the UID from Firebase Auth
        name,
        email,
        role,
      });

      closeModal(); // Close the modal after successful user creation
    } catch (error) {
      console.error('Error adding user: ', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-xl">Add New User</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="border p-2 mt-4 w-full"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 mt-4 w-full"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border p-2 mt-4 w-full"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2 mt-4 w-full"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={handleAddUser} className="p-2 mt-4 bg-blue-500 text-white">Add User</button>
        <button onClick={closeModal} className="p-2 mt-4 bg-red-500 text-white">Cancel</button>
      </div>
    </div>
  );
};

export default AddUserModal;
