import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAH9OQOMaNYEyi1vzluNo2h6DU7fs2Favg",
  authDomain: "library-management-86b4e.firebaseapp.com",
  projectId: "library-management-86b4e",
  storageBucket: "library-management-86b4e.appspot.com",
  messagingSenderId: "757493896168",
  appId: "1:757493896168:web:678845c208a1b538ac4a5d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Export 'db', not 'firestore'
