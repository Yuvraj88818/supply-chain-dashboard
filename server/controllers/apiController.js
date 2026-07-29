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

    res.json({
      totalSuppliers, activeSuppliers, totalWarehouses, totalShipments,
      pendingShipments, deliveredShipments, delayedShipments, inventoryItems
    });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getAnalytics = async (req, res) => {
  try {
    // Mock analytics logic (can aggregate from actual data)
    const monthlyDeliveries = [
      { name: 'Jan', deliveries: 400 },
      { name: 'Feb', deliveries: 300 },
      { name: 'Mar', deliveries: 550 },
      { name: 'Apr', deliveries: 480 },
      { name: 'May', deliveries: 600 },
      { name: 'Jun', deliveries: 700 },
    ];
    
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
