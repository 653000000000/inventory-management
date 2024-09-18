import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ViewEditOrderPage() {
  const router = useRouter();
  const { id } = router.query;

  const [order, setOrder] = useState(null);
  const [productsList, setProductsList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // Track if user is about to delete
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/orders/${id}`)
        .then((res) => setOrder(res.data.data))
        .catch((error) => console.error('Failed to fetch order:', error));
      axios
        .get('/api/products')
        .then((res) => setProductsList(res.data.data))
        .catch((error) => console.error('Failed to fetch products:', error));
    }
  }, [id]);

  const handleProductChange = (index, e) => {
    const newProducts = [...order.products];
    newProducts[index][e.target.name] = e.target.value;
    setOrder({ ...order, products: newProducts });
  };

  const saveOrder = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/orders/${id}`, order);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update order:', error);
      setErrorMessage('Failed to update order. Please try again.');
    }
  };

  const deleteOrder = async (restoreStock = false) => {
    try {
      // Delete the order and optionally restore stock
      await axios.delete(`/api/orders/${id}`, {
        data: { restoreStock }, // Send the restoreStock flag in the request body
      });

      // Redirect to the orders list after deletion
      router.push('/orders');
    } catch (error) {
      console.error('Failed to delete order:', error);
      setErrorMessage('Failed to delete order. Please try again.');
    }
  };

  // Calculate total cost of the order
  const calculateTotalCost = () => {
    return order.products.reduce((total, product) => {
      return product.productId
        ? total + product.productId.price * product.quantity // Multiply price by quantity
        : total;
    }, 0);
  };

  if (!order) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="font-bold text-3xl mb-4 text-white">
        {isEditing ? 'Edit Order' : 'Order Details'}
      </h1>

      {errorMessage && (
        <div className="bg-red-500 text-white p-2 mb-4 rounded">{errorMessage}</div>
      )}

      {isEditing ? (
        <form onSubmit={saveOrder}>
          <label className="block mb-2 text-white">Customer Name:</label>
          <input
            type="text"
            value={order.customerName}
            onChange={(e) => setOrder({ ...order, customerName: e.target.value })}
            className="text-black bg-white border p-2 mb-4 w-full"
          />

          <h2 className="text-white font-bold mb-2">Products</h2>
          {order.products.map((product, index) => (
            <div key={index} className="flex items-center mb-2">
              <select
                name="productId"
                value={product.productId ? product.productId._id : ''}
                onChange={(e) => handleProductChange(index, e)}
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
                value={product.quantity}
                onChange={(e) => handleProductChange(index, e)}
                className="text-black bg-white border p-2 mr-2 w-24"
              />
            </div>
          ))}

          <button type="submit" className="bg-blue-500 text-white p-2 mt-4">
            Save Order
          </button>
        </form>
      ) : (
        <div>
          <p className="text-white mb-2">
            <strong>Customer Name:</strong> {order.customerName}
          </p>
          <p className="text-white mb-2">
            <strong>Status:</strong> {order.status}
          </p>
          <div className="text-white mb-4">
            <strong>Products:</strong>
            <ul>
              {order.products.map((product, index) => (
                <li key={index}>
                  {product.productId ? (
                    <>
                      {product.productId.name} - Price: ${product.productId.price} - Quantity: {product.quantity} - Total: $
                      {(product.productId.price * product.quantity).toFixed(2)}
                    </>
                  ) : (
                    <span className="text-red-500">Deleted Product - Quantity: {product.quantity}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Display the total cost */}
          <p className="text-white font-bold text-xl">
            Total Cost: ${calculateTotalCost().toFixed(2)}
          </p>

          {/* Edit and Delete Buttons */}
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white p-2 mr-2"
          >
            Edit Order
          </button>

          {!isDeleting ? (
            // Show the delete button initially
            <button
              onClick={() => setIsDeleting(true)}
              className="bg-red-500 text-white p-2"
            >
              Delete Order
            </button>
          ) : (
            // Once delete is clicked, show the two confirm options
            <div className="mt-4">
              <p className="text-white mb-2">Do you want to return the product quantities to the inventory?</p>
              <button
                onClick={() => deleteOrder(true)} // Return product quantities
                className="bg-green-500 text-white p-2 mr-2"
              >
                Yes, Return Quantities
              </button>
              <button
                onClick={() => deleteOrder(false)} // Just delete the order
                className="bg-red-500 text-white p-2"
              >
                No, Just Delete
              </button>
            </div>
          )}
        </div>
      )}

      <Link href="/orders" className="bg-gray-500 text-white p-2 mt-4 inline-block">
        Back to Orders
      </Link>
    </div>
  );
}
