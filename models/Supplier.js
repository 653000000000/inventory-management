import mongoose from 'mongoose';

const SupplierSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  contactEmail: { type: String, required: true }, 
  phone: { type: String, required: true }, 
  address: { type: String }, 
});

export default mongoose.models.Supplier || mongoose.model('Supplier', SupplierSchema);
