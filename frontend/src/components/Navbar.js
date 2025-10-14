import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

// Constants for the typing effect
const PLACEHOLDERS = [
    "ออกแบบโลโก้ร้านอาหารไหนดี...",
    "เปรียบเทียบราคาเช่ารถยนต์ SUV 7 ที่นั่ง...",
    "หาวิธีเรียนพิเศษคณิตศาสตร์สำหรับ ม.ปลาย...",
    "ค้นหาบริการเช่ามอเตอร์ไซค์...",
    "ติวสอบเข้ามหาลัย...",
];
const TYPING_SPEED = 100; // Speed of character appearance (ms)
const DELETING_SPEED = 50;  // Speed of character disappearance (ms)
const PAUSE_DURATION = 1500; // Pause duration after typing (ms)


const NavbarLogin = () => {
    const { user, logout } = useContext(AuthContext);
    const [query, setQuery] = useState('');
    const [showFullNav, setShowFullNav] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // State for Typewriter Effect
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // Effect for Typewriter Placeholder Animation
    useEffect(() => {
        const fullText = PLACEHOLDERS[placeholderIndex % PLACEHOLDERS.length];
        let timer;

        if (isDeleting) {
            // DELETING phase: remove characters
            timer = setTimeout(() => {
                setDisplayedPlaceholder(prev => prev.substring(0, prev.length - 1));
            }, DELETING_SPEED);

            if (displayedPlaceholder === '') {
                // Finished deleting, switch to typing the next phrase
                setIsDeleting(false);
                setPlaceholderIndex(prev => prev + 1);
            }
        } else {
            // TYPING phase: add characters
            timer = setTimeout(() => {
                setDisplayedPlaceholder(prev => fullText.substring(0, prev.length + 1));
            }, TYPING_SPEED);

            if (displayedPlaceholder === fullText) {
                // Finished typing, start pause before deleting
                clearTimeout(timer);
                timer = setTimeout(() => setIsDeleting(true), PAUSE_DURATION);
            }
        }

        return () => clearTimeout(timer);
    }, [displayedPlaceholder, isDeleting, placeholderIndex]);


    // reveal navbar search and bottom row after user scrolls past the hero search pill
    useEffect(() => {
        // If we're not on the home page, keep the full navbar visible immediately.
        if (location.pathname && location.pathname !== '/') {
            setShowFullNav(true);
            return;
        }

        // On the home page: reveal after scrolling past the hero search pill.
        const hero = document.querySelector('.hero-search-pill');
        let threshold = 220;
        if (hero) {
            const rect = hero.getBoundingClientRect();
            threshold = window.scrollY + rect.top + rect.height;
        }
        // Set threshold slightly lower than the calculated position for a smoother reveal
        const onScroll = () => setShowFullNav(window.scrollY > threshold - 80); 
        window.addEventListener('scroll', onScroll, { passive: true });
        
        // run once on mount
        onScroll(); 
        
        return () => window.removeEventListener('scroll', onScroll);
    }, [location.pathname]);

    const doSearch = () => {
        if (!query) return navigate('/cars');
        navigate(`/cars?q=${encodeURIComponent(query)}`);
    };

    return (
        <nav className={`navbar ${showFullNav ? 'expanded' : 'collapsed'}`}>
            <div className="navbar-row navbar-top">
                <div className="navbar-left">
                    <Link to="/" className="navbar-brand">
                        <img src="/logo192.png" alt="Logo" style={{ width: 40, height: 40 }} />
                        <span>Klick Drive</span>
                    </Link>
                </div>

                <div className="navbar-search search-pill">
                    <div className="pill-content">
                        <div className="search-icon">✨</div>
                        <input
                            className="pill-input navbar-search-input"
                            placeholder={displayedPlaceholder || PLACEHOLDERS[0]} /* Use dynamic placeholder */
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && doSearch()}
                        />
                        <button className="pill-go" onClick={doSearch}>AI Search 🔍</button>
                    </div>
                </div>

                <div className="navbar-contact" style={{ marginLeft: 'auto' }}>
                    {user ? (
                        <>
                            <span>{user.username}</span>
                            <button className="navbar-link" onClick={logout}>ออกจากระบบ</button>
                        </>
                    ) : (
                        <Link to="/login" className="navbar-link">เข้าสู่ระบบ 🔑</Link>
                    )}
                </div>
            </div>

            <div className="navbar-row navbar-bottom">
                <div className="navbar-links">
                    <div className="navbar-topmenu">
                        {/* Category-driven navbar: text-only items with rich submenus */}
                        {[
                            { title: 'เช่ารถ', subs: ['เช่ารายวัน','เช่ารายเดือน','เช่าพร้อมคนขับ','เช่าสำหรับท่องเที่ยว','เช่าสำหรับธุรกิจ','เช่ารถไฟฟ้า'] },
                            { title: 'เช่ามอเตอร์ไชค์', subs: ['รายวัน','ท่องเที่ยว','สกู๊ตเตอร์ไฟฟ้า','มอเตอร์ไซค์พรีเมียม'] },
                            { title: 'เรียนพิเศษ', subs: ['ติวคณิต','ติวภาษาอังกฤษ','ติววิทย์','ติวสอบเข้า','เรียนออนไลน์'] },
                            { title: 'บริการ', subs: ['งานช่าง','รับส่ง','บริการทำความสะอาด','บริการสนามบิน'] },
                            { title: 'องค์กร', subs: ['เช่าองค์กร','แพ็กเกจพนักงาน','เช่าสำหรับอีเวนท์'] }
                        ].map((m, mi) => (
                            <div key={mi} className="menu-item dropdown hover-dropdown">
                                <button className="dropdown-toggle">{m.title} ▾</button>
                                <div className="dropdown-menu multi-col">
                                    {m.subs.map((s, si) => (
                                        <Link key={si} className="dropdown-item" to={`/cars?q=${encodeURIComponent(s)}`}>{s}</Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="navbar-quicklinks">
                    <button className="btn-outline" onClick={() => navigate('/cars?type=car')}>เช่ารถยนต์</button>
                    <button className="btn-outline" onClick={() => navigate('/cars?type=bike')}>เช่ามอเตอร์ไชค์</button>
                    <button className="btn-outline" onClick={() => navigate('/cars?type=special')}>เรียนพิเศษ / บริการเสริม</button>
                </div>
            </div>
        </nav>
    );
};

export default NavbarLogin;
