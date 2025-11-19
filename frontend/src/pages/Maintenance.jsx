import React, { useState } from 'react';
import API from '../api';

export default function Maintenance() {
  const [subTab, setSubTab] = useState('membership');
  const [memType, setMemType] = useState('6 months'); // Default (Source 17)
  const [cat, setCat] = useState('Book'); // Default (Source 19)

  const addMember = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    await API.post('/maintenance/add-member', Object.fromEntries(data));
    alert("Member Added");
  };

  const addProduct = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    await API.post('/maintenance/add-product', Object.fromEntries(data));
    alert("Product Added");
  };

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6">
        <button onClick={()=>setSubTab('membership')} className="btn border p-2">Membership</button>
        <button onClick={()=>setSubTab('products')} className="btn border p-2">Books/Movies</button>
      </div>

      {/* MEMBERSHIP FORM */}
      {subTab === 'membership' && (
        <form onSubmit={addMember} className="bg-white p-6 shadow max-w-lg space-y-4">
           <h3 className="font-bold">Add Membership</h3>
           <input name="name" placeholder="Name" required className="w-full border p-2" />
           <input name="membershipId" placeholder="Membership ID" required className="w-full border p-2" />
           
           {/* Source 17: Radio Selection */}
           <div className="flex gap-4">
             <label><input type="radio" name="type" value="6 months" checked={memType==='6 months'} onChange={()=>setMemType('6 months')} /> 6 Months</label>
             <label><input type="radio" name="type" value="1 year" checked={memType==='1 year'} onChange={()=>setMemType('1 year')} /> 1 Year</label>
             <label><input type="radio" name="type" value="2 years" checked={memType==='2 years'} onChange={()=>setMemType('2 years')} /> 2 Years</label>
           </div>
           <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
        </form>
      )}

      {/* BOOK/MOVIE FORM */}
      {subTab === 'products' && (
        <form onSubmit={addProduct} className="bg-white p-6 shadow max-w-lg space-y-4">
           <h3 className="font-bold">Add Book/Movie</h3>
           
           {/* Source 19: Category Selection */}
           <div className="flex gap-4">
             <label><input type="radio" name="category" value="Book" checked={cat==='Book'} onChange={()=>setCat('Book')} /> Book</label>
             <label><input type="radio" name="category" value="Movie" checked={cat==='Movie'} onChange={()=>setCat('Movie')} /> Movie</label>
           </div>

           <input name="title" placeholder="Title" required className="w-full border p-2" />
           <input name="author" placeholder={cat==='Book'?'Author':'Director'} required className="w-full border p-2" />
           <input name="serialNo" placeholder="Serial No" required className="w-full border p-2" />
           
           <button className="bg-blue-600 text-white px-4 py-2 rounded">Add {cat}</button>
        </form>
      )}
    </div>
  );
}