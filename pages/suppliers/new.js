import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function NewSupplierPage() {
  const [form, setForm] = useState({
    name: '',
    contactEmail: '',
    phone: '',
    address: '',
  });
  const router = useRouter();

  const createSupplier = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/suppliers', form);
      router.push('/suppliers');
    } catch (error) {
      console.error('Failed to create supplier:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1>Add New Supplier</h1>
      <form onSubmit={createSupplier}>
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
          className="text-black bg-white border p-2 mb-2"
        />
        <input
          name="contactEmail"
          placeholder="Email"
          onChange={handleChange}
          className="text-black bg-white border p-2 mb-2"
        />
        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          className="text-black bg-white border p-2 mb-2"
        />
        <input
          name="address"
          placeholder="Address"
          onChange={handleChange}
          className="text-black bg-white border p-2 mb-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Create
        </button>
      </form>
    </div>
  );
}