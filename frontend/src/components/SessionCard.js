import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';

export default function SessionCard({ session }) {
  const navigate = useNavigate();

  return (
    <div
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
          <h3 className="font-heading text-lg font-semibold text-text-primary mb-1">{session.title}</h3>
          <p className="text-text-secondary text-sm mb-2">{session.trainer_name}</p>
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span>{session.duration} min</span>
            <span>•</span>
            <span className="capitalize">{session.category}</span>
          </div>
        </div>
        <button
          className="w-12 h-12 rounded-full gradient-sunrise flex items-center justify-center shadow-sm group-hover:scale-110 transition-smooth"
          data-testid={`play-button-${session.id}`}
        >
          <Play className="text-white fill-white ml-1" size={20} />
        </button>
      </div>
    </div>
  );
}