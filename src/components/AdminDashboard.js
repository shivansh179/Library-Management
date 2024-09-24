import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, addDoc , deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Timestamp } from 'firebase/firestore';

const AdminDashboard = () => {
  const [bookRequests, setBookRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [issueDate, setIssueDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    const fetchBookRequests = async () => {
      const bookRequestsCollection = collection(db, 'bookRequests');
      const bookRequestsSnapshot = await getDocs(bookRequestsCollection);
      setBookRequests(bookRequestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchBookRequests();
  }, []);

  const handleBookRequest = async (requestId, action) => {
    const requestDoc = doc(db, 'bookRequests', requestId);
    if (action === 'rejected') {
      const reason = prompt('Please provide a reason for rejection:');
      if (!reason) return;
      await updateDoc(requestDoc, { status: 'rejected', rejectionReason: reason });
      alert('Book request rejected.');
    } else if (action === 'accepted') {
      const bookRequest = bookRequests.find(request => request.id === requestId);
      setSelectedRequest(bookRequest);
    }
  };

  const issueBook = async () => {
    if (!issueDate || !returnDate) {
      alert('Please select valid issue and return dates.');
      return;
    }

    const issueCollectionRef = collection(db, 'issue');
    await addDoc(issueCollectionRef, {
      userName: selectedRequest.userName,
      bookTitle: selectedRequest.bookTitle,
      issueDate: Timestamp.fromDate(new Date(issueDate)),
      returnDate: Timestamp.fromDate(new Date(returnDate)),
      remarks: remarks || '',
    });

    await updateDoc(doc(db, 'bookRequests', selectedRequest.id), { status: 'accepted' });
    alert('Book issued successfully.');
    setSelectedRequest(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      {/* Book Requests */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Book Requests</h2>
        <ul className="divide-y divide-gray-200">
          {bookRequests.map(request => (
            <li key={request.id} className="py-2 flex justify-between">
              <span>{request.bookTitle} requested by {request.userName}</span>
              <div className="flex space-x-4">
                <button onClick={() => handleBookRequest(request.id, 'accepted')} className="p-2 bg-green-500 text-white rounded">
                  Issue Book
                </button>
                <button onClick={() => handleBookRequest(request.id, 'rejected')} className="p-2 bg-red-500 text-white rounded">
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Issue Book Form */}
      {selectedRequest && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Issue Book</h2>
          <div className="mt-4">
            <p><strong>Book Title:</strong> {selectedRequest.bookTitle}</p>
            <p><strong>Author:</strong> {selectedRequest.author}</p>
            <label className="block mt-4">
              Issue Date: 
              <input type="date" value={issueDate} min={new Date().toISOString().split('T')[0]} onChange={e => setIssueDate(e.target.value)} className="border p-2" />
            </label>
            <label className="block mt-4">
              Return Date (max 15 days from issue date): 
              <input type="date" value={returnDate} max={new Date(new Date(issueDate).setDate(new Date(issueDate).getDate() + 15)).toISOString().split('T')[0]} onChange={e => setReturnDate(e.target.value)} className="border p-2" />
            </label>
            <label className="block mt-4">
              Remarks (optional):
              <textarea value={remarks} onChange={e => setRemarks(e.target.value)} className="border p-2" />
            </label>
            <button onClick={issueBook} className="mt-4 bg-blue-500 text-white p-2 rounded">Issue Book</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
