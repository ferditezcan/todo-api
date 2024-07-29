import express, { Request, Response } from 'express';
import cors from 'cors';
import connectToDB from './config/db';
import dotenv from 'dotenv';
import categoryRoutes from "./routes/category.routes"
import userRoutes from './routes/user.routes';
import taskRoutes from './routes/task.routes';

dotenv.config();

const application = express();
application.use(express.json());
application.use(cors());

const PORT = process.env.PORT;

if (!PORT) {
  console.error('ERROR: PORT environment variable not defined');
  process.exit(1);
}

const startServer = async () => {
  try {
    await connectToDB();
    application.get('/ping', (request: Request, response: Response) => {
      response.send('Pong');
    });

    application.use('/users', userRoutes);
    application.use("/categories", categoryRoutes)
    application.use('/tasks', taskRoutes);

    application.listen(PORT, () => {
      console.log(`Server up and running on port ${PORT}`);
    });
  } catch (error) {
    console.error('ERROR: Failed to start server', error);
    process.exit(1);
  }
};

startServer();