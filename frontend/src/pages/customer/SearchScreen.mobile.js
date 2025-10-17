// src/components/SearchScreenMobile.js
import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import './SearchScreenMobile.css';

const MENU_ITEMS = [
  { title: 'เช่ารถ', subs: ['เช่ารายวัน', 'เช่ารายเดือน', 'เช่าพร้อมคนขับ', 'ท่องเที่ยว', 'ธุรกิจ', 'รถไฟฟ้า'] },
  { title: 'เช่ามอเตอร์ไซค์', subs: ['รายวัน', 'ท่องเที่ยว', 'สกู๊ตเตอร์ไฟฟ้า', 'พรีเมียม'] },
  { title: 'ติวเรียน', subs: ['คณิตศาสตร์', 'ภาษาอังกฤษ', 'วิทยาศาสตร์', 'ติวสอบเข้า', 'เรียนออนไลน์'] },
  { title: 'บริการ', subs: ['ช่างซ่อม', 'จัดส่ง', 'ทำความสะอาด', 'รับส่งสนามบิน'] },
  { title: 'องค์กร', subs: ['เช่าองค์กร', 'แพ็กเกจพนักงาน', 'เช่าสำหรับอีเวนท์'] },
];

const SearchScreenMobile = () => {
  const [query, setQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null); // เก็บหัวข้อที่เปิดอยู่
  const inputRef = useRef(null);

  const phrasesRef = useRef([
    "เช่ารถรายวันง่ายๆ...",
    "เช่ามอเตอร์ไซค์สะดวก...",
    "ติวเรียนคณิตศาสตร์ออนไลน์..."
  ]);

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // ================== Typewriter Effect ต่อเนื่อง ==================
  useEffect(() => {
    let charIndex = 0;
    let timeout;

    const type = () => {
      const currentPhrase = phrasesRef.current[currentPhraseIndex];

      if (!isDeleting) {
        setDisplayedText(currentPhrase.substring(0, charIndex + 1));
        charIndex++;
        if (charIndex === currentPhrase.length) {
          setIsDeleting(true);
        }
      } else {
        setDisplayedText(currentPhrase.substring(0, charIndex - 1));
        charIndex--;
        if (charIndex === 0) {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrasesRef.current.length);
        }
      }

      timeout = setTimeout(type, isDeleting ? 50 : 100); // ความเร็วพิมพ์ / ลบ
    };

    type();
    return () => clearTimeout(timeout);
  }, [currentPhraseIndex, isDeleting]);
  // ==================================================================

  const doSearch = () => {
    if (!query) return;
    console.log('Searching:', query);
  };

  const handleNotification = () => {
    console.log('Notification clicked!');
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const toggleMenuSection = (index) => {
    setExpandedMenu(prev => (prev === index ? null : index));
  };

  return (
    <div className="search-mobile">
      {/* Header โลโก้ + ชื่อเว็บ + notification */}
      <div className="search-header">
        <div className="logo-name">
          <img src="/logo192.png" alt="Logo" className="logo" />
          <span className="site-name">Klick Drive</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="notification-btn" onClick={handleNotification}>
            <Bell size={28} />
          </button>
          <button className="navbar-hamburger" onClick={toggleMobileMenu}>☰</button>
        </div>
      </div>

      {/* ข้อความวิ่งตรงกลาง */}
      <div className="typewriter-text">
        {displayedText}
        <span className="cursor">|</span>
      </div>

      {/* Search Pill */}
      <div className="search-pill">
        <span className="pill-icon" onClick={doSearch}>🔍</span>
        <input
          type="text"
          className="pill-input"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && doSearch()}
          placeholder="ค้นหาฟรีแลนซ์..."
          ref={inputRef}
        />
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`} onClick={closeMobileMenu}>
        <div className="mobile-menu-inner" onClick={e => e.stopPropagation()}>
          <div className="mobile-menu-top">
            <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
              <img src="/logo192.png" alt="Logo" style={{ width: 32, height: 32 }} />
              <span>Klick Drive</span>
            </Link>
            <button className="navbar-hamburger" onClick={closeMobileMenu}>✕</button>
          </div>

          <div className="mobile-menu-links">
            {MENU_ITEMS.map((m, index) => (
              <div key={index} className="mobile-menu-section">
                <button
                  className="mobile-menu-section-title"
                  onClick={() => toggleMenuSection(index)}
                  style={{ display: 'flex', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0' }}
                >
                  {m.title} <span>{expandedMenu === index ? '▴' : '▾'}</span>
                </button>
                {expandedMenu === index && (
                  <div className="mobile-menu-section-items">
                    {m.subs.map((s, si) => (
                      <Link key={si} className="mobile-menu-link" to={`/cars?q=${encodeURIComponent(s)}`} onClick={closeMobileMenu}>
                        {s}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchScreenMobile;
