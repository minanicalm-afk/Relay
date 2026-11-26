require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@techgive.co.ke").toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "TechGive Admin";

  if (!password) {
    throw new Error("Set ADMIN_PASSWORD in .env before running npm run db:seed.");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin account already exists: ${email}`);
    return;
  }

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: bcrypt.hashSync(password, 12),
      role: "SUPER_ADMIN",
      active: true,
    },
  });

  console.log(`Created super admin: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
