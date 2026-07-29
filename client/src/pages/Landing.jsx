import { Link } from 'react-router-dom';
import { Package, ArrowRight, ShieldCheck, Globe, Activity } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans overflow-hidden">
      {/* Navbar */}
      <nav className="h-20 border-b border-border/50 bg-surface/50 backdrop-blur-md fixed w-full z-50 flex items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 text-primary w-10 h-10 rounded-xl flex items-center justify-center">
            <Package size={24} />
          </div>
          <span className="font-bold text-xl tracking-wide text-textMain">SCM Pro</span>
        </div>
        <div className="flex gap-4 items-center">
          <Link to="/login" className="text-textMuted hover:text-textMain font-medium transition-colors">Sign In</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 mt-20 flex flex-col items-center justify-center text-center px-4 relative z-10">
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto space-y-8 animate-slide-up relative z-20">
          <div className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-semibold tracking-wide mb-4">
            Next-Generation Logistics
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-textMain leading-tight tracking-tight">
            Supply Chain Intelligence, <br className="hidden lg:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Simplified.</span>
          </h1>
          <p className="text-lg lg:text-xl text-textMuted max-w-2xl mx-auto leading-relaxed">
            Enterprise-grade dashboard to monitor warehouses, track global shipments, and manage inventory seamlessly in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link to="/register" className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2">
              Start Free Trial <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-4">
              Live Demo
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-24 mb-24 relative z-20">
          <div className="card text-left hover:-translate-y-2 transition-transform duration-300">
            <Globe className="text-blue-500 mb-4" size={36} />
            <h3 className="text-xl font-bold text-textMain mb-2">Global Tracking</h3>
            <p className="text-textMuted">Monitor shipments across continents with real-time status updates and priority flags.</p>
          </div>
          <div className="card text-left hover:-translate-y-2 transition-transform duration-300">
            <Activity className="text-emerald-500 mb-4" size={36} />
            <h3 className="text-xl font-bold text-textMain mb-2">Live Analytics</h3>
            <p className="text-textMuted">Interactive charts and KPI metrics give you a bird's-eye view of your logistics network.</p>
          </div>
          <div className="card text-left hover:-translate-y-2 transition-transform duration-300">
            <ShieldCheck className="text-purple-500 mb-4" size={36} />
            <h3 className="text-xl font-bold text-textMain mb-2">Enterprise Security</h3>
            <p className="text-textMuted">Role-based access control and JWT authentication keeps your supply chain data secure.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
