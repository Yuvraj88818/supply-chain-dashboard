import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';

const Shipments = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShipments();
  }, []);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-500/10 text-emerald-500';
      case 'In Transit': return 'bg-blue-500/10 text-blue-500';
      case 'Delayed': return 'bg-red-500/10 text-red-500';
      default: return 'bg-amber-500/10 text-amber-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-textMain">Shipments</h1>
          <p className="text-textMuted text-sm">Monitor all incoming and outgoing shipments</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Shipment
        </button>
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
