import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Header from '../components/Header';

const SeeOthers = () => {
  const [diaries, setDiaries] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [commentText, setCommentText] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchDiaries(page);
  }, [page]);

  const fetchDiaries = async (p) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/entries/public?page=${p}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDiaries(res.data.entries);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  const submitComment = async () => {
    if (!commentText.trim()) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/entries/${selectedDiary._id}/comment`, { text: commentText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommentText('');
      setSelectedDiary(prev => ({
        ...prev,
        comments: [...prev.comments, { username: JSON.parse(localStorage.getItem('user')).username, text: commentText, createdAt: new Date() }]
      }));
    } catch (err) {
      alert('Failed to comment');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-serif text-[#2C2C2C] flex flex-col items-center">
      <div className="w-full max-w-7xl bg-[#FDFBF7] min-h-screen flex flex-col border-x border-[#DAD3C8] shadow-2xl">
        <Header />
        
        <main className="flex-1 p-8 md:p-12 flex gap-12">
          <div className="w-1/3 flex flex-col gap-6 border-r-2 border-[#2C2C2C] pr-8">
            <h2 className="text-4xl md:text-5xl font-vintage text-[#1A1A1A] border-b-4 border-double border-[#2C2C2C] pb-2">The Archives</h2>
            <div className="space-y-6 overflow-y-auto pr-2">
              {diaries.map((d, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                  key={d._id} onClick={() => setSelectedDiary(d)}
                  className={`pb-4 border-b border-[#DAD3C8] cursor-pointer transition ${selectedDiary?._id === d._id ? 'opacity-50' : 'hover:opacity-70'}`}
                >
                  <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] mb-2 text-[#5A5A5A]">By {d.user?.username}</p>
                  <h4 className="font-vintage text-3xl leading-none text-[#1A1A1A]">{d.title}</h4>
                </motion.div>
              ))}
            </div>
            
            <div className="flex justify-between items-center mt-auto pt-6 border-t-2 border-[#2C2C2C]">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="text-[10px] font-sans font-bold uppercase tracking-widest disabled:opacity-30 border border-[#2C2C2C] px-3 py-1 hover:bg-[#2C2C2C] hover:text-[#FDFBF7] transition">Prev</button>
              <span className="font-serif italic text-sm text-[#5A5A5A]">{page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="text-[10px] font-sans font-bold uppercase tracking-widest disabled:opacity-30 border border-[#2C2C2C] px-3 py-1 hover:bg-[#2C2C2C] hover:text-[#FDFBF7] transition">Next</button>
            </div>
          </div>

          <div className="flex-1 relative flex justify-center items-start">
            {selectedDiary ? (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#F4EFE6] border border-[#2C2C2C] shadow-[8px_8px_0px_#2C2C2C] w-full max-w-4xl flex flex-col relative px-8 md:px-16 pt-16 pb-12">
                  <div className="absolute top-4 left-6 right-6 h-1 border-t-2 border-b-2 border-double border-[#2C2C2C]" />
                  <div className="text-center mb-16 px-4">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] border border-[#2C2C2C] px-4 py-1 mb-8 inline-block shadow-[2px_2px_0px_#2C2C2C]">{selectedDiary.subCategory}</span>
                    <h1 className="text-6xl md:text-7xl font-vintage text-[#1A1A1A] mt-6 tracking-tight leading-[0.9] text-balance mb-6">{selectedDiary.title}</h1>
                    <div className="text-[11px] tracking-[0.2em] uppercase font-sans text-[#5A5A5A] font-bold">
                      By {selectedDiary.user?.username} • {new Date(selectedDiary.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {selectedDiary.media && (
                    <div className="mb-10 border-y-2 border-[#2C2C2C] py-2 bg-[#FDFBF7]">
                      <img src={selectedDiary.media} alt="Media" className="max-h-[400px] w-full object-contain filter grayscale contrast-125 sepia-[.3]" />
                    </div>
                  )}
                  
                  <div className="font-serif text-[1.1rem] leading-relaxed text-[#2C2C2C] text-justify columns-1 gap-12 max-w-3xl mx-auto">
                    <p className="whitespace-pre-wrap first-letter:text-8xl first-letter:font-vintage first-letter:float-left first-letter:mr-3 first-letter:mt-[-8px] first-letter:leading-[0.8] first-letter:text-[#1A1A1A]">
                      {selectedDiary.content}
                    </p>
                  </div>

                <div className="mt-16 pt-8 border-t-4 border-[#2C2C2C] border-double">
                  <h3 className="font-vintage text-4xl mb-8 text-[#1A1A1A]">
                    Reader Commentary <span className="font-sans text-xs align-top border border-[#2C2C2C] rounded-full w-6 h-6 inline-flex items-center justify-center bg-[#2C2C2C] text-white ml-2">{selectedDiary.comments?.length || 0}</span>
                  </h3>
                  <div className="max-h-60 overflow-y-auto space-y-6 mb-8 pr-4">
                    {selectedDiary.comments?.map((c, i) => (
                      <div key={i} className="border-b border-dashed border-[#A8A8A8] pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-baseline mb-2">
                          <span className="font-sans font-bold uppercase tracking-widest text-[10px] text-[#1A1A1A]">{c.username}</span>
                          <span className="text-[#5A5A5A] text-xs font-serif italic">{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="font-serif text-base text-[#2C2C2C]">{c.text}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-4 border-t border-[#DAD3C8] pt-6">
                    <textarea 
                      className="w-full border-2 border-[#2C2C2C] p-4 font-serif bg-[#FDFBF7] resize-none focus:outline-none focus:ring-2 focus:ring-[#2C2C2C] focus:ring-offset-2 transition-all h-28 text-lg" 
                      placeholder="Draft your thoughts here..." 
                      value={commentText} 
                      onChange={e => setCommentText(e.target.value)} 
                    />
                    <button onClick={submitComment} className="self-start uppercase font-sans font-bold tracking-[0.2em] text-[10px] px-8 py-3 bg-[#2C2C2C] text-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-[#2C2C2C] border-2 border-[#2C2C2C] transition-colors shadow-[4px_4px_0px_#1A1A1A] hover:shadow-none hover:translate-x-1 hover:translate-y-1">Publish Box</button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center w-full sticky top-32">
                <p className="text-[#5A5A5A] font-serif italic text-3xl text-center border-b border-[#2C2C2C] pb-6">
                  Select a manuscript<br/>from the left archives
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SeeOthers;
