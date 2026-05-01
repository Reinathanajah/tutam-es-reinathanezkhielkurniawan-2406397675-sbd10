import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [time, setTime] = useState(new Date());
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="flex flex-col bg-[#FDFBF7] border-b-4 border-double border-[#2C2C2C] sticky top-0 z-50">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-black font-vintage text-[#1A1A1A] cursor-pointer" onClick={() => navigate('/home')}>
            DiaryMe
          </div>
        </div>
        <div className="relative flex items-center gap-6">
          <button 
            onClick={() => setShowTooltip(!showTooltip)}
            className="text-xs font-sans font-bold px-3 py-1.5 border border-[#2C2C2C] bg-[#FDFBF7] text-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-[#FDFBF7] transition-colors uppercase tracking-[0.2em] shadow-[2px_2px_0px_#2C2C2C]"
          >
            {user?.tier || 'FREE'} EDITION
          </button>
          <div className="text-green-700 font-vintage font-bold cursor-pointer transition uppercase text-lg hover:text-green-900 border-b border-transparent hover:border-green-900" onClick={() => setShowTooltip(!showTooltip)}>
            Logged
          </div>
          {showTooltip && (
            <div className="absolute right-0 top-12 w-72 bg-[#F4EFE6] border-2 border-[#2C2C2C] shadow-[8px_8px_0px_#2C2C2C] p-6 z-50 font-serif text-left">
              <p className="text-sm text-[#2C2C2C] mb-4 pb-4 border-b border-dashed border-[#A8A8A8]">
                Limit 5 diary/hari. Tidak bisa menulis masa depan.
              </p>
              <div className="flex flex-col gap-3 font-sans uppercase tracking-widest text-[10px]">
                <button onClick={() => alert('Profile Page (Coming Soon)')} className="text-left font-bold text-[#1A1A1A] hover:bg-[#2C2C2C] hover:text-[#FDFBF7] p-2 transition-colors border border-transparent hover:border-[#1A1A1A]">My Profile</button>
                <button onClick={handleLogout} className="text-left font-bold text-red-700 hover:bg-red-700 hover:text-white p-2 transition-colors border border-transparent hover:border-red-700">Sign Out</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="h-1 w-full border-t border-[#2C2C2C] mt-1" />
    </header>
  );
};

export default Header;
