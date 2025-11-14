import React from 'react';

export default function Navbar({ role, username, onLogout }) {
  return (
    <div className="flex items-center justify-between bg-white p-4 shadow-sm rounded">
      <div>
        <h2 className="text-xl font-semibold">Library</h2>
        <div className="text-sm text-gray-500">Role: {role}</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-sm">{username}</div>
        <button onClick={onLogout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
      </div>
    </div>
  );
}
