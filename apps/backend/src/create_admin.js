const prisma = require('./config/db');
const bcrypt = require('bcryptjs');

async function main() {
  const email = 'admin@contractor.com';
  const password = 'adminpassword';
  const name = 'Contractor Boss';
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN',
      },
    });
    console.log('Admin user created/verified:', user.email);
  } catch (err) {
    console.error('Error creating admin:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
