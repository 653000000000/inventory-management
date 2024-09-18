import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query; // Get product ID from the URL

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false); // State for delete action

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const res = await axios.get(`/api/products/${id}`);
          setProduct(res.data.data);
          setLoading(false);
        } catch (error) {
          console.error('Failed to fetch product:', error);
          setErrorMessage('Failed to fetch product. Please try again.');
          setLoading(false);
        }
      };

      fetchProduct();
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

  if (loading) return <div>Loading...</div>; // Show loading state
  if (errorMessage) return <div>{errorMessage}</div>; // Show error message
  if (!product) return <div>No product found.</div>; // Handle case where product is not found

  return (
    <div>
      <h1 className="font-bold text-3xl mb-4 text-white">{product.name}</h1>

      <p className="text-white mb-2">Category: {product.category || 'N/A'}</p>
      <p className="text-white mb-2">Price: ${product.price}</p>
      <p className="text-white mb-2">Stock Quantity: {product.stockQuantity}</p>
      <p className="text-white mb-4">
        Supplier: {product.supplierId?.name || 'N/A'}
      </p>

      {/* Edit and Delete Buttons */}
      <div className="flex space-x-4 mt-4">
        <Link href={`/products/edit/${id}`} className="bg-blue-500 text-white p-2 rounded-lg">
          Edit Product
        </Link>

        <button
          onClick={handleDelete}
          className={`bg-red-500 text-white p-2 rounded-lg ${isDeleting ? 'opacity-50' : ''}`}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete Product'}
        </button>
      </div>

      <Link href="/products" className="bg-gray-500 text-white p-2 inline-block mt-4">
        Back to Products
      </Link>
    </div>
  );
}
