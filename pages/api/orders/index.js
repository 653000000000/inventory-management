// pages/api/orders/index.js

import connectToDatabase from '../../../lib/mongodb';
import Order from '../../../models/Order';
import Product from '../../../models/Product';

export default async function handler(req, res) {
  await connectToDatabase();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        // Fetch all orders and populate product details
        const orders = await Order.find({})
          .populate('products.productId') // Populate the product details for each order
          .exec();
        res.status(200).json({ success: true, data: orders });
      } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const { customerName, products, status, trackingNumber } = req.body;

        // Validate stock availability for each product
        for (const item of products) {
          const product = await Product.findById(item.productId);

          if (!product) {
            return res.status(404).json({ success: false, error: `Product with ID ${item.productId} not found.` });
          }

          if (product.stockQuantity < item.quantity) {
            return res.status(400).json({
              success: false,
              error: `Insufficient stock for product "${product.name}". Available: ${product.stockQuantity}, Requested: ${item.quantity}.`,
            });
          }
        }

        // Update stock quantities for each product
        for (const item of products) {
          await Product.findByIdAndUpdate(
            item.productId,
            { $inc: { stockQuantity: -item.quantity } }
          );
        }

        // Create the order, including trackingNumber
        const order = await Order.create({ customerName, products, status, trackingNumber });

        res.status(201).json({ success: true, data: order });
      } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, error: 'Server error.' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
