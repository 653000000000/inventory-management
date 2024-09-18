// pages/suppliers/[id].js

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function SupplierDetailPage() {
  const [supplier, setSupplier] = useState(null);
  const [form, setForm] = useState({
    name: '',
    contactEmail: '',
    phone: '',
    address: '',
  });
  const [editing, setEditing] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const fetchSupplier = async () => {
    try {
      const res = await axios.get(`/api/suppliers/${id}`);
      const supplierData = res.data.data;

      // Set the form state with the supplier data
      setSupplier(supplierData);
      setForm({
        name: supplierData.name || '',
        contactEmail: supplierData.contactEmail || '',
        phone: supplierData.phone || '',
        address: supplierData.address || '',
      });
    } catch (error) {
      console.error('Failed to fetch supplier:', error);
    }
  };

  useEffect(() => {
    if (id) fetchSupplier();
  }, [id]);

  const updateSupplier = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/suppliers/${id}`, form);
      setEditing(false);
      fetchSupplier();
    } catch (error) {
      console.error('Failed to update supplier:', error);
    }
  };

  const deleteSupplier = async () => {
    try {
      await axios.delete(`/api/suppliers/${id}`);
      router.push('/suppliers');
    } catch (error) {
      console.error('Failed to delete supplier:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (!supplier) return <div>Loading...</div>;

  return (
    <div>
      {/* Navigation Bar */}
      {/* Include your existing navigation bar here, if any */}

      {/* Back to Suppliers Button */}
      <Link href="/suppliers" className="inline-block bg-gray-500 text-white p-2 mb-4">
        Back to Suppliers
      </Link>

      {editing ? (
        <form onSubmit={updateSupplier}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="text-black bg-white border p-2 mb-2"
          />
          <input
            name="contactEmail"
            value={form.contactEmail}
            onChange={handleChange}
            className="text-black bg-white border p-2 mb-2"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="text-black bg-white border p-2 mb-2"
          />
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="text-black bg-white border p-2 mb-2"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 mr-2">
            Update
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="bg-gray-500 text-white p-2"
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          <h1 className="font-bold text-3xl text-white mb-4">{supplier.name}</h1>
          <p className="text-white mb-2">Email: {supplier.contactEmail}</p>
          <p className="text-white mb-2">Phone: {supplier.phone}</p>
          <p className="text-white mb-2">Address: {supplier.address}</p>
          <button
            onClick={() => setEditing(true)}
            className="bg-yellow-500 text-black p-2 mr-2"
          >
            Edit
          </button>
          <button onClick={deleteSupplier} className="bg-red-500 text-black p-2">
            Delete
          </button>
        </>
      )}
    </div>
  );
}
