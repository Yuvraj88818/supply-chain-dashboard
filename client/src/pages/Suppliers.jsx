import { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Plus, MoreVertical, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const { data } = await api.get('/suppliers');
      setSuppliers(data);
    } catch (error) {
      toast.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    toast.success('Supplier added successfully! (Demo Mode)');
    setShowModal(false);
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
      {/* Add Supplier Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="card w-full max-w-lg glass animate-slide-up border-primary/20 relative">
            <h2 className="text-2xl font-bold text-textMain mb-4">Add New Supplier</h2>
            <form onSubmit={handleAddSupplier} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-textMuted mb-1">Company Name</label>
                  <input type="text" required className="input-field" placeholder="Acme Corp" />
                </div>
                <div>
                  <label className="block text-sm text-textMuted mb-1">Contact Person</label>
                  <input type="text" required className="input-field" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm text-textMuted mb-1">Email</label>
                  <input type="email" required className="input-field" placeholder="contact@acme.com" />
                </div>
                <div>
                  <label className="block text-sm text-textMuted mb-1">Country</label>
                  <input type="text" required className="input-field" placeholder="USA" />
                </div>
              </div>
              <div className="flex gap-4 mt-6 pt-4 border-t border-border">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Save Supplier</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textMain">Suppliers</h1>
          <p className="text-textMuted text-sm">Manage your supply chain partners</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Download size={18} /> Export CSV
          </button>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Add Supplier
          </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textMuted" size={18} />
            <input 
              type="text" 
              placeholder="Search suppliers..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-background border border-border text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-primary w-full text-textMain"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-textMuted">
            <thead className="text-xs text-textMuted uppercase bg-surface border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Supplier</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Country</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-textMuted">Loading data...</td>
                </tr>
              ) : filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-textMuted">No suppliers found.</td>
                </tr>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-b border-border hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-textMain">{supplier.name}</div>
                      <div className="text-xs">{supplier.company}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>{supplier.email}</div>
                      <div className="text-xs">{supplier.phone}</div>
                    </td>
                    <td className="px-6 py-4">{supplier.country}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${supplier.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                        {supplier.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-textMuted hover:text-textMain transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border text-xs text-textMuted flex justify-between items-center">
          <span>Showing {filteredSuppliers.length} entries</span>
          {/* Pagination would go here */}
        </div>
      </div>
    </div>
  );
};

export default Suppliers;
