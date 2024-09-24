import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

const AddBookModal = ({ closeModal }) => {
  const [bookTitle, setBookTitle] = useState('');
  const [quantity, setQuantity] = useState(1);

  const addBook = async () => {
    if (bookTitle.trim() === '') return;

    await addDoc(collection(db, 'books'), {
      title: bookTitle,
      quantity: parseInt(quantity),
    });
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add Book</h2>
        <input
          type="text"
          className="border p-2 w-full mb-4"
          placeholder="Book Title"
          value={bookTitle}
          onChange={(e) => setBookTitle(e.target.value)}
        />
        <input
          type="number"
          className="border p-2 w-full mb-4"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <button onClick={addBook} className="p-2 bg-green-500 text-white rounded mr-2">
          Add Book
        </button>
        <button onClick={closeModal} className="p-2 bg-red-500 text-white rounded">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddBookModal;
