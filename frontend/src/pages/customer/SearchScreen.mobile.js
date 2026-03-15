// src/pages/customer/SearchScreen.mobile.js
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import './SearchScreenMobile.css';

const MENU_ITEMS = [
  { title: 'เช่ารถ', subs: ['รายวัน', 'รายเดือน', 'พร้อมคนขับ'] },
  { title: 'เช่ามอเตอร์ไซค์', subs: ['รายวัน', 'ท่องเที่ยว'] },
  { title: 'ติวเรียน', subs: ['คณิตศาสตร์', 'อังกฤษ', 'วิทย์'] },
  { title: 'บริการ', subs: ['ซ่อม', 'จัดส่ง'] },
];

const SearchScreenMobile = () => {
  const [query, setQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);

  // Typewriter
  const phrases = [
    "ค้นหารถสนามบินได้ทันใจ...",
    "เปรียบเทียบราคาเช่าง่าย ๆ...",
    "จองรถพร้อมรับ-ส่งสนามบิน...",
    "บริการเช่ารถแบบครบวงจร...",
  ];
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let char = 0;
    let timer;
    const loop = () => {
      const phrase = phrases[index];
      if (!deleting) {
        setText(phrase.substring(0, char + 1));
        char++;
        if (char === phrase.length) { timer = setTimeout(() => setDeleting(true), 1200); return; }
      } else {
        setText(phrase.substring(0, char - 1));
        char--;
        if (char === 0) { setDeleting(false); setIndex((prev)=> (prev+1)%phrases.length); }
      }
      timer = setTimeout(loop, deleting?40:90);
    };
    loop();
    return ()=>clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, deleting]);

  const doSearch = () => query && console.log('Search:', query);
  const toggleMenuSection = (i) => setExpandedMenu(prev => (prev===i?null:i));

  return (
    <div className="search-mobile full-screen">
      {/* Header */}
      <div className="search-header">
        <div className="logo-name">
          <img src="/logo192.png" alt="Logo" className="logo"/>
          <span className="site-name">Rent a car with Katty</span>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="notification-btn"><Bell size={24}/></button>
          <button className="navbar-hamburger" onClick={()=>setIsMenuOpen(!isMenuOpen)}>☰</button>
        </div>
      </div>

      {/* Typewriter */}
      <div className="typewriter-text">{text}<span className="cursor">|</span></div>

      {/* Search pill */}
      <div className="search-pill">
        <span className="pill-icon" onClick={doSearch}>🔍</span>
        <input
          type="text"
          value={query}
          onChange={e=>setQuery(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&doSearch()}
          className="pill-input"
          placeholder="สนามบิน, เมือง หรือสถานี..."
        />
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu ${isMenuOpen?'open':''}`} onClick={()=>setIsMenuOpen(false)}>
        <div className="mobile-menu-inner" onClick={e=>e.stopPropagation()}>
          <div className="mobile-menu-top">
            <Link to="/" onClick={()=>setIsMenuOpen(false)}>
              <img src="/logo192.png" alt="Logo" style={{width:32,height:32}}/>
              <span>Rent a car with Katty</span>
            </Link>
            <button onClick={()=>setIsMenuOpen(false)}>✕</button>
          </div>
          <div className="mobile-menu-links">
            {MENU_ITEMS.map((m,i)=>(
              <div key={i} className="mobile-menu-section">
                <button className="mobile-menu-section-title" onClick={()=>toggleMenuSection(i)}>
                  {m.title} {expandedMenu===i?'▴':'▾'}
                </button>
                {expandedMenu===i && <div className="mobile-menu-section-items">
                  {m.subs.map((s,si)=>(
                    <Link key={si} to={`/cars?q=${encodeURIComponent(s)}`} className="mobile-menu-link" onClick={()=>setIsMenuOpen(false)}>
                      {s}
                    </Link>
                  ))}
                </div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchScreenMobile;
