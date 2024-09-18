// pages/orders/new.js

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function NewOrderPage() {
  const [form, setForm] = useState({
    customerName: '',
    products: [
      { productId: '', quantity: '' },
    ],
    status: 'Pending',
  });
  const [productsList, setProductsList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        setProductsList(res.data.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProductChange = (index, e) => {
    const newProducts = [...form.products];
    newProducts[index][e.target.name] = e.target.value;
    setForm({ ...form, products: newProducts });
  };

  const addProductField = () => {
    setForm({
      ...form,
      products: [...form.products, { productId: '', quantity: '' }],
    });
  };

  const removeProductField = (index) => {
    const newProducts = [...form.products];
    newProducts.splice(index, 1);
    setForm({ ...form, products: newProducts });
  };

  const createOrder = async (e) => {
    e.preventDefault();
  
    // Validate form data
    if (!form.customerName) {
      setErrorMessage('Customer name is required.');
      return;
    }
  
    for (const product of form.products) {
      if (!product.productId || !product.quantity) {
        setErrorMessage('Please select a product and enter a quantity for each item.');
        return;
      }
    }
  
    try {
      await axios.post('/api/orders', form);
      router.push('/orders');
    } catch (error) {
      console.error('Failed to create order:', error);
      const errorMsg =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : 'Failed to create order. Please try again.';
      setErrorMessage(errorMsg);
    }
  };
  
  return (
    <div>
      {/* Navigation Bar */}
      <Link href="/orders" className="inline-block bg-gray-500 text-white p-2 mb-4">
        Back to Orders
      </Link>

      <h1 className="font-bold text-3xl text-white mb-4">Add New Order</h1>
      {errorMessage && (
        <div className="bg-red-500 text-white p-2 mb-4 rounded">{errorMessage}</div>
      )}
      <form onSubmit={createOrder}>
        {/* Customer Name */}
        <input
          name="customerName"
          placeholder="Customer Name"
          value={form.customerName}
          onChange={handleFormChange}
          required
          className="text-black bg-white border p-2 mb-4 w-full"
        />

        {/* Products Selection */}
        <div className="mb-4">
          <h2 className="text-white font-bold mb-2">Products</h2>
          {form.products.map((product, index) => (
            <div key={index} className="flex items-center mb-2">
              <select
                name="productId"
                value={product.productId}
                onChange={(e) => handleProductChange(index, e)}
                required
                className="text-black bg-white border p-2 mr-2 flex-1"
              >
                <option value="">Select Product</option>
                {productsList.map((prod) => (
                  <option key={prod._id} value={prod._id}>
                    {prod.name}
                  </option>
                ))}
              </select>
              <input
                name="quantity"
                type="number"
                min="1"
                placeholder="Quantity"
                value={product.quantity}
                onChange={(e) => handleProductChange(index, e)}
                required
                className="text-black bg-white border p-2 mr-2 w-24"
              />
              {form.products.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProductField(index)}
                  className="bg-red-500 text-white p-2"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addProductField}
            className="bg-green-500 text-white p-2"
          >
            Add Another Product
          </button>
        </div>

        {/* Order Status */}
        <select
          name="status"
          value={form.status}
          onChange={handleFormChange}
          className="text-black bg-white border p-2 mb-4 w-full"
        >
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>

        {/* Submit Button */}
        <button type="submit" className="bg-blue-500 text-white p-2">
          Create Order
        </button>
      </form>
    </div>
  );
}
