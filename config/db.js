import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // For local development, your URI looks like:
    // mongodb://127.0.0.1:27017/your_database_name
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/your_database_name");
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed', error);
    process.exit(1);
  }
};