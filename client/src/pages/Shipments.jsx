import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Navigation, Filter, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { exportToCSV } from '../utils/exportCsv';

const Shipments = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ trackingId: '', originId: '', destination: '', status: 'Pending', estimatedDelivery: '', priority: 'Standard' });
  const [warehousesList, setWarehousesList] = useState([]);

  useEffect(() => {
    fetchShipments();
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const wRes = await api.get('/warehouses');
      setWarehousesList(wRes.data);
    } catch (error) {
      console.error('Failed to load warehouses', error);
    }
  };

  const fetchShipments = async () => {
    try {
      const { data } = await api.get('/shipments');
      setShipments(data);
    } catch (error) {
      toast.error('Failed to load shipments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddShipment = async (e) => {
    e.preventDefault();
    try {
      await api.post('/shipments', formData);
      toast.success('Shipment created successfully!');
      setShowModal(false);
      setFormData({ trackingId: '', originId: '', destination: '', status: 'Pending', estimatedDelivery: '', priority: 'Standard' });
      fetchShipments();
    } catch (error) {
      toast.error('Failed to create shipment');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-500/10 text-emerald-500';
      case 'In Transit': return 'bg-blue-500/10 text-blue-500';
      case 'Delayed': return 'bg-red-500/10 text-red-500';
      default: return 'bg-amber-500/10 text-amber-500';
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Add Shipment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="card w-full max-w-lg glass animate-slide-up border-primary/20 relative">
            <h2 className="text-2xl font-bold text-textMain mb-4">Create Shipment</h2>
            <form onSubmit={handleAddShipment} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-textMuted mb-1">Tracking ID</label>
                  <input type="text" required className="input-field" placeholder="TRK-987654" 
                    value={formData.trackingId} onChange={e => setFormData({...formData, trackingId: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-textMuted mb-1">Origin Warehouse</label>
                  <select required className="input-field" value={formData.originId} onChange={e => setFormData({...formData, originId: e.target.value})}>
                    <option value="">Select Origin...</option>
                    {warehousesList.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-textMuted mb-1">Destination</label>
                  <input type="text" required className="input-field" placeholder="123 Customer St, City, Country" 
                    value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-textMuted mb-1">Priority</label>
                  <select required className="input-field" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                    <option value="Standard">Standard</option>
                    <option value="Express">Express</option>
                    <option value="Overnight">Overnight</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-textMuted mb-1">Estimated Delivery</label>
                  <input type="date" required className="input-field" 
                    value={formData.estimatedDelivery} onChange={e => setFormData({...formData, estimatedDelivery: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-4 mt-6 pt-4 border-t border-border">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Create Shipment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textMain">Shipments</h1>
          <p className="text-textMuted text-sm mt-1">Track inbound and outbound deliveries</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => exportToCSV(shipments, 'shipments_report')} className="btn-secondary flex items-center gap-2">
            <Download size={18} /> Export CSV
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={18} /> Filters
          </button>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> New Shipment
          </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-textMuted">
            <thead className="text-xs text-textMuted uppercase bg-surface border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Tracking ID</th>
                <th className="px-6 py-4 font-medium">Destination</th>
                <th className="px-6 py-4 font-medium">Expected</th>
                <th className="px-6 py-4 font-medium">Priority</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                 <tr><td colSpan="5" className="px-6 py-8 text-center text-textMuted">Loading...</td></tr>
              ) : shipments.map((s) => (
                <tr key={s.id} className="border-b border-border hover:bg-slate-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <Navigation size={16} />
                      {s.trackingId}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-textMain">{s.destination}</td>
                  <td className="px-6 py-4">{new Date(s.expectedDelivery).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs border ${s.priority === 'High' ? 'border-red-500/50 text-red-500' : 'border-border'}`}>
                      {s.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(s.status)}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Shipments;
