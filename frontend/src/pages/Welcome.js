import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Sparkles, Sun, Heart, Flame } from 'lucide-react';
import { useAuth } from '../App';

export default function Welcome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 25%, #FFB084 50%, #FF7F50 75%, #FF6B35 100%)',
      backgroundSize: '200% 200%',
      animation: 'gradientShift 6s ease infinite'
    }}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-accent-yellow/30 blur-2xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-accent-gold/20 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-20 w-24 h-24 rounded-full bg-coral/30 blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 rounded-full bg-peach/40 blur-xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Logo/Icon */}
          <div className="text-center animate-fadeIn">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-accent-gold rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative w-24 h-24 mx-auto rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center shadow-glow">
                <Sun className="text-accent-gold" size={48} strokeWidth={2} />
              </div>
            </div>
            
            <h1 className="font-heading text-6xl font-bold text-white mb-3 drop-shadow-lg" data-testid="welcome-title">
              Divine Yoga
            </h1>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="text-accent-yellow animate-float" size={20} />
              <p className="font-accent text-2xl text-white/95" data-testid="welcome-tagline">
                Journey to Inner Peace
              </p>
              <Sparkles className="text-accent-yellow animate-float" size={20} style={{animationDelay: '0.5s'}} />
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8" data-testid="welcome-features">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 text-center transform hover:scale-105 transition-all shadow-glass">
              <div className="text-4xl mb-2">🧘‍♀️</div>
              <p className="text-white font-semibold text-sm">Yoga</p>
              <p className="text-white/80 text-xs mt-1">Flow & Balance</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 text-center transform hover:scale-105 transition-all shadow-glass">
              <div className="text-4xl mb-2">🧘</div>
              <p className="text-white font-semibold text-sm">Meditation</p>
              <p className="text-white/80 text-xs mt-1">Mindfulness</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 text-center transform hover:scale-105 transition-all shadow-glass">
              <div className="text-4xl mb-2">🌙</div>
              <p className="text-white font-semibold text-sm">Sleep</p>
              <p className="text-white/80 text-xs mt-1">Deep Rest</p>
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white/25 backdrop-blur-lg rounded-3xl p-6 border border-white/40 shadow-glass mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Heart className="text-white" size={20} />
              <h3 className="text-white font-heading text-xl font-semibold">Transform Your Life</h3>
            </div>
            <p className="text-white/90 text-center text-sm leading-relaxed" data-testid="welcome-description">
              Discover peace, strength, and clarity through guided yoga sessions, meditation practices, and restorative sleep programs. Begin your journey to wellness today.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4">
            <Button
              onClick={() => navigate(user ? '/home' : '/login')}
              className="w-full bg-white text-warm-orange rounded-full py-7 font-bold text-xl shadow-soft-float hover:shadow-xl transition-smooth transform hover:-translate-y-1 hover:scale-105"
              data-testid="get-started-button"
            >
              <Flame className="mr-2" size={24} />
              {user ? 'Continue to Home' : 'Get Started'}
            </Button>
            
            {!user && (
              <button
                onClick={() => navigate('/signup')}
                className="w-full text-white font-semibold text-lg hover:underline py-3"
                data-testid="signup-link"
              >
                Don't have an account? Sign Up
              </button>
            )}
          </div>

          {/* Bottom decorative text */}
          <div className="text-center space-y-2 pt-4">
            <div className="flex items-center justify-center gap-3 text-white/80 text-sm">
              <span>✨ 500+ Sessions</span>
              <span>•</span>
              <span>🌟 Expert Trainers</span>
              <span>•</span>
              <span>💪 Transform Daily</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}