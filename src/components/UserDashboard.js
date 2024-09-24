import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [bookRequests, setBookRequests] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [returnBookId, setReturnBookId] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [fine, setFine] = useState(0);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [activeSection, setActiveSection] = useState('availableBooks');
  const [user] = useState({ name: 'John Doe', email: 'john@example.com' }); // Replace with actual user data

  const fetchBooks = async () => {
    const booksCollection = await getDocs(collection(db, 'books'));
    setBooks(booksCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchBookRequests = async () => {
    const bookRequestsCollection = collection(db, 'bookRequests');
    const bookRequestsSnapshot = await getDocs(bookRequestsCollection);
    setBookRequests(bookRequestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchIssuedBooks = async () => {
    const issuedBooksCollection = collection(db, 'issueDetails');
    const issuedBooksSnapshot = await getDocs(issuedBooksCollection);
    setIssuedBooks(issuedBooksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const applyForBook = async (book) => {
    const alreadyApplied = bookRequests.some(request => request.bookTitle === book.bookName && request.userEmail === user.email);
    if (alreadyApplied) return;

    const today = new Date();
    const returnDate = new Date(today);
    returnDate.setDate(today.getDate() + 15);

    await addDoc(collection(db, 'bookRequests'), {
      userName: user.name,
      userEmail: user.email,
      bookTitle: book.bookName,
      authorName: book.author,
      requestDate: Timestamp.fromDate(today),
      returnDate: Timestamp.fromDate(returnDate),
      status: 'pending',
    });

    alert(`Applied for ${book.bookName}`);
    fetchBookRequests(); // Refresh book requests after applying
  };

  const handleReturnBook = (book) => {
    setReturnBookId(book.id);
    setReturnDate(new Date().toISOString().split("T")[0]); // Set return date to current date
    setShowReturnForm(true);
  };

  const calculateFine = (issuedBook) => {
    const today = new Date();
    const returnDate = new Date(issuedBook.returnDate.seconds * 1000);
    const diffTime = today - returnDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert time difference to days
    return diffDays > 0 ? diffDays * 10 : 0; // Assume a fine of $10 per day
  };

  const returnBook = async () => {
    const issuedBook = issuedBooks.find(book => book.id === returnBookId);
    const fineAmount = calculateFine(issuedBook);
    
    if (fineAmount > 0) {
      alert(`You have a fine of $${fineAmount} for returning late.`);
      // Optionally, redirect to a fine payment page here
    }

    await deleteDoc(doc(db, 'issueDetails', returnBookId));
    alert('Book returned successfully!');
    setShowReturnForm(false);
    fetchIssuedBooks(); // Refresh issued books after returning
  };

  useEffect(() => {
    fetchBooks();
    fetchBookRequests();
    fetchIssuedBooks();
  }, []);

  const handleFine = () => {
    navigate("/user/fine");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-6">User Dashboard</h1>
      
      {/* Section Navigation Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        <button 
          onClick={() => setActiveSection('availableBooks')}
          className={`p-2 rounded ${activeSection === 'availableBooks' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}
        >
          Available Books
        </button>
        <button 
          onClick={() => setActiveSection('issuedBooks')}
          className={`p-2 rounded ${activeSection === 'issuedBooks' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}
        >
          Issued Books
        </button>
      </div>

      {/* Available Books Section */}
      {activeSection === 'availableBooks' && (
        <div className="bg-white shadow-lg rounded p-4">
          <h2 className="text-2xl font-semibold mb-4">Available Books</h2>
          <ul className="divide-y divide-gray-200">
            {books.map(book => {
              const userRequest = bookRequests.find(request => request.bookTitle === book.bookName && request.userEmail === user.email);
              // Check if the book is already issued to the user
              const alreadyIssued = issuedBooks.some(issued => issued.bookTitle === book.bookName && issued.userEmail === user.email);

              return (
                <li key={book.id} className="py-2 flex justify-between items-center">
                  <div>
                    <span className="font-bold">Title:</span> {book.bookName} <br />
                    <span className="font-bold">Author:</span> {book.author} <br />
                    <span className="font-bold">Quantity:</span> {book.quantity}
                  </div>

                  <div>
                    {alreadyIssued ? (
                      <button className="p-2 bg-gray-400 cursor-not-allowed rounded">
                        Already Issued
                      </button>
                    ) : userRequest ? (
                      <button className="p-2 bg-gray-400 cursor-not-allowed rounded">
                        {userRequest.status === 'pending' ? 'Pending' : userRequest.status === 'accepted' ? 'Issued' : `Rejected: ${userRequest.rejectionReason || 'No reason provided'}`}
                      </button>
                    ) : (
                      <button
                        onClick={() => applyForBook(book)}
                        className="p-2 bg-blue-500 text-white rounded"
                      >
                        Apply for Book
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Issued Books Section */}
      {activeSection === 'issuedBooks' && (
        <div className="bg-white shadow-lg rounded p-4">
          <h2 className="text-2xl font-semibold mb-4">Issued Books</h2>
          <ul className="divide-y divide-gray-200">
            {issuedBooks.map(book => (
              <li key={book.id} className="py-2 flex justify-between items-center">
                <div>
                  <span className="font-bold">Title:</span> {book.bookTitle} <br />
                  <span className="font-bold">Issued To:</span> {book.userName} <br />
                  <span className="font-bold">Return Date:</span> {new Date(book.returnDate.seconds * 1000).toLocaleDateString()}
                </div>
                <div>
                  <button
                    onClick={() => handleReturnBook(book)}
                    className="p-2 bg-red-500 text-white rounded"
                  >
                    Return Book
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Return Book Form */}
      {showReturnForm && (
        <div className="mt-6 border p-4 bg-white shadow-lg rounded">
          <h2 className="text-xl font-semibold">Return Book</h2>
          <p><strong>Return Date:</strong> {returnDate}</p>
          <button onClick={returnBook} className="mt-2 p-2 bg-green-500 text-white rounded">Confirm Return</button>
          <button onClick={() => setShowReturnForm(false)} className="mt-2 p-2 bg-gray-400 text-white rounded">Cancel</button>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
