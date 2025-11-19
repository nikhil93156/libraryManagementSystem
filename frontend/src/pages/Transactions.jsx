import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom'; // Assuming you use react-router

export default function Transactions() {
  const [books, setBooks] = useState([]);
  const [msg, setMsg] = useState('');
  const [fine, setFine] = useState(0); // Track if user owes money
  const userid = localStorage.getItem('userid');
  const navigate = useNavigate();

  const loadBooks = async () => {
    try {
      const res = await API.get('/books');
      setBooks(res.data);
    } catch (err) {
      console.error("Failed to load books");
    }
  };

  useEffect(() => { loadBooks(); }, []);

  // --- ACTIONS ---

  const handleLogout = () => {
    localStorage.removeItem('userid');
    localStorage.removeItem('token'); // If you use tokens
    navigate('/login'); // Redirect to login
  };

  const issue = async (bookId) => {
    try {
      await API.post('/transactions/issue', { bookId, userId: userid });
      setMsg('Book issued successfully!');
      setFine(0);
      loadBooks();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error issuing book');
    }
  };

  const returnBook = async (bookId) => {
    try {
      const res = await API.post('/transactions/return', { bookId, userId: userid });
      
      // Check if backend returned a fine amount
      if (res.data.fineAmount > 0) {
        setFine(res.data.fineAmount);
        setMsg(`Book returned. You have a fine of $${res.data.fineAmount}`);
      } else {
        setMsg('Book returned successfully. No fine.');
        setFine(0);
      }
      
      loadBooks();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error returning book');
    }
  };

  const payFine = async () => {
    try {
      await API.post('/transactions/pay-fine', { userId: userid, amount: fine });
      setMsg('Fine paid successfully!');
      setFine(0);
    } catch (err) {
      setMsg('Error processing payment');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      
      {/* Header with Logout */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Library Transactions</h2>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Log Out
        </button>
      </div>

      {/* Fine Notification Section */}
      {fine > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span><strong>Alert:</strong> You have an outstanding fine of ${fine}.</span>
          <button 
            onClick={payFine}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800"
          >
            Pay Fine Now
          </button>
        </div>
      )}

      {/* Feedback Message */}
      {msg && <div className="mb-4 p-2 bg-blue-100 text-blue-700 rounded text-center">{msg}</div>}

      {/* Book List */}
      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border-b">Title</th>
              <th className="p-3 border-b">Author</th>
              <th className="p-3 border-b">Available Copies</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(b => (
              <tr key={b._id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{b.title}</td>
                <td className="p-3 border-b">{b.author}</td>
                <td className="p-3 border-b font-semibold">
                  {b.available > 0 ? (
                    <span className="text-green-600">{b.available}</span>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )}
                </td>
                <td className="p-3 border-b space-x-2">
                  {/* ISSUE BUTTON */}
                  <button 
                    disabled={b.available < 1} 
                    onClick={() => issue(b._id)} 
                    className={`px-3 py-1 rounded ${b.available < 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                  >
                    Issue
                  </button>

                  {/* RETURN BUTTON */}
                  <button 
                    onClick={() => returnBook(b._id)} 
                    className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
                  >
                    Return
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
