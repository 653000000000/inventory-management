// pages/api/suppliers/index.js
import connectToDatabase from '../../../lib/mongodb';
import Supplier from '../../../models/Supplier';

export default async function handler(req, res) {
  await connectToDatabase();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const suppliers = await Supplier.find({});
        res.status(200).json({ success: true, data: suppliers });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const supplier = await Supplier.create(req.body);
        res.status(201).json({ success: true, data: supplier });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
