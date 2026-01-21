import { useNavigate } from 'react-router-dom';
import { Home, Compass, Calendar, User } from 'lucide-react';

export default function BottomNav({ active }) {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Explore', icon: Compass, path: '/explore' },
    { name: 'Schedule', icon: Calendar, path: '/schedule' },
    { name: 'Profile', icon: User, path: '/profile' }
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      data-testid="bottom-nav"
    >
      <div className="max-w-md mx-auto">
        <div className="glass-effect rounded-t-[32px] shadow-glass border-t border-white/40 px-6 py-4">
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const isActive = active === item.name.toLowerCase();
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center gap-1 transition-smooth ${
                    isActive ? 'text-warm-orange' : 'text-text-muted hover:text-text-primary'
                  }`}
                  data-testid={`nav-${item.name.toLowerCase()}`}
                >
                  <div className={`p-2 rounded-full ${
                    isActive ? 'bg-warm-orange/10' : ''
                  }`}>
                    <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={`text-xs font-medium ${
                    isActive ? 'font-semibold' : ''
                  }`}>
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}