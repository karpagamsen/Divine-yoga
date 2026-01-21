import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import BottomNav from '../components/BottomNav';
import { Search, Filter } from 'lucide-react';
import SessionCard from '../components/SessionCard';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Explore() {
  const location = useLocation();
  const [sessions, setSessions] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(location.state?.category || 'All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const fetchData = async () => {
    try {
      const category = selectedCategory === 'All' ? undefined : selectedCategory;
      const [sessionsRes, programsRes] = await Promise.all([
        axios.get(`${API}/sessions`, { params: { category } }),
        axios.get(`${API}/programs`)
      ]);
      setSessions(sessionsRes.data);
      setPrograms(programsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const categories = ['All', 'Yoga', 'Meditation', 'Sleep'];

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.trainer_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-cream pb-24">
      <div className="max-w-md mx-auto bg-cream min-h-screen">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between" data-testid="explore-header">
            <h1 className="font-heading text-3xl font-bold text-text-primary">Explore</h1>
            <button className="p-3 rounded-full bg-cream shadow-neumorphic text-warm-orange" data-testid="filter-button">
              <Filter size={20} />
            </button>
          </div>

          <div className="relative" data-testid="search-bar">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full shadow-neumorphic-pressed bg-cream border-0 rounded-full pl-14 pr-6 py-4 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-warm-orange/50"
              data-testid="search-input"
            />
          </div>

          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2" data-testid="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-smooth ${
                  selectedCategory === category
                    ? 'gradient-sunrise text-white shadow-soft-float'
                    : 'bg-cream shadow-neumorphic text-text-secondary hover:shadow-neumorphic-pressed'
                }`}
                data-testid={`category-filter-${category.toLowerCase()}`}
              >
                {category}
              </button>
            ))}
          </div>

          <div data-testid="sessions-grid">
            <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">Sessions</h2>
            <div className="grid grid-cols-1 gap-4">
              {filteredSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          </div>

          <div data-testid="programs-section">
            <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">Programs</h2>
            <div className="space-y-4">
              {programs.map((program) => (
                <div
                  key={program.id}
                  className="rounded-card overflow-hidden shadow-neumorphic bg-white cursor-pointer hover:shadow-soft-float transition-smooth"
                  data-testid={`program-${program.id}`}
                >
                  <div className="flex gap-4 p-4">
                    <img
                      src={program.image}
                      alt={program.title}
                      className="w-24 h-24 rounded-card object-cover shadow-sm"
                    />
                    <div className="flex-1">
                      <h3 className="font-heading text-lg font-semibold text-text-primary mb-1">{program.title}</h3>
                      <p className="text-text-secondary text-sm mb-2">{program.description}</p>
                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        <span>{program.duration_days} days</span>
                        <span>•</span>
                        <span>{program.sessions_count} sessions</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BottomNav active="explore" />
    </div>
  );
}