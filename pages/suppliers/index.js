import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);  // Added loading state
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get('/api/suppliers');
        setSuppliers(res.data.data);
        setLoading(false);  // Stop loading when data is fetched
      } catch (error) {
        console.error('Failed to fetch suppliers:', error);
        setErrorMessage('Failed to fetch suppliers.');
        setLoading(false);  // Stop loading if an error occurs
      }
    };

    fetchSuppliers();
  }, []);

  if (loading) return <div>Loading...</div>;  // Show loading state
  if (errorMessage) return <div>{errorMessage}</div>;  // Show error message

  return (
    <div>
      <h1 className="font-bold text-3xl mb-4 text-white text-center">Suppliers page</h1>

      <div className="flex justify-end mb-4">
        <Link href="/suppliers/new" className="bg-blue-500 text-white p-2 rounded-lg">
          Add New Supplier
        </Link>
      </div>

      {!suppliers.length ? (
        <div className="text-white text-center">No suppliers found.</div>
      ) : (
        <table className="min-w-full table-auto bg-black text-white border-collapse border border-gray-800">
          <thead>
            <tr>
              <th className="border border-gray-800 px-4 py-2 text-center">Supplier Name</th>
              <th className="border border-gray-800 px-4 py-2 text-center">Email</th>
              <th className="border border-gray-800 px-4 py-2 text-center">Phone Number</th>
              <th className="border border-gray-800 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier._id} className="text-center">
                <td className="border border-gray-800 px-4 py-2 text-center">{supplier.name}</td>
                <td className="border border-gray-800 px-4 py-2 text-center">{supplier.contactEmail}</td>
                <td className="border border-gray-800 px-4 py-2 text-center">{supplier.phone}</td>
                <td className="border border-gray-800 px-4 py-2 text-center">
                  <Link href={`/suppliers/${supplier._id}`} className="text-blue-500 underline">
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
