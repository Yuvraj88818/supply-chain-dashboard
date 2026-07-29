import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { Users, Warehouse, Truck, Box, PackageCheck, AlertCircle, Activity, ArrowRight, Printer } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get('/dashboard');
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-surface rounded-xl"></div>)}
      </div>
    );
  }

  const shipmentData = [
    { name: 'Pending', value: stats?.pendingShipments || 0 },
    { name: 'Delivered', value: stats?.deliveredShipments || 0 },
    { name: 'Delayed', value: stats?.delayedShipments || 0 },
  ];

  const monthlyData = [
    { name: 'Jan', deliveries: 40 },
    { name: 'Feb', deliveries: 30 },
    { name: 'Mar', deliveries: 55 },
    { name: 'Apr', deliveries: 48 },
    { name: 'May', deliveries: 60 },
    { name: 'Jun', deliveries: 70 },
  ];

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="card flex items-center p-6 hover:-translate-y-1 transition-transform duration-300">
      <div className={`p-4 rounded-xl ${color} bg-opacity-10 mr-4`}>
        <Icon className={color.replace('bg-', 'text-')} size={28} />
      </div>
      <div>
        <p className="text-sm font-medium text-textMuted mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-textMain">{value}</h3>
        {subtitle && <p className="text-xs text-textMuted mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-textMain">Overview</h1>
          <p className="text-textMuted text-sm">Welcome to the supply chain command center.</p>
        </div>
        <button onClick={() => window.print()} className="btn-primary flex items-center gap-2">
          <Printer size={18} /> Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
          title="Active Suppliers" 
          value={stats?.activeSuppliers || 0} 
          icon={Users} 
          color="bg-blue-500" 
          subtitle={`Total: ${stats?.totalSuppliers || 0}`}
        />
        <StatCard 
          title="Total Warehouses" 
          value={stats?.totalWarehouses || 0} 
          icon={Warehouse} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Inventory Items" 
          value={stats?.inventoryItems || 0} 
          icon={Box} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Delivered Shipments" 
          value={stats?.deliveredShipments || 0} 
          icon={PackageCheck} 
          color="bg-amber-500" 
          subtitle={`${stats?.delayedShipments || 0} delayed`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Shipment Status Pie Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-textMain mb-4">Shipment Status</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={shipmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {shipmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#F8FAFC' }}
                  itemStyle={{ color: '#F8FAFC' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4 text-sm text-textMuted">
            {shipmentData.map((entry, idx) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                {entry.name}
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Deliveries Area Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-textMain mb-4">Delivery Trends</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorDeliveries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" tick={{fill: '#94A3B8'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#94A3B8" tick={{fill: '#94A3B8'}} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#F8FAFC' }}
                />
                <Area type="monotone" dataKey="deliveries" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorDeliveries)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="card mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-textMain flex items-center gap-2">
            <Activity className="text-primary" size={20} /> Live Activity Feed
          </h3>
        </div>
        <div className="space-y-4">
          {stats?.recentActivity && stats.recentActivity.length > 0 ? (
            stats.recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-4 p-3 rounded-lg hover:bg-surface/50 transition-colors">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary animate-pulse"></div>
                <div className="flex-1">
                  <p className="text-textMain font-medium">
                    New Shipment Created: <span className="text-primary">{activity.trackingId}</span>
                  </p>
                  <p className="text-sm text-textMuted">
                    From {activity.warehouse?.name} to {activity.destination}
                  </p>
                </div>
                <span className="text-xs text-textMuted bg-surface px-2 py-1 rounded-full">
                  {new Date(activity.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-textMuted text-sm text-center py-4">No recent activity detected.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
