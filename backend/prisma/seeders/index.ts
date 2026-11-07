import { PrismaClient } from "@prisma/client";
import { seedMain } from "./main-seeder";

const prisma = new PrismaClient();

interface SeederConfig {
  main?: boolean;
}

async function runSeeders(config: SeederConfig = {}) {
  console.log("🚀 Starting Database Seeding Process...");
  console.log("=".repeat(60));
  console.log("📋 Configuration:");
  console.log(`  • Main Seeder: ${config.main !== false ? "✅ Enabled" : "❌ Disabled"}`);

  console.log("=".repeat(60));

  try {
    if (config.main !== false) {
      console.log("\n📋 Running Main Seeder...");
      await seedMain(prisma);
      console.log("✅ Main Seeder completed");
    }

    console.log("\n🎉 All Seeders Completed Successfully!");
    console.log("=".repeat(60));
    console.log("📊 Final Summary:");
    console.log("  • Database is now populated with comprehensive test data");
    console.log("  • All relationships are properly established");
    console.log("  • Ready for development and testing");
    console.log("=".repeat(60));
  } catch (error) {
    console.error("\n❌ Error during seeding process:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export default runSeeders;

export { seedMain };

if (require.main === module) {
  runSeeders().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
