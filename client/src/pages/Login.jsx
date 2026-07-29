import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="card w-full max-w-md relative z-10 glass">
        <div className="text-center mb-8">
          <div className="bg-primary/10 text-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package size={32} />
          </div>
          <h2 className="text-3xl font-bold text-textMain">Welcome Back</h2>
          <p className="text-textMuted mt-2">Sign in to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-textMuted">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                className="input-field pl-10"
                placeholder="admin@logistics.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-textMuted">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                className="input-field pl-10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-3 mt-4 flex justify-center items-center gap-2">
            Sign In
          </button>
          
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink-0 mx-4 text-textMuted text-sm">or</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <button 
            type="button" 
            onClick={() => {
              setEmail('admin@logistics.com');
              setPassword('admin123');
              // Automatically submit the form
              setTimeout(() => {
                const fakeEvent = { preventDefault: () => {} };
                handleSubmit(fakeEvent);
              }, 100);
            }}
            className="btn-secondary w-full py-3 flex justify-center items-center gap-2 border-primary text-primary hover:bg-primary/10"
          >
            Sign in as Demo Admin
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-textMuted">
          Don't have an account? <Link to="/register" className="text-primary hover:underline font-medium">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
