import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Intro = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem('token');
      if (token) navigate('/home');
      else navigate('/login');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="bg-vintage border border-ink p-12 max-w-2xl w-full shadow-2xl flex flex-col items-center text-center relative"
      >
        <div className="absolute top-0 left-0 w-full h-1 border-t border-b border-ink mt-1" />
        <h1 className="text-6xl md:text-8xl font-serif font-black text-ink mb-6 uppercase tracking-tighter">DIARY<br/>ME</h1>
        <p className="font-serif text-lg md:text-xl italic text-gray-700 max-w-md border-t border-b border-docborder py-4 mb-8">
          A place for your thoughts, constructed with the discipline of a vintage press and the utility of the ultimate document editor.
        </p>
        <div className="w-full h-1 flex gap-1 justify-center overflow-hidden">
          <motion.div 
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="bg-ink h-full"
          />
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 border-t border-b border-ink mb-1" />
      </motion.div>
    </div>
  );
};

export default Intro;
