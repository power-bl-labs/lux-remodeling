import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email =
    process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase() ??
    "admin@luxremodeling.com";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const name = process.env.SEED_ADMIN_NAME ?? "Lux Admin";

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: {
      email,
    },
    update: {
      name,
      hashedPassword,
      role: UserRole.ADMIN,
    },
    create: {
      email,
      name,
      hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log(`Seeded admin user: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
