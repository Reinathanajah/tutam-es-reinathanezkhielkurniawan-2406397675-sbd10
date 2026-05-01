import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';

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
            top: Math.floor(Math.random() * 80),
            duration: Math.random() * 6 + 7, 
            size: Math.floor(Math.random() * 120) + 80,
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
          animate={{ left: '-30%', opacity: [0, 1, 1, 0] }}
          transition={{ duration: l.duration, ease: 'linear' }}
          className="absolute font-mono text-gray-800 font-black"
          style={{ top: `${l.top}%`, fontSize: `${l.size}px` }}
        >
          {l.char}
        </motion.div>
      ))}
    </div>
  );
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const url = `${API_URL}/api/auth/${isLogin ? 'login' : 'register'}`;
      const res = await axios.post(url, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      setSuccess(true);
      setTimeout(() => navigate('/home'), 3500);
    } catch (err) {
      console.error(err.response?.data);
      setError(err.response?.data?.error || err.response?.data?.message || 'Authentication failed');
    }
  };

  if (success) {
    const text = `Halo ${user?.username} !`;
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.h1 
          className="text-3xl md:text-4xl font-serif font-bold gemini-gradient-text"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 1 },
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {text.split('').map((char, index) => (
            <motion.span
              key={index}
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-floating-gradient relative overflow-hidden">
      <DynamicBackground />
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/90 backdrop-blur-md p-6 rounded shadow-lg w-full max-w-sm animate-floating-box border border-gray-100 z-10"
      >
        <h2 className="text-2xl font-serif font-bold text-center mb-5 text-gray-800">
          {isLogin ? 'Welcome Back' : 'Join DiaryMe'}
        </h2>
        
        {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-xs shadow-sm" style={{ fontFamily: 'Arial, sans-serif' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3 font-sans text-sm">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-gray-700">Username</label>
              <input 
                type="text" 
                required 
                className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-mocca focus:border-mocca"
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              required 
              className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-mocca focus:border-mocca"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              required 
              className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-mocca focus:border-mocca"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            {!isLogin && (
              <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded">
                <p className="text-[10px] font-semibold text-gray-700 mb-1 font-sans">Password Requirements:</p>
                <ul className="text-[10px] space-y-1 font-sans">
                  <li className={`transition-colors ${formData.password?.length >= 5 ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                    Min 5 characters
                  </li>
                  <li className={`transition-colors ${/[A-Z]/.test(formData.password || '') ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                    Uppercase letter
                  </li>
                  <li className={`transition-colors ${/[a-z]/.test(formData.password || '') ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                    Lowercase letter
                  </li>
                  <li className={`transition-colors ${/[0-9]/.test(formData.password || '') ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                    Number
                  </li>
                  <li className={`transition-colors ${/[@$!%*?&]/.test(formData.password || '') ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                    Special character (@$!%*?&)
                  </li>
                </ul>
              </div>
            )}
          </div>
          <button type="submit" className="w-full flex justify-center py-1.5 px-4 border border-transparent rounded text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none mt-4">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center font-sans">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-mocca hover:text-gray-800">
            {isLogin ? 'Need an account? Register here' : 'Already have an account? Sign in here'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
