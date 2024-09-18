import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function NewProductPage() {
  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    stockQuantity: '',
    supplierId: '',
  });
  const [suppliers, setSuppliers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch suppliers for the dropdown
    const fetchSuppliers = async () => {
      const res = await axios.get('/api/suppliers');
      setSuppliers(res.data.data);
    };
    fetchSuppliers();
  }, []);

  const createProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/products', form);
      router.push('/products');
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1>Add New Product</h1>
      <form onSubmit={createProduct}>
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
          className="text-black bg-white border p-2 mb-2"
        />
        <input
          name="category"
          placeholder="Category"
          onChange={handleChange}
          className="text-black bg-white border p-2 mb-2"
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          onChange={handleChange}
          required
          className="text-black bg-white border p-2 mb-2"
        />
        <input
          name="stockQuantity"
          type="number"
          placeholder="Stock Quantity"
          onChange={handleChange}
          required
          className="text-black bg-white border p-2 mb-2"
        />
        <select
          name="supplierId"
          onChange={handleChange}
          required
          className="text-black bg-white border p-2 mb-2"
        >
          <option value="">Select Supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier._id} value={supplier._id}>
              {supplier.name}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2">
          Create
        </button>
      </form>
    </div>
  );
}