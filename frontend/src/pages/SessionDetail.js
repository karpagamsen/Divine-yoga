import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Play, Clock, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function SessionDetail() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSession();
  }, [sessionId]);

  const fetchSession = async () => {
    try {
      const response = await axios.get(`${API}/sessions/${sessionId}`);
      setSession(response.data);
    } catch (error) {
      console.error('Failed to fetch session:', error);
      toast.error('Failed to load session');
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = async () => {
    try {
      await axios.post(`${API}/progress`, {
        session_id: sessionId,
        completed: false,
        progress_percentage: 0
      });
      toast.success('Session started!');
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-warm-orange text-xl font-heading">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-text-primary">Session not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-md mx-auto bg-cream min-h-screen">
        <div className="relative h-80">
          <img
            src={session.image}
            alt={session.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-smooth"
            data-testid="back-button"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={handleStartSession}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-accent-gold shadow-soft-float flex items-center justify-center hover:scale-110 transition-smooth"
            data-testid="play-button"
          >
            <Play className="text-white fill-white ml-1" size={32} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div data-testid="session-info">
            <h1 className="font-heading text-3xl font-bold text-text-primary mb-2">{session.title}</h1>
            <div className="flex items-center gap-4 text-text-secondary mb-4">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{session.trainer_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{session.duration} min</span>
              </div>
            </div>
            <p className="text-text-secondary leading-relaxed">{session.description}</p>
          </div>

          <div className="rounded-card shadow-neumorphic bg-white p-6" data-testid="trainer-info">
            <h3 className="font-heading text-xl font-semibold text-text-primary mb-4">About the Trainer</h3>
            <div className="flex items-center gap-4">
              <img
                src={session.trainer_image}
                alt={session.trainer_name}
                className="w-16 h-16 rounded-full shadow-sm"
              />
              <div>
                <h4 className="font-semibold text-text-primary">{session.trainer_name}</h4>
                <p className="text-sm text-text-secondary">Specialist in {session.category}</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleStartSession}
            className="w-full gradient-sunrise text-white rounded-full py-6 font-semibold text-lg shadow-soft-float hover:shadow-xl transition-smooth transform hover:-translate-y-1"
            data-testid="start-session-button"
          >
            Start Session
          </Button>
        </div>
      </div>
    </div>
  );
}