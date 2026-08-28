import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@nodewave.com" },
    update: { password: adminPassword, role: "ADMIN", fullName: "Admin NodeWave" },
    create: {
      email: "admin@nodewave.com",
      fullName: "Admin NodeWave",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash("user123", 10);
  const user = await prisma.user.upsert({
    where: { email: "user@nodewave.com" },
    update: { password: userPassword, role: "USER", fullName: "User NodeWave" },
    create: {
      email: "user@nodewave.com",
      fullName: "User NodeWave",
      password: userPassword,
      role: "USER",
    },
  });

  // Create sample todos
  const todos = [
    { item: "Belajar Next.js API Routes", userId: user.id },
    { item: "Setup PostgreSQL Database", userId: user.id },
    { item: "Implementasi Auth System", userId: user.id, isDone: true },
    { item: "Buat Todo CRUD", userId: admin.id },
    { item: "Deploy ke Vercel", userId: admin.id },
  ];

  for (const todo of todos) {
    await prisma.todo.create({ data: todo });
  }

  console.log("✅ Seed completed!");
  console.log("📧 Admin: admin@nodewave.com / admin123");
  console.log("📧 User: user@nodewave.com / user123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
