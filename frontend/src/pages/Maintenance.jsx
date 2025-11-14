import React, { useEffect, useState } from 'react';
import API from '../api';
import BookForm from '../components/BookForm';

export default function Maintenance(){
  const [books,setBooks] = useState([]);
  const [editing,setEditing] = useState(null);
  const [msg,setMsg] = useState('');

  const load = async () => {
    try {
      const res = await API.get('/books');
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(()=>{ load(); }, []);

  const create = async (data) => {
    await API.post('/books', data);
    setMsg('Book added');
    load();
  };

  const update = async (data) => {
    await API.put(`/books/${editing._id}`, data);
    setEditing(null);
    setMsg('Updated');
    load();
  };

  const remove = async (id) => {
    if(!confirm('Delete?')) return;
    await API.delete(`/books/${id}`);
    load();
  };

  return (
    <div>
      <h2 className="text-xl mb-3">Maintenance (Books CRUD)</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="mb-2">{editing ? 'Edit Book' : 'Add Book'}</h3>
          <BookForm initial={editing||{}} onSubmit={editing? update : create} />
          {editing && <button className="mt-2 text-sm" onClick={()=>setEditing(null)}>Cancel</button>}
        </div>

        <div className="bg-white p-4 rounded shadow col-span-1">
          <h3 className="mb-2">Book List</h3>
          <table className="w-full text-sm">
            <thead><tr className="text-left"><th>Title</th><th>Author</th><th>Avail</th><th>Actions</th></tr></thead>
            <tbody>
              {books.map(b=>(
                <tr key={b._id} className="border-t">
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td>{b.available}/{b.copies}</td>
                  <td className="space-x-2">
                    <button onClick={()=>setEditing(b)} className="text-blue-600">Edit</button>
                    <button onClick={()=>remove(b._id)} className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {msg && <div className="mt-3 text-green-600">{msg}</div>}
    </div>
  );
}
