import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Transactions(){
  const [books,setBooks] = useState([]);
  const [msg,setMsg] = useState('');
  const userid = localStorage.getItem('userid');

  const loadBooks = async () => {
    const res = await API.get('/books');
    setBooks(res.data);
  };

  useEffect(()=>{ loadBooks(); }, []);

  const issue = async (bookId) => {
    try {
      await API.post('/transactions/issue', { bookId, userId: userid });
      setMsg('Book issued');
      loadBooks();
    } catch (err) { setMsg(err.response?.data?.message || 'Error'); }
  };

  const returnBook = async (bookId) => {
    try {
      await API.post('/transactions/return', { bookId, userId: userid });
      setMsg('Book returned');
      loadBooks();
    } catch (err) { setMsg(err.response?.data?.message || 'Error'); }
  };

  return (
    <div>
      <h2 className="text-xl mb-3">Transactions</h2>
      <div className="bg-white p-4 rounded shadow">
        <table className="w-full text-sm">
          <thead><tr><th>Title</th><th>Author</th><th>Available</th><th>Actions</th></tr></thead>
          <tbody>
            {books.map(b=>(
              <tr key={b._id} className="border-t">
                <td>{b.title}</td><td>{b.author}</td><td>{b.available}</td>
                <td className="space-x-2">
                  <button disabled={b.available < 1} onClick={()=>issue(b._id)} className="text-blue-600">Issue</button>
                  <button onClick={()=>returnBook(b._id)} className="text-green-600">Return</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {msg && <div className="mt-2 text-green-600">{msg}</div>}
      </div>
    </div>
  );
}
