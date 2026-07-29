const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const c = require('../controllers/apiController');

router.use(protect);

router.get('/suppliers', c.getSuppliers);
router.get('/suppliers/:id', c.getSupplierById);
router.post('/suppliers', c.createSupplier);
router.put('/suppliers/:id', c.updateSupplier);
router.delete('/suppliers/:id', c.deleteSupplier);

router.get('/warehouses', c.getWarehouses);
router.post('/warehouses', c.createWarehouse);
router.put('/warehouses/:id', c.updateWarehouse);
router.delete('/warehouses/:id', c.deleteWarehouse);

router.get('/inventory', c.getInventory);
router.post('/inventory', c.createInventory);
router.put('/inventory/:id', c.updateInventory);
router.delete('/inventory/:id', c.deleteInventory);

router.get('/shipments', c.getShipments);
router.post('/shipments', c.createShipment);
router.put('/shipments/:id', c.updateShipment);
router.delete('/shipments/:id', c.deleteShipment);

router.get('/dashboard', c.getDashboard);
router.get('/analytics', c.getAnalytics);

module.exports = router;
