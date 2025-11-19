import React, { useState } from 'react';
import API from '../api';

export default function Maintenance() {
  const [subTab, setSubTab] = useState('membership');
  const [memType, setMemType] = useState('6 months'); 
  const [cat, setCat] = useState('Book'); 

  // 1. ADD MEMBER
  const addMember = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const payload = Object.fromEntries(data); // Converts form to JSON object

    try {
       // 👇 Debugging: See exactly what you are sending
       console.log("Sending Member Data:", payload); 
       
       await API.post('/maintenance/add-member', payload);
       alert("✅ Member Added Successfully!");
       e.target.reset(); // Clear the form
    } catch (err) {
       // 👇 Now you will see the specific error
       console.error("API Error:", err);
       alert("❌ Error: " + (err.response?.data?.message || "Server connection failed"));
    }
  };

  // 2. ADD BOOK / MOVIE
  const addProduct = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const payload = Object.fromEntries(data);

    try {
       console.log("Sending Product Data:", payload);

       await API.post('/maintenance/add-product', payload);
       alert(`✅ ${cat} Added Successfully!`);
       e.target.reset(); // Clear the form
    } catch (err) {
       console.error("API Error:", err);
       alert("❌ Error: " + (err.response?.data?.message || "Server connection failed"));
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">System Maintenance</h2>
      
      <div className="flex gap-4 mb-6 border-b border-gray-300 pb-2">
        <button 
          onClick={()=>setSubTab('membership')} 
          className={`px-4 py-2 font-semibold rounded ${subTab==='membership' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
        >
          Membership Management
        </button>
        <button 
          onClick={()=>setSubTab('products')} 
          className={`px-4 py-2 font-semibold rounded ${subTab==='products' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
        >
          Book/Movie Management
        </button>
      </div>

      {/* MEMBERSHIP FORM */}
      {subTab === 'membership' && (
        <form onSubmit={addMember} className="bg-white p-6 shadow-lg rounded max-w-lg space-y-4 border border-gray-200">
           <h3 className="font-bold text-xl mb-2">Add New Member</h3>
           
           <div>
             <label className="block text-sm font-bold mb-1">Full Name</label>
             <input name="name" placeholder="e.g. John Doe" required className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
           </div>

           <div>
             <label className="block text-sm font-bold mb-1">Membership ID</label>
             <input name="membershipId" placeholder="e.g. MEM001" required className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
           </div>
           
           <div>
             <label className="block text-sm font-bold mb-2">Duration</label>
             <div className="flex gap-4 bg-gray-50 p-3 rounded border">
               <label className="cursor-pointer flex items-center gap-2"><input type="radio" name="type" value="6 months" checked={memType==='6 months'} onChange={()=>setMemType('6 months')} /> 6 Months</label>
               <label className="cursor-pointer flex items-center gap-2"><input type="radio" name="type" value="1 year" checked={memType==='1 year'} onChange={()=>setMemType('1 year')} /> 1 Year</label>
               <label className="cursor-pointer flex items-center gap-2"><input type="radio" name="type" value="2 years" checked={memType==='2 years'} onChange={()=>setMemType('2 years')} /> 2 Years</label>
             </div>
           </div>
           
           <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition">Add Member</button>
        </form>
      )}

      {/* BOOK/MOVIE FORM */}
      {subTab === 'products' && (
        <form onSubmit={addProduct} className="bg-white p-6 shadow-lg rounded max-w-lg space-y-4 border border-gray-200">
           <h3 className="font-bold text-xl mb-2">Add {cat}</h3>
           
           <div className="flex gap-4 mb-4">
             <button type="button" onClick={()=>setCat('Book')} className={`flex-1 py-2 rounded border ${cat==='Book' ? 'bg-blue-100 border-blue-500 text-blue-700 font-bold' : 'bg-gray-50'}`}>Book</button>
             <button type="button" onClick={()=>setCat('Movie')} className={`flex-1 py-2 rounded border ${cat==='Movie' ? 'bg-blue-100 border-blue-500 text-blue-700 font-bold' : 'bg-gray-50'}`}>Movie</button>
           </div>

           {/* Hidden input to send the category to backend */}
           <input type="hidden" name="category" value={cat} />

           <div>
             <label className="block text-sm font-bold mb-1">{cat} Title</label>
             <input name="title" placeholder={`Enter ${cat} Name`} required className="w-full border p-2 rounded" />
           </div>

           <div>
             <label className="block text-sm font-bold mb-1">{cat === 'Book' ? 'Author' : 'Director'}</label>
             <input name="author" placeholder={cat === 'Book' ? "Author Name" : "Director Name"} required className="w-full border p-2 rounded" />
           </div>

           <div>
             <label className="block text-sm font-bold mb-1">Serial Number</label>
             <input name="serialNo" placeholder="Unique ID (e.g. BK-101)" required className="w-full border p-2 rounded" />
           </div>
           
           <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition">Save {cat}</button>
        </form>
      )}
    </div>
  );
}