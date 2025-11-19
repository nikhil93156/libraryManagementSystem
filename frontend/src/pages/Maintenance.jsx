import React, { useState } from 'react';
import API from '../api';

export default function Maintenance() {
  const [mainTab, setMainTab] = useState("membership");
  const [mode, setMode] = useState("add");

  const [searchKey, setSearchKey] = useState("");
  const [form, setForm] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ----------------- SEARCH HANDLER -----------------
  const handleSearch = async () => {
    try {
      const endpoint =
        mainTab === "membership"
          ? `/maintenance/get-member/${searchKey}`
          : mainTab === "products"
          ? `/maintenance/get-book/${searchKey}`
          : `/maintenance/get-user/${searchKey}`;

      const res = await API.get(endpoint);
      setForm(res.data);
      alert("Record found and loaded!");
    } catch (err) {
      alert("Not found!");
    }
  };

  // ----------------- ADD HANDLER -----------------
  const handleAdd = async (e) => {
    e.preventDefault();

    let endpoint = "";
    let payload = {};

    if (mainTab === "membership") {
      endpoint = "/maintenance/add-member";
      payload = {
        name: form.name,
        membershipId: form.membershipId,
        type: form.type,
      };
    }

    if (mainTab === "products") {
      endpoint = "/maintenance/add-product";
      payload = {
        title: form.title,
        author: form.author,
        serialNo: form.serialNo,
        category: form.category,
      };
    }

    if (mainTab === "users") {
      endpoint = "/maintenance/add-user";
      payload = {
        username: form.username,
        password: form.password,
        name: form.name,
        role: form.role,
      };
    }

    try {
      await API.post(endpoint, payload);
      alert("Added successfully!");
      setForm({});
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  // ----------------- UPDATE HANDLER -----------------
  const handleUpdate = async (e) => {
    e.preventDefault();

    let endpoint = "";
    let payload = {};

    if (mainTab === "membership") {
      endpoint = `/maintenance/update-member/${searchKey}`;
      payload = { action: form.action };
    }

    if (mainTab === "products") {
      endpoint = `/maintenance/update-product/${searchKey}`;
      payload = {
        title: form.title,
        author: form.author,
        category: form.category,
      };
    }

    if (mainTab === "users") {
      endpoint = `/maintenance/update-user/${searchKey}`;
      payload = {
        name: form.name,
        role: form.role,
      };
    }

    try {
      await API.put(endpoint, payload);
      alert("Updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["membership", "products", "users"].map((tab) => (
          <button
            key={tab}
            onClick={() => { setMainTab(tab); setForm({}); }}
            className={`px-5 py-2 border-b-4 font-bold uppercase ${
              mainTab === tab ? "border-blue-600 text-blue-700" : "border-transparent"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Add / Update Switch */}
      <div className="flex gap-3 mb-6">
        <button onClick={() => setMode("add")} className={`px-4 py-2 rounded ${mode==="add"?"bg-black text-white":"bg-gray-200"}`}>Add</button>
        <button onClick={() => setMode("update")} className={`px-4 py-2 rounded ${mode==="update"?"bg-black text-white":"bg-gray-200"}`}>Update</button>
      </div>

      <form onSubmit={mode === "add" ? handleAdd : handleUpdate} className="bg-white p-6 rounded shadow-md max-w-lg">

        {/* ---- SEARCH ---- */}
        {mode === "update" && (
          <div className="mb-4 flex gap-2">
            <input
              placeholder={
                mainTab === "membership"
                  ? "Membership ID"
                  : mainTab === "products"
                  ? "Serial No"
                  : "Username"
              }
              className="border p-2 w-full"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <button type="button" onClick={handleSearch} className="bg-blue-600 text-white px-4">
              Search
            </button>
          </div>
        )}

        {/* ---------------- MEMBERSHIP FORM ---------------- */}
        {mainTab === "membership" && (
          <>
            <input name="name" value={form.name || ""} onChange={handleChange} placeholder="Member Name" className="border p-2 w-full mb-2" />

            {mode === "add" && (
              <>
                <input name="membershipId" value={form.membershipId || ""} onChange={handleChange} placeholder="Membership ID" className="border p-2 w-full mb-2" />

                <select name="type" className="border p-2 w-full mb-2" onChange={handleChange}>
                  <option value="6 months">6 Months</option>
                  <option value="1 year">1 Year</option>
                  <option value="2 years">2 Years</option>
                </select>
              </>
            )}

            {mode === "update" && (
              <select name="action" className="border p-2 w-full mb-2" onChange={handleChange}>
                <option value="extend">Extend 6 months</option>
                <option value="cancel">Cancel Membership</option>
              </select>
            )}
          </>
        )}

        {/* ---------------- PRODUCTS FORM ---------------- */}
        {mainTab === "products" && (
          <>
            <input name="serialNo" disabled={mode==="update"} value={form.serialNo || ""} onChange={handleChange} placeholder="Serial No" className="border p-2 w-full mb-2" />

            <input name="title" value={form.title || ""} onChange={handleChange} placeholder="Title" className="border p-2 w-full mb-2" />

            <input name="author" value={form.author || ""} onChange={handleChange} placeholder="Author / Director" className="border p-2 w-full mb-2" />

            <select name="category" className="border p-2 w-full mb-2" onChange={handleChange} value={form.category}>
              <option value="Book">Book</option>
              <option value="Movie">Movie</option>
            </select>
          </>
        )}

        {/* ---------------- USERS FORM ---------------- */}
        {mainTab === "users" && (
          <>
            <input name="username" disabled={mode==="update"} value={form.username || ""} onChange={handleChange} placeholder="Username" className="border p-2 w-full mb-2" />

            {mode === "add" && (
              <input name="password" type="password" value={form.password || ""} onChange={handleChange} placeholder="Password" className="border p-2 w-full mb-2" />
            )}

            <input name="name" value={form.name || ""} onChange={handleChange} placeholder="Full Name" className="border p-2 w-full mb-2" />

            <select name="role" className="border p-2 w-full mb-2" onChange={handleChange} value={form.role || "user"}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </>
        )}

        <button className="bg-green-600 text-white px-4 py-2 w-full mt-3">
          {mode === "add" ? "Add" : "Update"}
        </button>
      </form>
    </div>
  );
}
