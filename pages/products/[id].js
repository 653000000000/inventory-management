import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [suppliers, setSuppliers] = useState([]); // To store suppliers list
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: 0,
    stockQuantity: 0,
    supplierId: '',
  });

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const res = await axios.get(`/api/products/${id}`);
          setProduct(res.data.data);
          setFormData({
            name: res.data.data.name,
            category: res.data.data.category,
            price: res.data.data.price,
            stockQuantity: res.data.data.stockQuantity,
            supplierId: res.data.data.supplierId?._id || '', // Set supplierId correctly
          });
          setLoading(false);
        } catch (error) {
          console.error('Failed to fetch product:', error);
          setErrorMessage('Failed to fetch product. Please try again.');
          setLoading(false);
        }
      };

      const fetchSuppliers = async () => {
        try {
          const res = await axios.get('/api/suppliers'); // Fetch the list of suppliers
          setSuppliers(res.data.data);
        } catch (error) {
          console.error('Failed to fetch suppliers:', error);
          setErrorMessage('Failed to fetch suppliers.');
        }
      };

      fetchProduct();
      fetchSuppliers(); // Fetch suppliers on load
    }
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`/api/products/${id}`);
      router.push('/products'); // Redirect to products page after deletion
    } catch (error) {
      console.error('Failed to delete product:', error);
      setErrorMessage('Failed to delete product. Please try again.');
      setIsDeleting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/products/${id}`, formData);
      setIsEditing(false); // Turn off edit mode after successful update
      router.push(`/products/${id}`); // Optionally, refresh page or redirect
    } catch (error) {
      console.error('Failed to update product:', error);
      setErrorMessage('Failed to update product. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (errorMessage) return <div>{errorMessage}</div>;
  if (!product) return <div>No product found.</div>;

  return (
    <div>
      <h1 className="font-bold text-3xl mb-4 text-white">
        {isEditing ? 'Edit Product' : product.name}
      </h1>

      {isEditing ? (
        // If in edit mode, show the form to edit product details
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block text-white mb-2">Product Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="p-2 text-black w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Category:</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="p-2 text-black w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="p-2 text-black w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Stock Quantity:</label>
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleInputChange}
              className="p-2 text-black w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Supplier:</label>
            <select
              name="supplierId"
              value={formData.supplierId}
              onChange={handleInputChange}
              className="p-2 text-black w-full"
            >
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2">
            Save Changes
          </button>
        </form>
      ) : (
        // If not editing, show product details
        <>
          <p className="text-white mb-2">Category: {product.category || 'N/A'}</p>
          <p className="text-white mb-2">Price: ${product.price}</p>
          <p className="text-white mb-2">Stock Quantity: {product.stockQuantity}</p>
          <p className="text-white mb-4">Supplier: {product.supplierId?.name || 'N/A'}</p>

          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white p-2 rounded-lg"
            >
              Edit Product
            </button>

            <button
              onClick={handleDelete}
              className={`bg-red-500 text-white p-2 rounded-lg ${isDeleting ? 'opacity-50' : ''}`}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Product'}
            </button>
          </div>
        </>
      )}

      <Link href="/products" className="bg-gray-500 text-white p-2 inline-block mt-4">
        Back to Products
      </Link>
    </div>
  );
}
