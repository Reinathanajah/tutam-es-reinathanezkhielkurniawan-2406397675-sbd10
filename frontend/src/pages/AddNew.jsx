import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

const AddNew = () => {
  const [entries, setEntries] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('All');
  const [type, setType] = useState('Diary');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subCategory, setSubCategory] = useState('Ungkapan');
  const [isPublic, setIsPublic] = useState(false);
  const [media, setMedia] = useState(null); 
  const [remindMeIn, setRemindMeIn] = useState('1 days');
  const [calendarDate, setCalendarDate] = useState('');
  const [activity, setActivity] = useState('');
  const [todos, setTodos] = useState(''); 
  const [template, setTemplate] = useState('Folio'); 
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#000000');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const navigate = useNavigate();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/entries/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEntries(res.data);
    } catch (err) {
      if(err.response?.status === 401) navigate('/login');
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      let payload = { type, title };
      
      let finalMedia = media;
      if (type === 'Diary' && template === 'Scratch' && canvasRef.current) {
        finalMedia = canvasRef.current.toDataURL();
      }

      if (type === 'Diary') {
        payload = { ...payload, subCategory, isPublic, content, media: finalMedia };
      } else if (type === 'ToDo') {
        payload.todos = todos.split('\n').filter(t => t.trim()).map(text => ({ text, isCompleted: false }));
      } else if (type === 'DueDate') {
        payload = { ...payload, calendarDate, activity, remindMeIn };
      }

      await axios.post(`${API_URL}/api/entries`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEntries();
      
      setTitle('');
      setContent('');
      setTodos('');
      setActivity('');
      setMedia(null);
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    } catch (err) {

    }
  };

  const handleDelete = async (id, name) => {
    const confirmation = window.prompt(`Confirm deletion of ${name} (Yes/Ok)`);
    if (confirmation === 'Yes' || confirmation === 'Ok') {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/api/entries/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchEntries();
      } catch (err) {

      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setMedia(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = penColor;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const filteredEntries = filter === 'All' ? entries : entries.filter(e => {
    if (filter === 'Show Due Date') return e.type === 'DueDate';
    if (filter === 'Show To-Do') return e.type === 'ToDo';
    if (filter === 'Show Diary') return e.type === 'Diary';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col items-center pb-12">
      <div className="w-full max-w-5xl bg-white min-h-screen shadow-sm border border-gray-200 flex flex-col mt-4 rounded-t-xl">
        <Header />
        
        <main className="flex-1 p-6 md:p-10 space-y-10">
          <div className="max-w-4xl mx-auto flex flex-col gap-6 border border-gray-200 rounded-lg p-6 shadow-sm bg-white">
            <div className="flex gap-4 border-b border-gray-200 pb-4 mb-2 items-center flex-wrap">
              <select className="border border-gray-300 p-2 text-sm font-semibold bg-gray-50 text-gray-700 focus:outline-none focus:ring-1 focus:ring-mocca rounded cursor-pointer hover:bg-gray-100 transition-colors" value={type} onChange={e => setType(e.target.value)}>
                <option value="Diary">Diary</option>
                <option value="ToDo">To-Do</option>
                <option value="DueDate">Due Date</option>
              </select>
              <input 
                type="text" placeholder="Document Title Here..." maxLength={50}
                className="p-2 flex-1 font-serif text-2xl bg-transparent focus:outline-none placeholder-gray-400 text-gray-800 border-b border-transparent focus:border-gray-300" value={title} onChange={e => setTitle(e.target.value)}
              />
              <button onClick={handleSave} className="bg-gray-800 border border-gray-800 text-white px-6 py-2 text-sm font-semibold rounded hover:bg-gray-700 transition-colors shadow-sm">Save File</button>
            </div>

            {type === 'Diary' ? (
              <div className="space-y-4">
                <div className="flex gap-6 items-center flex-wrap bg-gray-50 border border-gray-200 rounded p-3 text-gray-700 text-sm font-medium">
                  <select className="bg-transparent focus:outline-none cursor-pointer" value={subCategory} onChange={e => setSubCategory(e.target.value)}>
                    <option value="Ungkapan">Ungkapan</option>
                    <option value="Deskripsi">Deskripsi</option>
                    <option value="Point">Point</option>
                    <option value="Narasi">Narasi</option>
                  </select>
                  <label className="flex items-center gap-2 cursor-pointer border-l border-gray-300 pl-6">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-mocca focus:ring-mocca" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />
                    Public Access
                  </label>
                  <select className="bg-transparent focus:outline-none border-l border-gray-300 pl-6 cursor-pointer" value={template} onChange={e => setTemplate(e.target.value)}>
                    <option value="Folio">Standard</option>
                    <option value="Point-point">Bullet Points</option>
                    <option value="Scratch">Canvas Media</option>
                  </select>
                </div>

                {template === 'Scratch' ? (
                  <div className="border border-gray-200 rounded p-4 min-h-[460px] flex flex-col items-center justify-center relative bg-gray-50">
                    <div className="flex flex-col items-center gap-4 w-full h-full relative z-10">
                      <div className="flex justify-between items-center w-[800px] max-w-full px-4 border-b border-gray-200 pb-3 z-20">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          Ink Color:
                          <input type="color" value={penColor} onChange={e => setPenColor(e.target.value)} className="w-6 h-6 cursor-pointer border-0 bg-transparent p-0 rounded" title="Pen Color" />
                        </label>
                      </div>
                      <canvas 
                        ref={canvasRef} width={800} height={320}
                        className="bg-white border border-gray-200 cursor-crosshair shadow-sm max-w-full relative z-10 rounded"
                        onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                      ></canvas>
                      <button onClick={() => {
                        const ctx = canvasRef.current.getContext('2d');
                        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                      }} className="bg-white text-gray-700 text-sm mt-2 px-4 py-1.5 border border-gray-300 rounded hover:bg-gray-100 transition-colors">Clear Canvas</button>
                    </div>
                  </div>
                ) : (
                  <textarea 
                    className="w-full min-h-[400px] p-6 resize-y font-serif text-lg leading-relaxed focus:outline-none border border-gray-200 rounded bg-white text-gray-800 shadow-sm"
                    placeholder={template === 'Point-point' ? '• Point 1\n• Point 2' : 'Commence your draft...'}
                    value={content} onChange={e => setContent(e.target.value)}
                  ></textarea>
                )}
              </div>
            ) : null}

            {type === 'ToDo' ? (
              <textarea className="w-full h-[400px] p-6 bg-white resize-y font-sans text-lg leading-relaxed focus:outline-none border border-gray-200 rounded text-gray-800 shadow-sm" placeholder="Itemize your directives..." value={todos} onChange={e => setTodos(e.target.value)}></textarea>
            ) : null}

            {type === 'DueDate' ? (
              <div className="space-y-6 bg-gray-50 p-8 border border-gray-200 rounded-lg shadow-sm max-w-xl mx-auto">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Designated Date</label>
                  <input type="date" className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-mocca text-gray-800 font-sans bg-white" value={calendarDate} onChange={e => setCalendarDate(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Designated Activity</label>
                  <input type="text" className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-mocca text-gray-800 font-sans bg-white placeholder-gray-400" placeholder="Event description" value={activity} onChange={e => setActivity(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Notification</label>
                  <select className="p-3 border border-gray-300 rounded bg-white font-sans text-gray-800 focus:outline-none focus:ring-1 focus:ring-mocca cursor-pointer" value={remindMeIn} onChange={e => setRemindMeIn(e.target.value)}>
                    <option value="1 days">1 day before</option>
                    <option value="3 days">3 days before</option>
                    <option value="7 days">7 days before</option>
                    <option value="30 days before">30 days before</option>
                  </select>
                </div>
              </div>
            ) : null}
          </div>

          <div className="pt-16 max-w-5xl mx-auto">
            <h2 className="text-2xl font-serif text-gray-800 mb-6 text-center border-b border-gray-200 pb-4">Recent Manuscripts</h2>
            
            <div className="flex gap-3 justify-center mb-8 flex-wrap">
              {['All', 'Show Due Date', 'Show To-Do', 'Show Diary'].map(f => (
                <button 
                  key={f} onClick={() => setFilter(f)} 
                  className={`px-4 py-1.5 text-xs font-semibold rounded transition-colors ${filter === f ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEntries.map((e) => (
                <div key={e._id} className="bg-[#F4EFE6] p-6 border border-[#2C2C2C] shadow-[4px_4px_0px_#2C2C2C] flex flex-col group transition-all h-fit">
                  <div className="flex justify-between items-start cursor-pointer mb-2" onClick={() => setExpandedId(expandedId === e._id ? null : e._id)}>
                    <div className="flex-1 pr-4">
                      <div className="text-[10px] font-bold font-sans text-[#2C2C2C] uppercase tracking-widest mb-3 border-b border-[#2C2C2C] pb-2">
                        {e.type}
                      </div>
                      <h4 className="font-vintage text-3xl leading-tight text-[#1A1A1A] mb-3 group-hover:underline decoration-2 underline-offset-4">{e.title || 'Untitled Document'}</h4>
                      <p className="text-[10px] text-[#5A5A5A] font-serif uppercase tracking-widest">{new Date(e.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button onClick={(event) => { event.stopPropagation(); handleDelete(e._id, e.title); }} className="bg-transparent border border-[#2C2C2C] text-[#2C2C2C] px-3 py-1.5 text-[10px] uppercase font-bold hover:bg-[#2C2C2C] hover:text-[#FDFBF7] transition-colors shadow-[2px_2px_0px_#2C2C2C] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">Discard</button>
                  </div>
                  
                  {expandedId === e._id && (
                    <div className="mt-4 pt-4 border-t-2 border-dashed border-[#A8A8A8] text-sm font-serif text-[#1A1A1A] whitespace-pre-wrap">
                      {e.type === 'Diary' && (
                        <div>
                          {e.media && <img src={e.media} alt="diary media" className="mb-4 max-w-full border-2 border-[#2C2C2C] p-1 bg-white" />}
                          <p>{e.content || 'No text content.'}</p>
                        </div>
                      )}
                      {e.type === 'ToDo' && (
                        <ul className="list-disc pl-5 marker:text-[#2C2C2C]">
                          {e.todos?.map((t, i) => <li key={i}>{t.text}</li>)}
                        </ul>
                      )}
                      {e.type === 'DueDate' && (
                        <p className="font-sans text-xs uppercase tracking-wider">{e.activity} on {new Date(e.calendarDate).toLocaleDateString()} (Remind in: {e.remindMeIn})</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {filteredEntries.length === 0 ? <p className="text-left text-[#5A5A5A] font-serif uppercase tracking-widest text-sm col-span-full py-8 border-y border-dashed border-[#A8A8A8]">No records found matching this criterion.</p> : null}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default AddNew;
