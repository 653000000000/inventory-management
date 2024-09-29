// pages/api/orders/[id].js

import connectToDatabase from '../../../lib/mongodb';
import Order from '../../../models/Order';
import Product from '../../../models/Product';

export default async function handler(req, res) {
  await connectToDatabase();

  const { id } = req.query;
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const order = await Order.findById(id).populate('products.productId').exec();
        if (!order) {
          return res.status(404).json({ success: false, error: 'Order not found' });
        }
        res.status(200).json({ success: true, data: order });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PUT':
      try {
        const updatedOrder = req.body;

        // Find the existing order
        const existingOrder = await Order.findById(id).populate('products.productId');
        if (!existingOrder) {
          return res.status(404).json({ success: false, error: 'Order not found' });
        }

        // Adjust product quantities based on the difference in order quantities
        for (let i = 0; i < updatedOrder.products.length; i++) {
          const updatedProduct = updatedOrder.products[i];
          const existingProduct = existingOrder.products[i];

          const product = await Product.findById(updatedProduct.productId._id);

          if (!product) {
            return res.status(404).json({ success: false, error: `Product not found: ${updatedProduct.productId._id}` });
          }

          // Calculate the difference in quantity between the original and updated order
          const quantityDifference = existingProduct.quantity - updatedProduct.quantity;

          // If the quantity difference is positive, increase product stock
          // If the quantity difference is negative, decrease product stock
          await Product.findByIdAndUpdate(
            updatedProduct.productId._id,
            { $inc: { stockQuantity: quantityDifference } }
          );
        }

        // Update the order with the new data, including trackingNumber
        const order = await Order.findByIdAndUpdate(id, updatedOrder, {
          new: true,
          runValidators: true,
        });

        res.status(200).json({ success: true, data: order });
      } catch (error) {
        console.error('Error updating order:', error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const order = await Order.findById(id).populate('products.productId');
        if (!order) {
          return res.status(404).json({ success: false, error: 'Order not found' });
        }

        // Check if the client requests stock restoration
        if (req.body.restoreStock) {
          for (const product of order.products) {
            await Product.findByIdAndUpdate(
              product.productId._id,
              { $inc: { stockQuantity: product.quantity } }
            );
          }
        }

        // Delete the order
        const deletedOrder = await Order.deleteOne({ _id: id });
        if (!deletedOrder.deletedCount) {
          return res.status(404).json({ success: false, error: 'Order could not be deleted' });
        }

        res.status(200).json({ success: true, message: 'Order deleted successfully' });
      } catch (error) {
        console.error('Error deleting order:', error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
