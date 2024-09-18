// components/Navbar.js

import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <nav className="flex space-x-4 mb-4">
      {currentPath === '/' ? (
        <span className="bg-gray-300 text-gray-700 p-2 cursor-default">Home Page</span>
      ) : (
        <Link href="/" className="bg-gray-500 text-white p-2">
          Home Page
        </Link>
      )}
      {currentPath.startsWith('/products') ? (
        <span className="bg-gray-300 text-gray-700 p-2 cursor-default">Products</span>
      ) : (
        <Link href="/products" className="bg-gray-500 text-white p-2">
          Products
        </Link>
      )}
      {currentPath.startsWith('/suppliers') ? (
        <span className="bg-gray-300 text-gray-700 p-2 cursor-default">Suppliers</span>
      ) : (
        <Link href="/suppliers" className="bg-gray-500 text-white p-2">
          Suppliers
        </Link>
      )}
      {currentPath.startsWith('/orders') ? (
        <span className="bg-gray-300 text-gray-700 p-2 cursor-default">Orders</span>
      ) : (
        <Link href="/orders" className="bg-gray-500 text-white p-2">
        Orders
        </Link>
      )}
    </nav>
  );
}
