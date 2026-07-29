import { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Plus, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-textMain">Inventory Management</h1>
          <p className="text-textMuted text-sm">Track products across warehouses</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Item
        </button>
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
