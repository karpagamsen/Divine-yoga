import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/login`, { email, password });
      login(response.data.access_token, response.data.user);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cream">
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-hero shadow-neumorphic bg-white p-8">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://images.unsplash.com/photo-1729886484969-188f0d7f196c?crop=entropy&cs=srgb&fm=jpg&q=85"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <h1 className="font-heading text-4xl font-bold text-text-primary mb-2">Divine Yoga</h1>
              <p className="text-text-secondary">Welcome back to your wellness journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full shadow-neumorphic-pressed bg-cream border-0 rounded-full px-6 py-6 text-text-primary placeholder-text-muted focus:ring-2 focus:ring-warm-orange/50"
                  data-testid="login-email-input"
                />
              </div>

              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full shadow-neumorphic-pressed bg-cream border-0 rounded-full px-6 py-6 text-text-primary placeholder-text-muted focus:ring-2 focus:ring-warm-orange/50"
                  data-testid="login-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                  data-testid="toggle-password-visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full gradient-sunrise text-white rounded-full py-6 font-semibold text-lg shadow-soft-float hover:shadow-xl transition-smooth transform hover:-translate-y-1"
                data-testid="login-submit-button"
              >
                {loading ? 'Logging in...' : 'Log In'}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <p className="text-text-secondary text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="text-warm-orange font-semibold hover:underline" data-testid="signup-link">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}