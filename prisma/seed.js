try {
  require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
} catch {
  // Prisma loads .env for `prisma db seed`. A direct node run still works when DATABASE_URL is already set.
}

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || "novacycletechnologies@gmail.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "qwerty";
  const name = process.env.ADMIN_NAME || "Novacycle Admin";
  const legacyEmail = "admin@josachi.com";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (existing.role !== "SUPER_ADMIN" || !existing.active) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { role: "SUPER_ADMIN", active: true },
      });
      console.log(`Promoted existing account to super admin: ${email}`);
      return;
    }
    console.log(`Super admin already exists: ${email}`);
    return;
  }

  const legacy = await prisma.user.findUnique({ where: { email: legacyEmail } });
  if (legacy) {
    await prisma.user.update({
      where: { id: legacy.id },
      data: { email, name: legacy.name === "Josachi Admin" ? name : legacy.name },
    });
    console.log(`Updated super admin email to ${email}`);
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
