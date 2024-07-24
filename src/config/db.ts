import mongoose from 'mongoose';

const connectToDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('ERROR: MONGO_URI environment variable not defined');
    throw new Error('MONGO_URI environment variable not defined');
  }

  try {
    const connection = await mongoose.connect(mongoUri);
    console.log(`Successfully connected to MongoDB at ${connection.connection.host} 👍`);
  } catch (error) {
    console.error(`ERROR: Unable to connect to MongoDB: ${error.message}`);
    throw error;
  }
};

export default connectToDB;