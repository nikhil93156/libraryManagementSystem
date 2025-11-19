import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Reports() {
  const [books, setBooks] = useState([]);
  
  useEffect(() => {
    API.get('/books').then(res => setBooks(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Master List of Books/Movies</h2>
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr><th>Serial No</th><th>Title</th><th>Author/Director</th><th>Type</th><th>Status</th></tr>
          </thead>
          <tbody>
            {books.map(b => (
              <tr key={b._id} className="border-t">
                <td className="p-2">{b.serialNo}</td>
                <td className="p-2">{b.title}</td>
                <td className="p-2">{b.author}</td>
                <td className="p-2">{b.category}</td>
                <td className="p-2">{b.available ? 'Available' : 'On Loan'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}