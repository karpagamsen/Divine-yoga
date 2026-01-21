import BottomNav from '../components/BottomNav';
import { Calendar, Clock } from 'lucide-react';

export default function Schedule() {
  const upcomingSessions = [
    {
      id: 1,
      title: 'Morning Flow Yoga',
      trainer: 'Lisa Mary',
      time: '08:00 AM',
      date: 'Tomorrow',
      duration: 45
    },
    {
      id: 2,
      title: 'Evening Meditation',
      trainer: 'David John',
      time: '06:00 PM',
      date: 'Tomorrow',
      duration: 20
    },
    {
      id: 3,
      title: 'Deep Sleep Journey',
      trainer: 'Sarah Chen',
      time: '09:00 PM',
      date: 'Jan 23, 2026',
      duration: 30
    }
  ];

  return (
    <div className="min-h-screen bg-cream pb-24">
      <div className="max-w-md mx-auto bg-cream min-h-screen">
        <div className="p-6 space-y-6">
          <h1 className="font-heading text-3xl font-bold text-text-primary" data-testid="schedule-title">Schedule</h1>

          <div className="rounded-card shadow-neumorphic bg-white p-6" data-testid="calendar-section">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Calendar className="text-warm-orange" size={24} />
              <h2 className="font-heading text-xl font-semibold text-text-primary">January 2026</h2>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-xs font-semibold text-text-muted py-2">
                  {day}
                </div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <button
                  key={day}
                  className={`py-2 rounded-lg text-sm font-medium transition-smooth ${
                    day === 21
                      ? 'gradient-sunrise text-white shadow-sm'
                      : 'text-text-secondary hover:bg-cream'
                  }`}
                  data-testid={`calendar-day-${day}`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div data-testid="upcoming-sessions">
            <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">Upcoming Sessions</h2>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="rounded-card shadow-neumorphic bg-white p-4 cursor-pointer hover:shadow-soft-float transition-smooth"
                  data-testid={`upcoming-session-${session.id}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-heading text-lg font-semibold text-text-primary">{session.title}</h3>
                    <span className="text-xs px-3 py-1 rounded-full bg-accent-green/20 text-accent-green font-semibold">
                      {session.date}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">with {session.trainer}</p>
                  <div className="flex items-center gap-4 text-sm text-text-muted">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{session.time}</span>
                    </div>
                    <span>•</span>
                    <span>{session.duration} min</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BottomNav active="schedule" />
    </div>
  );
}