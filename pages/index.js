import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <h1 className="font-bold text-4xl mb-8 text-white">
        Welcome to the Inventory Management System
      </h1>
      <nav className="space-y-4">
        <Link href="/products" className="block w-60 text-center bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-lg shadow-md transition duration-300 ease-in-out text-xl">
          Manage Products
        </Link>
        <Link href="/suppliers" className="block w-60 text-center bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg shadow-md transition duration-300 ease-in-out text-xl">
          Manage Suppliers
        </Link>
        <Link href="/orders" className="block w-60 text-center bg-red-500 hover:bg-red-600 text-white py-4 rounded-lg shadow-md transition duration-300 ease-in-out text-xl">
          Manage Orders
        </Link>
      </nav>
    </div>
  );
}
