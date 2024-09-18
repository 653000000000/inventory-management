import connectToDatabase from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    res.status(200).json({ message: "Database connected successfully!" });
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect to database.' });
  }
}
