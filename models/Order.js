// models/Order.js

import mongoose from 'mongoose';

const ProductItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema({
  products: [ProductItemSchema],
  orderDate: { type: Date, default: Date.now },
  customerName: { type: String, required: true },
  totalCost: { type: Number },
  trackingNumber: { type: String, default: null }, // Optional field
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered'],
    default: 'Pending',
  },
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
