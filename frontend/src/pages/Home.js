import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../App';
import BottomNav from '../components/BottomNav';
import { Search, Bell, Sparkles, Play } from 'lucide-react';
import { Button } from '../components/ui/button';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sessionsRes, programsRes] = await Promise.all([
        axios.get(`${API}/sessions`),
        axios.get(`${API}/programs`)
      ]);
      setSessions(sessionsRes.data);
      setPrograms(programsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const todaySessions = sessions.slice(0, 2);

  return (
    <div className="min-h-screen bg-cream pb-24">
      <div className="max-w-md mx-auto bg-cream min-h-screen">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between" data-testid="header">
            <div className="flex items-center gap-3">
              <img
                src={user?.profile_image}
                alt={user?.name}
                className="w-12 h-12 rounded-full shadow-neumorphic"
                data-testid="user-avatar"
              />
              <h2 className="font-accent text-2xl text-warm-orange" data-testid="greeting-text">
                Hi, {user?.name?.split(' ')[0]}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-3 rounded-full bg-cream shadow-neumorphic text-warm-orange hover:shadow-neumorphic-pressed transition-smooth" data-testid="notification-button">
                <Bell size={20} />
              </button>
            </div>
          </div>

          <div className="relative" data-testid="search-bar">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full shadow-neumorphic-pressed bg-cream border-0 rounded-full pl-14 pr-6 py-4 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-warm-orange/50"
              data-testid="search-input"
            />
          </div>

          <div className="relative rounded-hero overflow-hidden shadow-neumorphic" data-testid="hero-section">
            <img
              src="https://images.unsplash.com/photo-1729886484969-188f0d7f196c?crop=entropy&cs=srgb&fm=jpg&q=85"
              alt="Meditation"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-warm-orange/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <Sparkles className="mb-2 animate-float" size={24} />
              <h1 className="font-heading text-4xl font-bold mb-2" data-testid="hero-title">Find Balance</h1>
              <p className="text-lg opacity-90" data-testid="hero-subtitle">Welcome to Your Yoga Journey</p>
            </div>
            <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-accent-gold shadow-soft-float flex items-center justify-center hover:scale-110 transition-smooth" data-testid="hero-play-button">
              <Play className="text-white fill-white ml-1" size={28} />
            </button>
          </div>

          <div className="flex justify-around py-4" data-testid="category-icons">
            {[
              { name: 'Yoga', icon: '🧘' },
              { name: 'Meditation', icon: '🧘‍♀️' },
              { name: 'Sleep', icon: '🌙' }
            ].map((category) => (
              <button
                key={category.name}
                onClick={() => navigate('/explore', { state: { category: category.name } })}
                className="flex flex-col items-center gap-2 group"
                data-testid={`category-${category.name.toLowerCase()}-button`}
              >
                <div className="w-16 h-16 rounded-full bg-accent-green/20 shadow-neumorphic flex items-center justify-center text-3xl group-hover:shadow-neumorphic-pressed transition-smooth">
                  {category.icon}
                </div>
                <span className="text-sm text-text-secondary font-medium">{category.name}</span>
              </button>
            ))}
          </div>

          <div data-testid="todays-sessions-section">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-2xl font-semibold text-text-primary">Today's Sessions</h2>
            </div>
            <div className="space-y-4">
              {todaySessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => navigate(`/session/${session.id}`)}
                  className="relative rounded-card overflow-hidden shadow-neumorphic cursor-pointer hover:shadow-soft-float transition-smooth group"
                  data-testid={`session-card-${session.id}`}
                >
                  <div className="flex gap-4 p-4 bg-white">
                    <img
                      src={session.trainer_image}
                      alt={session.trainer_name}
                      className="w-24 h-24 rounded-card object-cover shadow-sm"
                    />
                    <div className="flex-1">
                      <h3 className="font-heading text-lg font-semibold text-text-primary mb-1">{session.trainer_name}</h3>
                      <p className="text-text-secondary text-sm mb-2">{session.title}</p>
                      <span className="text-xs text-text-muted">{session.duration} min</span>
                    </div>
                    <button className="w-12 h-12 rounded-full gradient-sunrise flex items-center justify-center shadow-sm group-hover:scale-110 transition-smooth" data-testid={`play-session-${session.id}`}>
                      <Play className="text-white fill-white ml-1" size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div data-testid="premium-programs-section">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-2xl font-semibold text-text-primary">Premium Programs</h2>
              <button
                onClick={() => navigate('/explore')}
                className="text-warm-orange font-semibold text-sm hover:underline"
                data-testid="see-all-programs-button"
              >
                See All
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
              {programs.map((program) => (
                <div
                  key={program.id}
                  className="min-w-[280px] rounded-card overflow-hidden shadow-neumorphic cursor-pointer hover:shadow-soft-float transition-smooth"
                  data-testid={`program-card-${program.id}`}
                >
                  <div className="relative h-40">
                    <img
                      src={program.image}
                      alt={program.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-heading text-lg font-semibold text-white mb-1">{program.title}</h3>
                      {program.start_date && (
                        <p className="text-white/90 text-xs">{program.start_date} - {program.end_date}</p>
                      )}
                    </div>
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 text-xs font-semibold text-text-primary">
                      Day {program.duration_days}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BottomNav active="home" />
    </div>
  );
}