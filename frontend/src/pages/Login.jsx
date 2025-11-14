import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [form,setForm] = useState({ username:'', password:'' });
  const [err,setErr] = useState('');
  const nav = useNavigate();

const submit = async (e) => {
  e.preventDefault();
  try {
    const res = await API.post('/auth/login', form);

    localStorage.setItem('token', res.data.token);
    localStorage.setItem('role', res.data.role);
    localStorage.setItem('username', res.data.username);
    localStorage.setItem('userid', res.data.id);

    nav('/dashboard', { replace: true });  // ⭐ force redirect
  } catch (err) {
    setErr(err.response?.data?.message || 'Login failed');
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h1 className="text-2xl mb-4">Login</h1>
        {err && <div className="mb-2 text-red-600">{err}</div>}
        <form onSubmit={submit} className="space-y-3">
          <input value={form.username} onChange={e=>setForm({...form, username:e.target.value})}
            className="w-full border p-2 rounded" placeholder="Username" />
          <input type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})}
            className="w-full border p-2 rounded" placeholder="Password" />
          <button className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
        </form>
      </div>
    </div>
  );
}
