const prisma = require('../db');

const getSuppliers = async (req, res) => {
  try {
    const data = await prisma.supplier.findMany();
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getSupplierById = async (req, res) => {
  try {
    const data = await prisma.supplier.findUnique({ where: { id: req.params.id } });
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const createSupplier = async (req, res) => {
  try {
    const data = await prisma.supplier.create({ data: req.body });
    res.status(201).json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const updateSupplier = async (req, res) => {
  try {
    const data = await prisma.supplier.update({ where: { id: req.params.id }, data: req.body });
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const deleteSupplier = async (req, res) => {
  try {
    await prisma.supplier.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// Warehouses
const getWarehouses = async (req, res) => {
  try {
    const data = await prisma.warehouse.findMany();
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const createWarehouse = async (req, res) => {
  try {
    const data = await prisma.warehouse.create({ data: req.body });
    res.status(201).json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const updateWarehouse = async (req, res) => {
  try {
    const data = await prisma.warehouse.update({ where: { id: req.params.id }, data: req.body });
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const deleteWarehouse = async (req, res) => {
  try {
    await prisma.warehouse.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// Inventory
const getInventory = async (req, res) => {
  try {
    const data = await prisma.inventory.findMany({ include: { warehouse: true, supplier: true } });
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const createInventory = async (req, res) => {
  try {
    const data = await prisma.inventory.create({ data: req.body });
    res.status(201).json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const updateInventory = async (req, res) => {
  try {
    const data = await prisma.inventory.update({ where: { id: req.params.id }, data: req.body });
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const deleteInventory = async (req, res) => {
  try {
    await prisma.inventory.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// Shipments
const getShipments = async (req, res) => {
  try {
    const data = await prisma.shipment.findMany({ include: { warehouse: true, supplier: true } });
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const createShipment = async (req, res) => {
  try {
    const data = await prisma.shipment.create({ data: req.body });
    res.status(201).json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const updateShipment = async (req, res) => {
  try {
    const data = await prisma.shipment.update({ where: { id: req.params.id }, data: req.body });
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const deleteShipment = async (req, res) => {
  try {
    await prisma.shipment.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// Dashboard & Analytics
const getDashboard = async (req, res) => {
  try {
    const totalSuppliers = await prisma.supplier.count();
    const activeSuppliers = await prisma.supplier.count({ where: { status: 'Active' } });
    const totalWarehouses = await prisma.warehouse.count();
    const totalShipments = await prisma.shipment.count();
    const pendingShipments = await prisma.shipment.count({ where: { status: 'Pending' } });
    const deliveredShipments = await prisma.shipment.count({ where: { status: 'Delivered' } });
    const delayedShipments = await prisma.shipment.count({ where: { status: 'Delayed' } });
    const inventoryItems = await prisma.inventory.count();

    const latestShipments = await prisma.shipment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { warehouse: true, supplier: true }
    });

    res.json({
      totalSuppliers, activeSuppliers, totalWarehouses, totalShipments,
      pendingShipments, deliveredShipments, delayedShipments, inventoryItems,
      recentActivity: latestShipments
    });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getAnalytics = async (req, res) => {
  try {
    const allShipments = await prisma.shipment.findMany({
      orderBy: { estimatedDelivery: 'asc' }
    });

    // Group by month
    const monthCounts = {
      'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'May': 0, 'Jun': 0,
      'Jul': 0, 'Aug': 0, 'Sep': 0, 'Oct': 0, 'Nov': 0, 'Dec': 0
    };

    allShipments.forEach(s => {
      if (s.estimatedDelivery) {
        const date = new Date(s.estimatedDelivery);
        const monthName = date.toLocaleString('default', { month: 'short' });
        if (monthCounts[monthName] !== undefined) {
          monthCounts[monthName]++;
        }
      }
    });

    const monthlyDeliveries = Object.keys(monthCounts).map(name => ({
      name,
      deliveries: monthCounts[name]
    })).filter(m => m.deliveries > 0 || ['Jan','Feb','Mar','Apr','May','Jun'].includes(m.name)); // keep at least 6 months for UI

    res.json({
      monthlyDeliveries
    });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = {
  getSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier,
  getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse,
  getInventory, createInventory, updateInventory, deleteInventory,
  getShipments, createShipment, updateShipment, deleteShipment,
  getDashboard, getAnalytics
};
