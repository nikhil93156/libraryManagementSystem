import React, { useState, useEffect } from 'react';

export default function BookForm({ initial = {}, onSubmit }) {
  const [form, setForm] = useState({ title: '', author: '', quantity:'', category: '', copies: 1 });

  useEffect(()=> { setForm({ ...form, ...initial }); /* eslint-disable-next-line */}, []);

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      <input required value={form.title} onChange={e=>setForm({...form, title:e.target.value})}
        className="w-full border p-2 rounded" placeholder="Title" />
      <input value={form.author} onChange={e=>setForm({...form, author:e.target.value})}
        className="w-full border p-2 rounded" placeholder="Author" />
      <input value={form.category} onChange={e=>setForm({...form, category:e.target.value})}
        className="w-full border p-2 rounded" placeholder="Category" />
        <input value={form.quantity} onChange={e=>setForm({...form, quantity:e.target.value})}
        className="w-full border p-2 rounded" placeholder="quantity" />
      <input type="number" value={form.copies} min="1" onChange={e=>setForm({...form, copies: Number(e.target.value)})}
        className="w-full border p-2 rounded" placeholder="Copies" />
      <button className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
    </form>
  );
}
