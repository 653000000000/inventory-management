import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);  // Added loading state
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        setProducts(res.data.data);
        setLoading(false);  // Stop loading when data is fetched
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setErrorMessage('Failed to fetch products.');
        setLoading(false);  // Stop loading if an error occurs
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (errorMessage) return <div>{errorMessage}</div>;

  return (
    <div>
      <h1 className="font-bold text-3xl mb-4 text-white text-center">Products page</h1>

      <div className="flex justify-end mb-4">
        <Link href="/products/new" className="bg-blue-500 text-white p-2 rounded-lg">
          Add New Product
        </Link>
      </div>

      {!products.length ? (
        <div className="text-white text-center">No products found. You can add a new product.</div>
      ) : (
        <table className="min-w-full table-auto bg-black text-white border-collapse border border-gray-800">
          <thead>
            <tr>
              <th className="border border-gray-800 px-4 py-2 text-center">Product Name</th>
              <th className="border border-gray-800 px-4 py-2 text-center">Price</th>
              <th className="border border-gray-800 px-4 py-2 text-center">Stock Quantity</th>
              <th className="border border-gray-800 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="text-center">
                <td className="border border-gray-800 px-4 py-2 text-center">{product.name}</td>
                <td className="border border-gray-800 px-4 py-2 text-center">${product.price}</td>
                <td className="border border-gray-800 px-4 py-2 text-center">{product.stockQuantity}</td>
                <td className="border border-gray-800 px-4 py-2 text-center">
                  <Link href={`/products/${product._id}`} className="text-blue-500 underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link href="/" className="bg-gray-500 text-white p-2 mt-4 inline-block text-center">
        Back to Home
      </Link>
    </div>
  );
}
