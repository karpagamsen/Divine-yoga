import { useAuth } from '../App';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { LogOut, Award, TrendingUp, Star, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    { label: 'Sessions', value: '24', icon: TrendingUp },
    { label: 'Streak', value: '7 days', icon: Award },
    { label: 'Hours', value: '12.5', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-cream pb-24">
      <div className="max-w-md mx-auto bg-cream min-h-screen">
        <div className="p-6 space-y-6">
          <h1 className="font-heading text-3xl font-bold text-text-primary" data-testid="profile-title">Profile</h1>

          <div className="rounded-card shadow-neumorphic bg-white p-6" data-testid="profile-info">
            <div className="flex flex-col items-center text-center mb-6">
              <img
                src={user?.profile_image}
                alt={user?.name}
                className="w-24 h-24 rounded-full shadow-neumorphic mb-4"
                data-testid="profile-avatar"
              />
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-1" data-testid="profile-name">
                {user?.name}
              </h2>
              <p className="text-text-secondary text-sm mb-3" data-testid="profile-email">{user?.email}</p>
              {user?.is_premium && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full gradient-sunrise shadow-sm" data-testid="premium-badge">
                  <Crown size={16} className="text-white" />
                  <span className="text-white font-semibold text-sm">Premium Member</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6" data-testid="profile-stats">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-cream shadow-neumorphic-pressed mx-auto mb-2 flex items-center justify-center">
                    <stat.icon size={20} className="text-warm-orange" />
                  </div>
                  <p className="text-lg font-bold text-text-primary">{stat.value}</p>
                  <p className="text-xs text-text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3" data-testid="profile-actions">
            <button className="w-full rounded-full shadow-neumorphic bg-white p-4 text-left text-text-primary font-semibold hover:shadow-neumorphic-pressed transition-smooth" data-testid="edit-profile-button">
              Edit Profile
            </button>
            <button className="w-full rounded-full shadow-neumorphic bg-white p-4 text-left text-text-primary font-semibold hover:shadow-neumorphic-pressed transition-smooth" data-testid="settings-button">
              Settings
            </button>
            <button className="w-full rounded-full shadow-neumorphic bg-white p-4 text-left text-text-primary font-semibold hover:shadow-neumorphic-pressed transition-smooth" data-testid="help-button">
              Help & Support
            </button>
          </div>

          <Button
            onClick={handleLogout}
            className="w-full rounded-full shadow-neumorphic bg-white text-warm-orange font-semibold p-4 hover:shadow-neumorphic-pressed transition-smooth flex items-center justify-center gap-2"
            data-testid="logout-button"
          >
            <LogOut size={20} />
            Logout
          </Button>
        </div>
      </div>

      <BottomNav active="profile" />
    </div>
  );
}