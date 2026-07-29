const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing dummy data...');
  
  // Delete in order to avoid foreign key constraints
  await prisma.inventory.deleteMany({});
  await prisma.shipment.deleteMany({});
  await prisma.supplier.deleteMany({});
  await prisma.warehouse.deleteMany({});
  
  console.log('All dummy data cleared successfully! Ready for real-world use.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
