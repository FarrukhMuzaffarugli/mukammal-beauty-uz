import { connectDatabase, disconnectDatabase } from '../config/db';
import { User } from '../models/User';
import { hashPassword } from '../utils/password';

const run = async () => {
  await connectDatabase();

  const email = process.env.ADMIN_EMAIL ?? 'admin@beautyuz.uz';
  const password = process.env.ADMIN_PASSWORD ?? 'SuperSecure123';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin already exists');
    await disconnectDatabase();
    return;
  }

  const hashed = await hashPassword(password);

  await User.create({
    name: 'Super Admin',
    email,
    password: hashed,
    roles: ['admin']
  });

  console.log(`Admin created with email ${email}`);
  await disconnectDatabase();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
