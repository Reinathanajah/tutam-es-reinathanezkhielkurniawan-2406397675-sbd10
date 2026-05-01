import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Intro from './pages/Intro';
import Auth from './pages/Auth';
import Home from './pages/Home';
import AddNew from './pages/AddNew';
import SeeOthers from './pages/SeeOthers';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/add" element={<AddNew />} />
        <Route path="/others" element={<SeeOthers />} />
      </Routes>
    </Router>
  );
}

export default App;
