import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

const UserDashboard = () => {
  const [books, setBooks] = useState([]);
  const [bookRequests, setBookRequests] = useState([]);
  const [user] = useState({ name: 'John Doe', email: 'john@example.com' }); // Replace with actual user data

  const fetchBooks = async () => {
    const booksCollection = await getDocs(collection(db, 'books'));
    setBooks(booksCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchBookRequests = async () => {
    const bookRequestsCollection = collection(db, 'bookRequests');
    const bookRequestsSnapshot = await getDocs(bookRequestsCollection);
    setBookRequests(bookRequestsSnapshot.docs.map(doc => doc.data()));
  };

  const applyForBook = async (book) => {
    const alreadyApplied = bookRequests.some(request => request.bookTitle === book.title && request.userEmail === user.email);
    if (alreadyApplied) return;

    const today = new Date();
    const returnDate = new Date(today);
    returnDate.setDate(today.getDate() + 15);

    await addDoc(collection(db, 'bookRequests'), {
      userName: user.name,
      userEmail: user.email,
      bookTitle: book.title,
      requestDate: Timestamp.fromDate(today),
      returnDate: Timestamp.fromDate(returnDate),
      status: 'pending',
    });
    alert(`Applied for ${book.title}`);
    fetchBookRequests();
  };

  useEffect(() => {
    fetchBooks();
    fetchBookRequests();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">User Dashboard</h1>
      {/* Available Books */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Available Books</h2>
        <ul className="divide-y divide-gray-200">
          {books.map(book => {
            const appliedForBook = bookRequests.some(request => request.bookTitle === book.title && request.userEmail === user.email);
            const requestStatus = bookRequests.find(request => request.bookTitle === book.title && request.userEmail === user.email)?.status;

            return (
              <li key={book.id} className="py-2 flex justify-between">
                <span>{book.title}</span>
                <button
                  onClick={() => applyForBook(book)}
                  className={`p-2 rounded ${appliedForBook ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                  disabled={appliedForBook}
                >
                  {requestStatus === 'pending' && 'Applied'}
                  {requestStatus === 'accepted' && 'Issued'}
                  {requestStatus === 'rejected' && 'Rejected'}
                  {!appliedForBook && 'Apply for Book'}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default UserDashboard;
