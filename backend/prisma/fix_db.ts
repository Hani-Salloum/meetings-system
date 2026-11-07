import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  // write the code here to fix the db
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
