import app from './app';
import { env } from './config/env';
import { connectDatabase } from './config/db';

const start = async () => {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(`🚀 API ready on port ${env.port}`);
  });
};

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
