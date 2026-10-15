import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Video, 
  ExternalLink, 
  CheckCircle2, 
  Filter 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { Badge } from '../../components/Badge';

export const Events = () => {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/events');
      if (res.data?.success) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRsvp = async (eventId) => {
    if (!isAuthenticated) {
      alert('Please sign in to RSVP for college events.');
      return;
    }

    try {
      const res = await api.post(`/events/${eventId}/rsvp`);
      if (res.data?.success) {
        const isAttending = res.data.is_attending;
        setEvents(events.map(e => {
          if (e.id === eventId) {
            return {
              ...e,
              is_attending: isAttending,
              attendee_count: isAttending ? (e.attendee_count + 1) : Math.max(0, e.attendee_count - 1)
            };
          }
          return e;
        }));

        setToast(isAttending ? 'RSVP Confirmed! See you there.' : 'RSVP has been cancelled.');
        setTimeout(() => setToast(''), 3000);
      }
    } catch (err) {
      alert('Failed to update RSVP');
    }
  };

  const filteredEvents = filterType === 'All' 
    ? events 
    : events.filter(e => e.event_type.toLowerCase() === filterType.toLowerCase());

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3 border border-blue-200">
          <Calendar className="w-3.5 h-3.5" />
          <span>Campus Gatherings & Reunions</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          College Events & Gatherings
        </h1>
        <p className="mt-2 text-sm text-slate-500 max-w-2xl mx-auto">
          Participate in milestone batch reunions, leadership lectures, startup demo days, and global alumni webinars.
        </p>

        {/* Filter Tabs */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {['All', 'Reunion', 'Webinar', 'Workshop', 'Networking'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                filterType === type
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {type === 'All' ? 'All Events' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-400">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Loading upcoming events...
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-md mx-auto">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="text-base font-bold text-slate-800">No Events Found</h3>
          <p className="text-xs text-slate-500 mt-1">There are no scheduled events matching the selected filter.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="h-48 relative bg-slate-100 overflow-hidden">
                  <img
                    src={event.banner_url || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=80'}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <Badge variant="purple" size="sm">{event.event_type}</Badge>
                    {event.is_virtual && (
                      <span className="inline-flex items-center gap-1 bg-indigo-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                        <Video className="w-3 h-3" /> Virtual
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{event.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{event.description}</p>

                  <div className="space-y-1.5 pt-2 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>{new Date(event.event_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>{event.event_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    {event.is_virtual && event.meeting_link && (
                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href={event.meeting_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                        >
                          Join Zoom Link <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {event.attendee_count || 0} Attending
                </span>

                <button
                  onClick={() => handleToggleRsvp(event.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                    event.is_attending
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
                  }`}
                >
                  {event.is_attending ? '✓ RSVP Confirmed' : 'RSVP Now'}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
