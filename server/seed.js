const prisma = require('./db');
const bcrypt = require('bcryptjs');

async function main() {
  console.log('Clearing old data...');
  await prisma.shipment.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding Users...');
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('admin123', salt);
  await prisma.user.create({
    data: { name: 'Admin User', email: 'admin@logistics.com', password: hash, role: 'ADMIN' },
  });

  console.log('Seeding Suppliers...');
  const s1 = await prisma.supplier.create({
    data: { name: 'Acme Corp', company: 'Acme Logistics', email: 'contact@acme.com', phone: '+1234567890', address: '123 Acme St', country: 'USA', rating: 4.8, products: 'Electronics, Gadgets' },
  });
  const s2 = await prisma.supplier.create({
    data: { name: 'Global Tech', company: 'Global Tech Industries', email: 'info@globaltech.com', phone: '+0987654321', address: '456 Tech Blvd', country: 'Germany', rating: 4.5, products: 'Hardware, Servers' },
  });

  console.log('Seeding Warehouses...');
  const w1 = await prisma.warehouse.create({
    data: { name: 'NY Central Hub', location: 'New York, USA', capacity: 100000, usedCapacity: 45000, managerName: 'John Doe', contactNumber: '+1122334455' },
  });
  const w2 = await prisma.warehouse.create({
    data: { name: 'Berlin Distribution', location: 'Berlin, Germany', capacity: 80000, usedCapacity: 60000, managerName: 'Jane Smith', contactNumber: '+5544332211' },
  });

  console.log('Seeding Inventory...');
  await prisma.inventory.createMany({
    data: [
      { productName: 'MacBook Pro 16', sku: 'MBP16-01', category: 'Laptops', quantity: 150, minStock: 20, unitPrice: 2499.99, warehouseId: w1.id, supplierId: s1.id },
      { productName: 'Dell XPS 15', sku: 'DXPS15-02', category: 'Laptops', quantity: 80, minStock: 15, unitPrice: 1899.99, warehouseId: w1.id, supplierId: s2.id },
      { productName: 'Server Rack 42U', sku: 'SR42U-01', category: 'Server Hardware', quantity: 25, minStock: 5, unitPrice: 850.00, warehouseId: w2.id, supplierId: s2.id },
      { productName: 'Cisco Switch', sku: 'CSW-01', category: 'Networking', quantity: 120, minStock: 30, unitPrice: 450.00, warehouseId: w2.id, supplierId: s1.id },
    ]
  });

  console.log('Seeding Shipments...');
  await prisma.shipment.create({
    data: { trackingId: 'TRK-1001', destination: 'Los Angeles, USA', shipmentDate: new Date('2026-07-20'), expectedDelivery: new Date('2026-07-25'), actualDelivery: new Date('2026-07-24'), status: 'Delivered', priority: 'High', shippingCost: 1250.00, warehouseId: w1.id, supplierId: s1.id },
  });
  await prisma.shipment.create({
    data: { trackingId: 'TRK-1002', destination: 'London, UK', shipmentDate: new Date('2026-07-28'), expectedDelivery: new Date('2026-08-05'), status: 'In Transit', priority: 'Medium', shippingCost: 3400.00, warehouseId: w2.id, supplierId: s2.id },
  });
  await prisma.shipment.create({
    data: { trackingId: 'TRK-1003', destination: 'Tokyo, Japan', shipmentDate: new Date('2026-07-29'), expectedDelivery: new Date('2026-08-10'), status: 'Pending', priority: 'Low', shippingCost: 800.00, warehouseId: w1.id, supplierId: s2.id },
  });

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
