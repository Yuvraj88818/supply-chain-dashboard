import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', capacity: '', currentLoad: '' });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const { data } = await api.get('/warehouses');
      setWarehouses(data);
    } catch (error) {
      toast.error('Failed to load warehouses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddWarehouse = async (e) => {
    e.preventDefault();
    try {
      await api.post('/warehouses', {
        ...formData,
        capacity: parseInt(formData.capacity, 10),
        currentLoad: parseInt(formData.currentLoad, 10)
      });
      toast.success('Warehouse added successfully!');
      setShowModal(false);
      setFormData({ name: '', location: '', capacity: '', currentLoad: '' });
      fetchWarehouses();
    } catch (error) {
      toast.error('Failed to add warehouse');
    }
  };

  if (loading) return <div className="p-8 text-center text-textMuted">Loading...</div>;

  return (
    <div className="space-y-6 relative">
      {/* Add Warehouse Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="card w-full max-w-lg glass animate-slide-up border-primary/20 relative">
            <h2 className="text-2xl font-bold text-textMain mb-4">Add New Warehouse</h2>
            <form onSubmit={handleAddWarehouse} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-textMuted mb-1">Warehouse Name</label>
                  <input type="text" required className="input-field" placeholder="Dallas Hub" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-textMuted mb-1">Location</label>
                  <input type="text" required className="input-field" placeholder="Texas, USA" 
                    value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-textMuted mb-1">Total Capacity</label>
                  <input type="number" required className="input-field" placeholder="10000" 
                    value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-textMuted mb-1">Current Load</label>
                  <input type="number" required className="input-field" placeholder="0" 
                    value={formData.currentLoad} onChange={e => setFormData({...formData, currentLoad: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-4 mt-6 pt-4 border-t border-border">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Save Warehouse</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textMain">Warehouses</h1>
          <p className="text-textMuted text-sm mt-1">Manage global distribution centers</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Warehouse
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 text-center py-8 text-textMuted">Loading...</div>
        ) : warehouses.map(w => {
          const utilization = Math.round((w.usedCapacity / w.capacity) * 100);
          return (
            <div key={w.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-textMain">{w.name}</h3>
                  <div className="flex items-center text-textMuted text-sm mt-1">
                    <MapPin size={14} className="mr-1" /> {w.location}
                  </div>
                </div>
                <span className="px-3 py-1 bg-surface border border-border rounded-lg text-sm text-textMuted">
                  Manager: <span className="text-textMain">{w.managerName}</span>
                </span>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-textMuted">Utilization</span>
                  <span className="font-medium text-textMain">{utilization}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${utilization > 85 ? 'bg-red-500' : utilization > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${utilization}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-textMuted mt-2">
                  <span>Used: {w.usedCapacity.toLocaleString()}</span>
                  <span>Total: {w.capacity.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Warehouses;
