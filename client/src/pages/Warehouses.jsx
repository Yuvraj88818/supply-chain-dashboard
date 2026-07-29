import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-textMain">Warehouses</h1>
          <p className="text-textMuted text-sm">Manage storage facilities and capacity</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Warehouse
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
