import React, { useState, useEffect } from 'react';
import API from '../api';

export default function Transactions() {
  const [tab, setTab] = useState('availability'); // 'availability' | 'issue' | 'return'
  
  // Data States
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]); // To select which user is issuing
  
  // Form States
  const [issueForm, setIssueForm] = useState({
    bookId: '',
    userId: '', 
    author: '', // Read-only
    issueDate: new Date().toISOString().split('T')[0],
    returnDate: '' 
  });

  const [returnForm, setReturnForm] = useState({
    bookId: '',
    transactionId: '',
    fine: 0,
    finePaid: false,
    remarks: ''
  });

  // Load Books & Users on Mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const bookRes = await API.get('/books'); // Ensure this endpoint returns all books
      // In a real app, you might also fetch users here: const userRes = await API.get('/users');
      setBooks(bookRes.data);
      // setUsers(userRes.data); 
    } catch (err) {
      console.error("Failed to load data");
    }
  };

  // --- TAB 1: AVAILABILITY LOGIC ---
  // (Simple rendering of table below)

  // --- TAB 2: ISSUE BOOK LOGIC ---
  const handleIssueBookSelect = (e) => {
    const selectedId = e.target.value;
    const book = books.find(b => b._id === selectedId);
    
    // Auto-Calculate 15 Days ahead
    const today = new Date();
    const targetDate = new Date();
    targetDate.setDate(today.getDate() + 15);
    
    setIssueForm({
      ...issueForm,
      bookId: selectedId,
      author: book ? book.author : '', // Auto-populate Author (Read-only)
      returnDate: targetDate.toISOString().split('T')[0] // Default to max 15 days
    });
  };

  const submitIssue = async (e) => {
    e.preventDefault();
    
    // Frontend Validation: 15 Days
    const start = new Date(issueForm.issueDate);
    const end = new Date(issueForm.returnDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 15) {
      return alert("Error: Return Date cannot be more than 15 days from Issue Date.");
    }
    if (end < start) {
      return alert("Error: Return Date cannot be before Issue Date.");
    }

    try {
      // Get current logged in user ID if not selecting a specific user
      const currentUserId = localStorage.getItem('userid'); 
      
      await API.post('/transactions/issue', {
        ...issueForm,
        userId: issueForm.userId || currentUserId // Use form selection or logged-in user
      });
      
      alert("✅ Book Issued Successfully!");
      loadData(); // Refresh availability
      setTab('availability');
    } catch (err) {
      alert("❌ Error: " + (err.response?.data?.message || "Issue failed"));
    }
  };

  // --- TAB 3: RETURN BOOK LOGIC ---
  const handleReturnBookSelect = async (e) => {
    const bookId = e.target.value;
    if (!bookId) return;

    try {
      // 1. Calculate Fine immediately upon selection
      const res = await API.post('/transactions/calculate-fine', { bookId });
      
      setReturnForm({
        bookId: bookId,
        transactionId: res.data.transaction._id,
        fine: res.data.fine,
        finePaid: false,
        remarks: ''
      });
    } catch (err) {
      console.error(err);
      alert("Error fetching transaction details. Is this book actually issued?");
    }
  };

  const submitReturn = async (e) => {
    e.preventDefault();

    // Validation: Mandatory Fine Checkbox
    if (returnForm.fine > 0 && !returnForm.finePaid) {
      return alert("⚠️ Fine is pending. Please collect payment and check 'Fine Paid'.");
    }

    try {
      await API.post('/transactions/return', {
        transactionId: returnForm.transactionId,
        finePaid: returnForm.finePaid,
        remarks: returnForm.remarks
      });
      
      alert("✅ Book Returned Successfully!");
      loadData();
      setTab('availability');
      setReturnForm({ ...returnForm, bookId: '', fine: 0 }); // Reset
    } catch (err) {
      alert("❌ Error: " + (err.response?.data?.message || "Return failed"));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Transactions</h2>

      {/* TABS */}
      <div className="flex gap-4 mb-6 border-b pb-2">
        {['availability', 'issue', 'return'].map(t => (
          <button 
            key={t} 
            onClick={() => setTab(t)}
            className={`px-6 py-2 font-bold uppercase tracking-wide rounded-t-lg transition-colors 
              ${tab === t ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
        
        {/* 1. AVAILABILITY TABLE */}
        {tab === 'availability' && (
          <div className="overflow-x-auto">
             <h3 className="text-lg font-bold mb-4">Book Availability Status</h3>
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-gray-100 border-b border-gray-300">
                   <th className="p-3">Serial No</th>
                   <th className="p-3">Title</th>
                   <th className="p-3">Author/Director</th>
                   <th className="p-3">Category</th>
                   <th className="p-3">Status</th>
                 </tr>
               </thead>
               <tbody>
                 {books.map(b => (
                   <tr key={b._id} className="border-b hover:bg-gray-50">
                     <td className="p-3 font-mono text-sm text-gray-600">{b.serialNo}</td>
                     <td className="p-3 font-medium">{b.title}</td>
                     <td className="p-3">{b.author}</td>
                     <td className="p-3">
                       <span className={`px-2 py-1 text-xs rounded ${b.category === 'Movie' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                         {b.category}
                       </span>
                     </td>
                     <td className="p-3">
                       {b.available 
                         ? <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded">Available</span> 
                         : <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded">Issued</span>}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}

        {/* 2. ISSUE BOOK FORM */}
        {tab === 'issue' && (
          <form onSubmit={submitIssue} className="max-w-lg space-y-4">
            <h3 className="text-lg font-bold mb-2">Issue a Book</h3>
            
            {/* Select Book */}
            <div>
              <label className="block text-sm font-bold mb-1">Select Book</label>
              <select 
                name="bookId" 
                value={issueForm.bookId} 
                onChange={handleIssueBookSelect} 
                required 
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Choose Available Book --</option>
                {books.filter(b => b.available).map(b => (
                  <option key={b._id} value={b._id}>{b.title} (S.No: {b.serialNo})</option>
                ))}
              </select>
            </div>

            {/* Author Read-Only */}
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-500">Author (Auto-Populated)</label>
              <input 
                value={issueForm.author} 
                readOnly 
                className="w-full border p-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed" 
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1">Issue Date</label>
                <input 
                  type="date" 
                  value={issueForm.issueDate} 
                  onChange={e => setIssueForm({...issueForm, issueDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]} // Cannot be past
                  required 
                  className="w-full border p-2 rounded" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Return Date (Max 15 Days)</label>
                <input 
                  type="date" 
                  value={issueForm.returnDate} 
                  onChange={e => setIssueForm({...issueForm, returnDate: e.target.value})}
                  required 
                  className="w-full border p-2 rounded" 
                />
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition">
              Confirm Issue
            </button>
          </form>
        )}

        {/* 3. RETURN BOOK FORM */}
        {tab === 'return' && (
          <form onSubmit={submitReturn} className="max-w-lg space-y-4">
            <h3 className="text-lg font-bold mb-2">Return a Book</h3>

            {/* Select Book to Return */}
            <div>
              <label className="block text-sm font-bold mb-1">Select Issued Book</label>
              <select 
                value={returnForm.bookId} 
                onChange={handleReturnBookSelect} 
                required
                className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500"
              >
                <option value="">-- Choose Book to Return --</option>
                {books.filter(b => !b.available).map(b => (
                  <option key={b._id} value={b._id}>{b.title} (S.No: {b.serialNo})</option>
                ))}
              </select>
            </div>

            {/* Fine Section (Visible only after selection) */}
            {returnForm.transactionId && (
              <div className="bg-gray-50 p-4 rounded border border-gray-200 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-700 font-bold">Calculated Fine:</span>
                  <span className={`text-xl font-bold ${returnForm.fine > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ₹ {returnForm.fine}
                  </span>
                </div>

                {/* Mandatory Checkbox if Fine > 0 */}
                {returnForm.fine > 0 ? (
                  <label className="flex items-center gap-3 bg-red-50 p-3 rounded border border-red-200 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={returnForm.finePaid} 
                      onChange={e => setReturnForm({...returnForm, finePaid: e.target.checked})}
                      className="w-5 h-5 text-red-600"
                    />
                    <span className="text-red-800 font-bold text-sm">I confirm the fine has been paid.</span>
                  </label>
                ) : (
                  <p className="text-sm text-green-600 mb-2">No fine due. Proceed to return.</p>
                )}
                
                <div className="mt-4">
                  <label className="block text-sm font-bold mb-1">Remarks (Optional)</label>
                  <textarea 
                    value={returnForm.remarks}
                    onChange={e => setReturnForm({...returnForm, remarks: e.target.value})}
                    className="w-full border p-2 rounded"
                    rows="2"
                  ></textarea>
                </div>

                <button className="w-full mt-4 bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 transition">
                  Complete Return
                </button>
              </div>
            )}
          </form>
        )}

      </div>
    </div>
  );
}