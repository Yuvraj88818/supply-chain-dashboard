import { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Plus, Package, Filter, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { exportToCSV } from '../utils/exportCsv';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ productName: '', sku: '', quantity: '', price: '', warehouseId: '', supplierId: '' });
  const [warehousesList, setWarehousesList] = useState([]);
  const [suppliersList, setSuppliersList] = useState([]);

  useEffect(() => {
    fetchInventory();
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const wRes = await api.get('/warehouses');
      const sRes = await api.get('/suppliers');
      setWarehousesList(wRes.data);
      setSuppliersList(sRes.data);
    } catch (error) {
      console.error('Failed to load dropdown data', error);
    }
  };

  const fetchInventory = async () => {
    try {
      const { data } = await api.get('/inventory');
      setInventory(data);
    } catch (error) {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleAddInventory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/inventory', {
        ...formData,
        quantity: parseInt(formData.quantity, 10),
        price: parseFloat(formData.price)
      });
      toast.success('Item added successfully!');
      setShowModal(false);
      setFormData({ productName: '', sku: '', quantity: '', price: '', warehouseId: '', supplierId: '' });
      fetchInventory();
    } catch (error) {
      toast.error('Failed to add item');
    }
  };

  const filteredInventory = inventory.filter(item => 
    item.productName.toLowerCase().includes(search.toLowerCase()) || 
    item.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
      {/* Add Inventory Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="card w-full max-w-lg glass animate-slide-up border-primary/20 relative">
            <h2 className="text-2xl font-bold text-textMain mb-4">Add Inventory Item</h2>
            <form onSubmit={handleAddInventory} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-textMuted mb-1">Product Name</label>
                  <input type="text" required className="input-field" placeholder="MacBook Pro M3" 
                    value={formData.productName} onChange={e => setFormData({...formData, productName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-textMuted mb-1">SKU</label>
                  <input type="text" required className="input-field" placeholder="SKU-123" 
                    value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-textMuted mb-1">Price ($)</label>
                  <input type="number" step="0.01" required className="input-field" placeholder="1999.99" 
                    value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-textMuted mb-1">Quantity</label>
                  <input type="number" required className="input-field" placeholder="50" 
                    value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-textMuted mb-1">Warehouse</label>
                  <select required className="input-field" value={formData.warehouseId} onChange={e => setFormData({...formData, warehouseId: e.target.value})}>
                    <option value="">Select Warehouse...</option>
                    {warehousesList.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-textMuted mb-1">Supplier</label>
                  <select required className="input-field" value={formData.supplierId} onChange={e => setFormData({...formData, supplierId: e.target.value})}>
                    <option value="">Select Supplier...</option>
                    {suppliersList.map(s => <option key={s.id} value={s.id}>{s.name} ({s.company})</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-4 mt-6 pt-4 border-t border-border">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textMain">Inventory</h1>
          <p className="text-textMuted text-sm mt-1">Manage stock across all locations</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => exportToCSV(inventory, 'inventory_report')} className="btn-secondary flex items-center gap-2">
            <Download size={18} /> Export CSV
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={18} /> Filters
          </button>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Add Item
          </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-textMuted">
            <thead className="text-xs text-textMuted uppercase bg-surface border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">SKU</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                 <tr><td colSpan="5" className="px-6 py-8 text-center text-textMuted">Loading...</td></tr>
              ) : inventory.map((item) => {
                const isLowStock = item.quantity <= item.minStock;
                return (
                  <tr key={item.id} className="border-b border-border hover:bg-slate-800/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                          <Package size={20} />
                        </div>
                        <div className="font-medium text-textMain">{item.productName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{item.sku}</td>
                    <td className="px-6 py-4">{item.category}</td>
                    <td className="px-6 py-4 font-medium text-textMain">{item.quantity}</td>
                    <td className="px-6 py-4">
                      {isLowStock ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500">Low Stock</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">In Stock</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
