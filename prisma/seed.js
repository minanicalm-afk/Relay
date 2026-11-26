try {
  require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
} catch {
  // Prisma loads .env for `prisma db seed`. A direct node run still works when DATABASE_URL is already set.
}

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@josachi.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "qwerty";
  const name = process.env.ADMIN_NAME || "Josachi Admin";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Super admin already exists: ${email}`);
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
