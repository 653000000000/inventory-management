import connectToDatabase from '../../../lib/mongodb';
import Supplier from '../../../models/Supplier';

export default async function handler(req, res) {
  await connectToDatabase();

  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case 'GET':
      try {
        const supplier = await Supplier.findById(id);
        if (!supplier) {
          return res.status(404).json({ success: false, error: 'Supplier not found' });
        }
        res.status(200).json({ success: true, data: supplier });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PUT':
      try {
        const supplier = await Supplier.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!supplier) {
          return res.status(404).json({ success: false, error: 'Supplier not found' });
        }
        res.status(200).json({ success: true, data: supplier });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const deletedSupplier = await Supplier.deleteOne({ _id: id });
        if (!deletedSupplier.deletedCount) {
          return res.status(404).json({ success: false, error: 'Supplier not found' });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
