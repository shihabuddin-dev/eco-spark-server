import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/auth";

const seed = async () => {
  console.log("🌱 Seeding database...");

  try {
    // 1. Create admin user
    const adminPassword = await hashPassword("admin123");
    const admin = await prisma.user.upsert({
      where: { email: "admin@ecospark.com" },
      update: {},
      create: {
        name: "EcoSpark Admin",
        email: "admin@ecospark.com",
        password: adminPassword,
        role: "ADMIN",
        status: "ACTIVE",
      },
    });
    console.log(`✅ Admin user created: ${admin.email}`);

    // 2. Create default categories
    const categories = [
      {
        name: "Energy",
        description: "Solar, wind, and renewable energy ideas",
      },
      {
        name: "Waste",
        description: "Recycling, composting, and waste reduction ideas",
      },
      {
        name: "Transportation",
        description: "Green vehicles, public transit, and mobility solutions",
      },
      {
        name: "Water",
        description: "Conservation, purification, and water management ideas",
      },
      {
        name: "Agriculture",
        description: "Sustainable farming and food production ideas",
      },
    ];

    for (const cat of categories) {
      await prisma.category.upsert({
        where: { name: cat.name },
        update: {},
        create: cat,
      });
      console.log(`✅ Category created: ${cat.name}`);
    }

    console.log("\n🎉 Seeding completed successfully!");
    console.log("Admin credentials: admin@ecospark.com / admin123");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await prisma.$disconnect();
  }
};

seed();
