import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Sparkles } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-hero shadow-neumorphic" data-testid="welcome-container">
          <div className="relative h-[600px]">
            <img
              src="https://images.unsplash.com/photo-1729886484969-188f0d7f196c?crop=entropy&cs=srgb&fm=jpg&q=85"
              alt="Yoga meditation"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
              <Sparkles className="text-accent-gold mb-4 animate-float" size={48} />
              
              <h1 className="font-heading text-5xl font-bold text-white mb-3" data-testid="welcome-title">
                Divine Yoga
              </h1>
              
              <p className="text-white/90 text-lg mb-2 leading-relaxed" data-testid="welcome-subtitle">
                Find Balance, Peace & Wellness
              </p>
              
              <p className="text-white/80 text-sm mb-8 max-w-sm" data-testid="welcome-description">
                Start your journey to mindfulness with guided yoga, meditation, and sleep sessions
              </p>
              
              <Button
                onClick={() => navigate('/signup')}
                className="w-full gradient-sunrise text-white rounded-full py-6 font-semibold text-lg shadow-soft-float hover:shadow-xl transition-smooth transform hover:-translate-y-1 mb-4"
                data-testid="get-started-button"
              >
                Get Started
              </Button>
              
              <p className="text-white/70 text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-white font-semibold hover:underline"
                  data-testid="login-link"
                >
                  Log In
                </button>
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center gap-8 text-center" data-testid="welcome-features">
          <div>
            <div className="text-2xl mb-1">🧘</div>
            <p className="text-text-secondary text-xs font-medium">Yoga</p>
          </div>
          <div>
            <div className="text-2xl mb-1">🧘‍♀️</div>
            <p className="text-text-secondary text-xs font-medium">Meditation</p>
          </div>
          <div>
            <div className="text-2xl mb-1">🌙</div>
            <p className="text-text-secondary text-xs font-medium">Sleep</p>
          </div>
        </div>
      </div>
    </div>
  );
}