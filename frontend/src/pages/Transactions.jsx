import React, { useState, useEffect } from 'react';
import API from '../api'

export default function Transactions() {
  const [tab, setTab] = useState('availability');
  const [books, setBooks] = useState([]);
  const [issueData, setIssueData] = useState({ bookId: '', author: '', issueDate: '', returnDate: '' });
  const [returnState, setReturnState] = useState(null); // Stores fine calculation
  const [finePaid, setFinePaid] = useState(false);
  const [remarks, setRemarks] = useState('');

  const userId = localStorage.getItem('userid'); // Assuming user is logged in

  useEffect(() => {
    API.get('/books').then(res => setBooks(res.data)).catch(console.error);
  }, []);

  // HANDLE ISSUE TAB LOGIC
  const handleBookSelect = (e) => {
    const bookId = e.target.value;
    const book = books.find(b => b._id === bookId);
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate max return date (15 days)
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 15);
    
    setIssueData({
      bookId,
      author: book ? book.author : '', // Auto-populate (Source 6)
      issueDate: today,
      returnDate: maxDate.toISOString().split('T')[0] // Default 15 days (Source 7)
    });
  };

  const submitIssue = async (e) => {
    e.preventDefault();
    try {
        await API.post('/transactions/issue', { ...issueData, userId });
        alert("Book Issued Successfully");
        window.location.reload();
    } catch (err) {
        alert(err.response?.data?.message || "Error");
    }
  };

  // HANDLE RETURN TAB LOGIC
  const checkFine = async (bookId) => {
      const res = await API.post('/transactions/calculate-fine', { bookId });
      setReturnState(res.data); // Contains fine amount
  };

  const submitReturn = async () => {
      if (returnState.fine > 0 && !finePaid) return alert("Please confirm fine is paid.");
      try {
          await API.post('/transactions/return', { 
              transactionId: returnState.transaction._id, 
              finePaid, 
              remarks 
          });
          alert("Book Returned");
          setReturnState(null);
          window.location.reload();
      } catch (err) {
          alert("Error returning book");
      }
  };

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6 border-b pb-2">
        {['availability', 'issue', 'return'].map(t => (
           <button key={t} onClick={()=>setTab(t)} className={`uppercase font-bold ${tab===t?'text-blue-600':''}`}>{t}</button>
        ))}
      </div>

      {/* TAB 1: AVAILABILITY */}
      {tab === 'availability' && (
        <table className="w-full text-left bg-white shadow p-4">
            <thead><tr><th>Select</th><th>Title</th><th>Author</th><th>Category</th><th>Status</th></tr></thead>
            <tbody>
                {books.map(b => (
                    <tr key={b._id} className="border-b">
                        <td><input type="radio" name="search" /></td>
                        <td>{b.title}</td>
                        <td>{b.author}</td>
                        <td>{b.category}</td>
                        <td className={b.available?'text-green-600':'text-red-600'}>{b.available?'Available':'Issued'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      )}

      {/* TAB 2: ISSUE BOOK */}
      {tab === 'issue' && (
        <form onSubmit={submitIssue} className="bg-white p-6 shadow max-w-md space-y-4">
            <h3 className="font-bold">Issue Book</h3>
            
            <select onChange={handleBookSelect} required className="w-full border p-2">
                <option value="">Select Book...</option>
                {books.filter(b => b.available).map(b => <option key={b._id} value={b._id}>{b.title}</option>)}
            </select>

            {/* Read Only Author (Source 6) */}
            <input value={issueData.author} readOnly placeholder="Author (Auto-filled)" className="w-full bg-gray-100 border p-2" />

            <div className="grid grid-cols-2 gap-2">
                <label>Issue Date</label>
                <input type="date" value={issueData.issueDate} readOnly className="border p-2 bg-gray-100" />
                
                <label>Return Date (Max 15d)</label>
                <input type="date" value={issueData.returnDate} 
                       onChange={e=>setIssueData({...issueData, returnDate: e.target.value})}
                       max={new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0]} 
                       className="border p-2" />
            </div>
            <button className="bg-blue-600 text-white w-full py-2">Confirm Issue</button>
        </form>
      )}

      {/* TAB 3: RETURN & PAY FINE */}
      {tab === 'return' && (
          <div className="bg-white p-6 shadow max-w-md space-y-4">
              {!returnState ? (
                  <>
                    <h3 className="font-bold">Select Book to Return</h3>
                    <select onChange={(e)=>checkFine(e.target.value)} className="w-full border p-2">
                        <option>Select Book...</option>
                        {books.filter(b => !b.available).map(b => <option key={b._id} value={b._id}>{b.title}</option>)}
                    </select>
                  </>
              ) : (
                  <div className="space-y-3">
                      <h3 className="font-bold text-lg">Pay Fine Details</h3>
                      <p>Fine Amount: <span className="text-red-600 font-bold">${returnState.fine}</span></p>
                      
                      {/* Mandatory Checkbox (Source 15) */}
                      {returnState.fine > 0 && (
                          <label className="flex gap-2 items-center bg-red-50 p-2 rounded border border-red-200">
                              <input type="checkbox" onChange={e=>setFinePaid(e.target.checked)} />
                              I confirm the fine has been paid.
                          </label>
                      )}
                      
                      <textarea placeholder="Remarks (Optional)" onChange={e=>setRemarks(e.target.value)} className="w-full border p-2"></textarea>
                      <button onClick={submitReturn} className="bg-green-600 text-white w-full py-2">Confirm Return</button>
                  </div>
              )}
          </div>
      )}
    </div>
  );
}