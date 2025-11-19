import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Reports() {
  const [activeTab, setActiveTab] = useState('books');
  const [data, setData] = useState([]);

  // Fetch data whenever tab changes
  useEffect(() => {
    const endpoints = {
      books: '/reports/master-books',
      movies: '/reports/master-movies',
      members: '/reports/master-members',
      active: '/reports/active-issues',
      overdue: '/reports/overdue-returns'
    };

    API.get(endpoints[activeTab])
       .then(res => setData(res.data))
       .catch(err => console.error(err));
  }, [activeTab]);

  // Columns based on Tab
  const renderTable = () => {
    if (data.length === 0) return <p className="p-4 text-gray-500">No records found.</p>;

    return (
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-200">
            {activeTab === 'members' ? (
               <><th>ID</th><th>Name</th><th>Type</th><th>Status</th><th>Expiry</th></>
            ) : activeTab === 'active' || activeTab === 'overdue' ? (
               <><th>Book</th><th>User</th><th>Issue Date</th><th>Return Date</th></>
            ) : (
               <><th>Serial</th><th>Title</th><th>Author/Dir</th><th>Available</th></>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t hover:bg-gray-50">
               {activeTab === 'members' ? (
                 <><td>{row.membershipId}</td><td>{row.name}</td><td>{row.type}</td><td>{row.status}</td><td>{new Date(row.expiryDate).toLocaleDateString()}</td></>
               ) : activeTab === 'active' || activeTab === 'overdue' ? (
                 <>
                   <td>{row.bookId?.title || 'N/A'}</td>
                   <td>{row.userId?.username || 'N/A'}</td>
                   <td>{new Date(row.issueDate).toLocaleDateString()}</td>
                   <td className={activeTab==='overdue'?'text-red-600 font-bold':''}>{new Date(row.returnDate).toLocaleDateString()}</td>
                 </>
               ) : (
                 <><td>{row.serialNo}</td><td>{row.title}</td><td>{row.author}</td><td>{row.available?'Yes':'No'}</td></>
               )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Reports</h2>
      
      <div className="flex flex-wrap gap-2 mb-6 border-b pb-2">
        {['books', 'movies', 'members', 'active', 'overdue'].map(tab => (
          <button 
            key={tab} 
            onClick={()=>setActiveTab(tab)}
            className={`px-4 py-2 rounded font-bold capitalize ${activeTab===tab ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'}`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="bg-white shadow rounded overflow-hidden">
        {renderTable()}
      </div>
    </div>
  );
}