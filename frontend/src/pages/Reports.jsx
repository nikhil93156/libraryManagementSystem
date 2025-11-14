import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Reports(){
  const [books,setBooks] = useState([]);
  const [transactions,setTransactions] = useState([]);
  const [category, setCategory] = useState('');

  const loadBooks = async () => {
    const res = await API.get('/books' + (category ? `?category=${category}` : ''));
    setBooks(res.data);
  };

  const loadTx = async () => {
    const res = await API.get('/transactions');
    setTransactions(res.data);
  };

  useEffect(()=>{ loadBooks(); loadTx(); }, [category]);

  return (
    <div>
      <h2 className="text-xl mb-3">Reports</h2>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="font-semibold mb-2">Books</h3>
        <div className="mb-2">
          <input placeholder="Filter by category" value={category} onChange={e=>setCategory(e.target.value)}
            className="border p-2 rounded w-1/3" />
        </div>
        <table className="w-full text-sm">
          <thead><tr><th>Title</th><th>Author</th><th>Category</th><th>Avail</th></tr></thead>
          <tbody>
            {books.map(b=>(
              <tr key={b._id} className="border-t"><td>{b.title}</td><td>{b.author}</td><td>{b.category}</td><td>{b.available}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Transactions (Recent)</h3>
        <button onClick={loadTx} className="mb-2 px-3 py-1 bg-gray-200 rounded">Refresh</button>
        <table className="w-full text-sm">
          <thead><tr><th>Date</th><th>Type</th><th>Book</th><th>User</th></tr></thead>
          <tbody>
            {transactions.map(tx=>(
              <tr key={tx._id} className="border-t">
                <td>{new Date(tx.date).toLocaleString()}</td>
                <td>{tx.type}</td>
                <td>{tx.book?.title}</td>
                <td>{tx.user?.username || tx.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

