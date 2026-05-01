import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import { differenceInDays } from 'date-fns';

const DynamicBackground = () => {
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const interval = setInterval(() => {
      setLetters(prev => {
        const current = prev.length > 25 ? prev.slice(1) : prev;
        return [
          ...current,
          {
            id: Date.now() + Math.random(),
            char: chars[Math.floor(Math.random() * chars.length)],
            top: Math.floor(Math.random() * 80) + 10,
            duration: Math.random() * 6 + 7, 
            size: Math.floor(Math.random() * 20) + 12, 
          }
        ];
      });
    }, 400); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-10">
      {letters.map(l => (
        <motion.div
          key={l.id}
          initial={{ left: '100%', opacity: 0 }}
          animate={{ left: '-10%', opacity: [0, 1, 1, 0] }}
          transition={{ duration: l.duration, ease: 'linear' }}
          className="absolute font-mono text-[#1A1A1A] font-bold"
          style={{ top: `${l.top}%`, fontSize: `${l.size}px` }}
        >
          {l.char}
        </motion.div>
      ))}
    </div>
  );
};

const Home = () => {
  const [myEntries, setMyEntries] = useState([]);
  const [publicDiaries, setPublicDiaries] = useState([]);
  const [dueDates, setDueDates] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const [meRes, pubRes] = await Promise.all([
          axios.get(`${API_URL}/api/entries/me`, config),
          axios.get(`${API_URL}/api/entries/public`, config)
        ]);
        
        const mine = meRes.data;
        setMyEntries(mine.slice(0, 5));
        setPublicDiaries(pubRes.data.entries.slice(0, 5));

        const alerts = mine.filter(e => e.type === 'DueDate').filter(e => {
          if (!e.calendarDate) return false;
          const diff = differenceInDays(new Date(e.calendarDate), new Date());
          const map = { '1 days': 1, '3 days': 3, '7 days': 7, '30 days before': 30 };
          return diff >= 0 && diff <= map[e.remindMeIn];
        });
        setDueDates(alerts);
      } catch (err) {
        if (err.response?.status === 401) navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-serif text-[#2C2C2C] flex flex-col items-center">
      <div className="w-full max-w-7xl bg-[#FDFBF7] min-h-screen flex flex-col shadow-2xl overflow-hidden border-x border-[#DAD3C8]">
        <Header />
        
        <main className="flex-1 p-8 md:p-12 space-y-16">
          <div className="text-center mb-12 border-b-4 border-double border-[#2C2C2C] pb-6 pt-6 relative overflow-hidden bg-[#FDFBF7]">
            <DynamicBackground />
            <div className="relative z-10">
              <h1 className="text-6xl md:text-8xl font-vintage text-[#1A1A1A] font-normal tracking-tight mb-4" style={{lineHeight: 0.9}}>The Daily Archives</h1>
              <p className="font-serif text-sm text-[#5A5A5A] tracking-widest uppercase mb-6 bg-[#FDFBF7]/80 inline-block px-2">MADE BY REINATHAN EZKHIEL KURNIAWAN</p>
              <div>
                <div className="font-sans text-sm font-semibold text-gray-700 bg-white border border-gray-200 shadow-sm inline-block px-4 py-2 rounded">
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} | {currentTime.toLocaleTimeString('en-US', { hour12: true })}
                </div>
              </div>
            </div>
          </div>

          {dueDates.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#F4EFE6] border border-[#2C2C2C] p-6 mb-8 shadow-[4px_4px_0px_#2C2C2C]">
              <h3 className="font-bold text-[#1A1A1A] uppercase tracking-widest border-b-2 border-[#2C2C2C] pb-2 mb-4 font-sans text-xs">Urgent Notices</h3>
              {dueDates.map(d => (
                <p key={d._id} className="text-[#1A1A1A] font-serif text-lg flex justify-between border-b border-dashed border-[#A8A8A8] pb-2 last:border-0">
                  <span>{d.title} - {d.activity}</span>
                  <span className="font-bold">{new Date(d.calendarDate).toLocaleDateString()}</span>
                </p>
              ))}
            </motion.div>
          )}

          <section>
            <div className="flex justify-between items-end mb-6 border-b-2 border-[#2C2C2C] pb-2">
              <h2 className="text-3xl md:text-5xl font-vintage text-[#1A1A1A]">Your Publications</h2>
              <button onClick={() => navigate('/add')} className="border border-[#2C2C2C] text-[#1A1A1A] font-sans font-bold text-xs uppercase px-4 py-2 hover:bg-[#2C2C2C] hover:text-[#FDFBF7] transition-colors tracking-widest mb-1">Draft New Piece</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {myEntries.map((entry, idx) => (
                <motion.div 
                  key={entry._id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-[#FDFBF7] p-0 flex flex-col group cursor-pointer"
                  onClick={() => navigate('/others')}
                >
                  <div className="text-[10px] text-[#5A5A5A] font-sans font-bold uppercase tracking-widest mb-2 border-b border-[#2C2C2C] pb-1">{entry.type}</div>
                  <h3 className="font-vintage text-3xl leading-tight mb-3 flex-1 group-hover:underline decoration-2 underline-offset-4">{entry.title}</h3>
                  <p className="text-sm text-[#5A5A5A] font-serif uppercase tracking-widest">{new Date(entry.createdAt).toLocaleDateString()}</p>
                </motion.div>
              ))}
              {myEntries.length === 0 && <p className="text-[#5A5A5A] font-serif uppercase tracking-widest text-sm col-span-full">The printing press awaits your first draft.</p>}
            </div>
          </section>

          <section className="pt-10">
            <div className="flex justify-between items-end mb-6 border-b-2 border-[#2C2C2C] pb-2">
              <h2 className="text-3xl md:text-5xl font-vintage text-[#1A1A1A]">Global Headlines</h2>
              <button onClick={() => navigate('/others')} className="border border-[#2C2C2C] text-[#1A1A1A] font-sans font-bold text-xs uppercase px-4 py-2 hover:bg-[#2C2C2C] hover:text-[#FDFBF7] transition-colors tracking-widest mb-1">Browse Archive</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {publicDiaries.map((entry, idx) => (
                <motion.div 
                  key={entry._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-[#F4EFE6] p-6 border border-[#2C2C2C] cursor-pointer hover:shadow-[4px_4px_0px_#2C2C2C] transition-all"
                  onClick={() => navigate('/others')}
                >
                  <div className="text-[10px] font-bold font-sans text-[#2C2C2C] uppercase tracking-widest mb-3 border-b border-[#2C2C2C] pb-2">By {entry.user?.username}</div>
                  <h3 className="font-vintage text-4xl leading-none mb-4">{entry.title}</h3>
                  <p className="font-serif text-[#2C2C2C] text-sm line-clamp-3 mb-4">{entry.content || "Read the full manuscript inside..."}</p>
                  <p className="text-xs text-[#5A5A5A] font-serif uppercase tracking-widest text-right">{new Date(entry.createdAt).toLocaleDateString()}</p>
                </motion.div>
              ))}
              {publicDiaries.length === 0 && <p className="text-[#5A5A5A] font-serif uppercase tracking-widest text-sm col-span-full">The global archive is currently empty.</p>}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;
