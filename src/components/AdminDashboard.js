import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, addDoc, doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { FaBook, FaClipboardList, FaPlusCircle, FaListAlt } from 'react-icons/fa'; // Added FaListAlt for Issued Books icon

const AdminDashboard = () => {
  const [bookRequests, setBookRequests] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]); // New state for issued books
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [issueDate, setIssueDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [remarks, setRemarks] = useState('');

  const [newBookName, setNewBookName] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookQuantity, setNewBookQuantity] = useState(1);

  const [activeSection, setActiveSection] = useState('requests'); // Default section

  useEffect(() => {
    const fetchBookRequests = async () => {
      const bookRequestsCollection = collection(db, 'bookRequests');
      const bookRequestsSnapshot = await getDocs(bookRequestsCollection);
      setBookRequests(bookRequestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const fetchIssuedBooks = async () => {
      const issuedBooksCollection = collection(db, 'issueDetails'); // Fetch from issueDetails collection
      const issuedBooksSnapshot = await getDocs(issuedBooksCollection);
      setIssuedBooks(issuedBooksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchBookRequests();
    fetchIssuedBooks(); // Fetch issued books on component mount
  }, []);

  const handleBookRequest = async (requestId, action) => {
    const requestDoc = doc(db, 'bookRequests', requestId);
    if (action === 'rejected') {
      const reason = prompt('Please provide a reason for rejection:');
      if (!reason) return;

      await updateDoc(requestDoc, { status: 'rejected', rejectionReason: reason });
      alert('Book request rejected and status updated.');
    } else if (action === 'accepted') {
      const bookRequest = bookRequests.find(request => request.id === requestId);
      setSelectedRequest(bookRequest);
      setActiveSection('issue'); // Set active section to 'issue'
    }
  };

  const issueBook = async () => {
    if (!issueDate || !returnDate) {
      alert('Please select valid issue and return dates.');
      return;
    }

    const issueDetailsCollectionRef = collection(db, 'issueDetails');
    await addDoc(issueDetailsCollectionRef, {
      userName: selectedRequest.userName,
      bookTitle: selectedRequest.bookTitle,
      author: selectedRequest.authorName,
      issueDate: Timestamp.fromDate(new Date(issueDate)),
      returnDate: Timestamp.fromDate(new Date(returnDate)),
      remarks: remarks || '',
    });

    await deleteDoc(doc(db, 'bookRequests', selectedRequest.id));
    alert('Book issued successfully and request removed from book requests.');
    setSelectedRequest(null);
    setIssueDate('');
    setReturnDate('');
    setRemarks('');

    // Fetch issued books again after issuing a book
    const issuedBooksCollection = collection(db, 'issueDetails');
    const issuedBooksSnapshot = await getDocs(issuedBooksCollection);
    setIssuedBooks(issuedBooksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const addNewBook = async () => {
    if (!newBookName || !newBookAuthor || newBookQuantity < 1) {
      alert('Please fill in all fields correctly.');
      return;
    }

    const booksCollectionRef = collection(db, 'books');
    await addDoc(booksCollectionRef, {
      bookName: newBookName,
      author: newBookAuthor,
      quantity: newBookQuantity,
    });

    alert('New book added successfully.');
    setNewBookName('');
    setNewBookAuthor('');
    setNewBookQuantity(1);
  };

  return (
    <div className="p-6 bg-gradient-to-r from-purple-300 to-blue-300 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-white">Admin Dashboard</h1>

      <div className="mt-8 flex justify-around">
        <button
          onClick={() => setActiveSection('requests')}
          className={`flex items-center p-3 rounded-lg transition duration-300 ${
            activeSection === 'requests' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'
          }`}
        >
          <FaClipboardList className="mr-2" /> Book Requests
        </button>
        <button
          onClick={() => setActiveSection('issue')}
          className={`flex items-center p-3 rounded-lg transition duration-300 ${
            activeSection === 'issue' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'
          }`}
        >
          <FaBook className="mr-2" /> Issue Book
        </button>
        <button
          onClick={() => setActiveSection('add')}
          className={`flex items-center p-3 rounded-lg transition duration-300 ${
            activeSection === 'add' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'
          }`}
        >
          <FaPlusCircle className="mr-2" /> Add New Book
        </button>
        <button
          onClick={() => setActiveSection('issued')} // Button for displaying issued books
          className={`flex items-center p-3 rounded-lg transition duration-300 ${
            activeSection === 'issued' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'
          }`}
        >
          <FaListAlt className="mr-2" /> Issued Books
        </button>
      </div>

      {activeSection === 'requests' && (
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800">Book Requests</h2>
          <ul className="divide-y divide-gray-200">
            {bookRequests.map(request => (
              <li key={request.id} className="py-4">
                <div className="mb-2">
                  <p><strong className="text-blue-600">Book Title:</strong> {request.bookTitle}</p>
                  <p><strong className="text-blue-600">Author:</strong> {request.authorName}</p>
                  <p><strong className="text-blue-600">User Name:</strong> {request.userName}</p>
                  <p><strong className="text-blue-600">User Email:</strong> {request.userEmail}</p>
                  <p><strong className="text-blue-600">Requested At:</strong> 
                    {request.requestTime ? 
                      new Date(request.requestTime.seconds * 1000).toLocaleString() :
                      'N/A'}
                  </p>
                  <p><strong className="text-blue-600">Status:</strong> {request.status}</p>
                  {request.rejectionReason && (
                    <p><strong className="text-red-500">Rejection Reason:</strong> {request.rejectionReason}</p>
                  )}
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleBookRequest(request.id, 'accepted')}
                    className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
                  >
                    Issue Book
                  </button>
                  <button
                    onClick={() => handleBookRequest(request.id, 'rejected')}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

{activeSection === 'issue' && selectedRequest && (
  <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-2xl font-semibold text-gray-800">Issue Book</h2>
    <div className="mt-4">
      <p><strong className="text-blue-600">Book Title:</strong> {selectedRequest.bookTitle}</p>
      <p><strong className="text-blue-600">Author:</strong> {selectedRequest.authorName}</p>
      <label className="block mt-4">
        Issue Date:
        <input
          type="date"
          value={issueDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={e => {
            const selectedDate = e.target.value;
            setIssueDate(selectedDate);

            // Calculate return date as 15 days from selected issue date
            const returnDate = new Date(selectedDate);
            returnDate.setDate(returnDate.getDate() + 15);
            setReturnDate(returnDate.toISOString().split('T')[0]); // Update return date state
          }}
          className="block w-full mt-1 p-2 border rounded"
        />
      </label>
      <label className="block mt-4">
        Return Date:
        <input
          type="date"
          value={returnDate}
          readOnly // Make this input read-only as it's auto-calculated
          className="block w-full mt-1 p-2 border rounded bg-gray-200" // Add styling to indicate it's read-only
        />
      </label>
      <label className="block mt-4">
        Remarks (Optional):
        <textarea
          value={remarks}
          onChange={e => setRemarks(e.target.value)}
          className="block w-full mt-1 p-2 border rounded"
        />
      </label>
      <button
        onClick={issueBook}
        className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
      >
        Confirm Issue
      </button>
    </div>
  </div>
)}


      {activeSection === 'add' && (
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800">Add New Book</h2>
          <div className="mt-4">
            <label className="block mt-4">
              Book Name:
              <input
                type="text"
                value={newBookName}
                onChange={e => setNewBookName(e.target.value)}
                className="block w-full mt-1 p-2 border rounded"
              />
            </label>
            <label className="block mt-4">
              Author Name:
              <input
                type="text"
                value={newBookAuthor}
                onChange={e => setNewBookAuthor(e.target.value)}
                className="block w-full mt-1 p-2 border rounded"
              />
            </label>
            <label className="block mt-4">
              Quantity:
              <input
                type="number"
                value={newBookQuantity}
                onChange={e => setNewBookQuantity(Number(e.target.value))}
                className="block w-full mt-1 p-2 border rounded"
                min="1"
              />
            </label>
            <button
              onClick={addNewBook}
              className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            >
              Add Book
            </button>
          </div>
        </div>
      )}

      {activeSection === 'issued' && ( // New section for displaying issued books
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800">Issued Books</h2>
          <ul className="divide-y divide-gray-200">
            {issuedBooks.map(issue => (
              <li key={issue.id} className="py-4">
                <p><strong className="text-blue-600">User Name:</strong> {issue.userName}</p>
                <p><strong className="text-blue-600">Book Title:</strong> {issue.bookTitle}</p>
                <p><strong className="text-blue-600">Author:</strong> {issue.author}</p>
                <p><strong className="text-blue-600">Issue Date:</strong> 
                  {issue.issueDate ? 
                    new Date(issue.issueDate.seconds * 1000).toLocaleString() :
                    'N/A'}
                </p>
                <p><strong className="text-blue-600">Return Date:</strong> 
                  {issue.returnDate ? 
                    new Date(issue.returnDate.seconds * 1000).toLocaleString() :
                    'N/A'}
                </p>
                <p><strong className="text-blue-600">Remarks:</strong> {issue.remarks || 'N/A'}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
