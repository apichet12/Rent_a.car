import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// i18n removed
import carsData from '../data/cars';
import './Home.css';
import LoadingOverlay from '../components/LoadingOverlay';

/* ---------------- CERTIFICATE CARD ---------------- */
function CertificateCard({ cert }) {
  const cardRef = useRef();

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMove = e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = (x / rect.width - 0.5) * 8;
      const rotateX = (0.5 - y / rect.height) * 6;
      card.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    };
    const reset = () => (card.style.transform = 'rotateY(0deg) rotateX(0deg)');

    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', reset);
    return () => {
      card.removeEventListener('mousemove', handleMove);
      card.removeEventListener('mouseleave', reset);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      style={{
        background: '#fff',
        borderRadius: 14,
        boxShadow: '0 8px 24px rgba(2,6,23,0.06)',
        width: 240,
        height: 300,
        overflow: 'hidden',
        transition: 'transform 0.18s ease',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <img src={cert.img} alt={cert.name} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
      <div style={{ padding: 12, textAlign: 'center', flex: 1 }}>
        <div style={{ color: '#4f46e5', fontWeight: 700, marginBottom: 6 }}>{cert.name}</div>
        <div style={{ color: '#64748b', fontSize: 13 }}>{cert.desc}</div>
      </div>
    </div>
  );
}

/* ---------------- FEATURED CARS ---------------- */
const FeaturedCars = ({ searchQuery, layout = 'grid' }) => {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cars_availability');
      if (stored) {
        const map = JSON.parse(stored);
        setCars(
          carsData.slice(0, 6).map(c => ({
            ...c,
            available: map[c.id] !== undefined ? map[c.id] : true
          }))
        );
      } else {
        const initial = carsData.slice(0, 6).map(c => ({ ...c, available: Math.random() > 0.3 }));
        setCars(initial);
        const map = {};
        initial.forEach(x => (map[x.id] = x.available));
        localStorage.setItem('cars_availability', JSON.stringify(map));
      }
    } catch {
      setCars(carsData.slice(0, 6).map(c => ({ ...c, available: Math.random() > 0.3 })));
    }
  }, []);

  const goToBooking = car => navigate('/booking', { state: { car } });

  const filteredCars = cars.filter(car =>
    car.name.toLowerCase().includes(searchQuery?.toLowerCase() || '')
  );

  return (
    <div className={layout === 'carousel' ? 'featured-cars-inner' : ''} style={layout === 'carousel' ? { display: 'flex', gap: 12 } : { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>
      {filteredCars.map(car => (
        <div key={car.id} style={{
          background: '#fff', padding: 12, borderRadius: 12,
          boxShadow: '0 6px 20px rgba(2,6,23,0.06)', display: 'flex',
          flexDirection: 'column', transition: 'transform .18s ease'
        }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <img src={car.image} alt={car.name} loading="lazy" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8 }} />
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#111827' }}>{car.name}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>ปี {car.year} • {car.seats} ที่นั่ง</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, color: '#06b6d4' }}>{car.price.toLocaleString()} ฿/วัน</div>
              <div style={{ fontSize: 12, marginTop: 6 }}>
                {car.available ? <span style={{ color: '#059669', fontWeight: 700 }}>ว่าง</span>
                               : <span style={{ color: '#ef4444', fontWeight: 700 }}>ไม่ว่าง</span>}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <button disabled={!car.available} onClick={() => goToBooking(car)}
              style={{
                flex: 1, padding: 10, borderRadius: 8, border: 'none',
                background: car.available ? 'linear-gradient(90deg,#06b6d4,#4f46e5)' : '#e5e7eb',
                color: '#fff', fontWeight: 700, cursor: car.available ? 'pointer' : 'not-allowed'
              }}>จอง</button>
            <button onClick={() => navigate(`/cars/${car.id}`)}
              style={{ padding: 10, borderRadius: 8, background: '#fff', border: '1px solid #e6e9f2', color: '#374151' }}>รายละเอียด</button>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ---------------- FAQ ---------------- */
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 8 }}>
      <div onClick={() => setOpen(!open)} style={{
        cursor: 'pointer', fontWeight: 600, color: '#0b74a6',
        display: 'flex', justifyContent: 'space-between'
      }}>
        {q} <span>{open ? '-' : '+'}</span>
      </div>
      {open && <div style={{ marginTop: 6, color: '#334155', fontSize: 14 }}>{a}</div>}
    </div>
  );
};

/* ---------------- SCROLL TO TOP BUTTON ---------------- */


/* ---------------- HOME PAGE ---------------- */
const Home = () => {
  const [search, setSearch] = useState('');
  const [typeText, setTypeText] = useState('');
  const [activeTab, setActiveTab] = useState('รถยนต์');

  const [bookingLocation, setBookingLocation] = useState('สนามบินสุวรรณภูมิ');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [pickupDate, setPickupDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [returnTime, setReturnTime] = useState('10:00');

  const typePhrasesRef = React.useRef([
    'ค้นหารถสนามบิน กรุงเทพฯ → เชียงใหม่...',
    'เปรียบเทียบราคาเช่ารถ 7 ที่นั่ง...',
    'จองรถพร้อมรับ-ส่งสนามบิน...',
    'เช่ารถระยะยาวคุ้มที่สุด...'
  ]);

  useEffect(() => {
    let phraseIndex = 0;
    let charIndex = 0;
    let forward = true;
    let timeoutId;
    const tick = () => {
      const current = typePhrasesRef.current[phraseIndex];
      if (forward) {
        charIndex++;
        setTypeText(current.slice(0, charIndex));
        if (charIndex === current.length) {
          forward = false;
          timeoutId = setTimeout(tick, 900);
          return;
        }
      } else {
        charIndex--;
        setTypeText(current.slice(0, charIndex));
        if (charIndex === 0) {
          forward = true;
          phraseIndex = (phraseIndex + 1) % typePhrasesRef.current.length;
        }
      }
      timeoutId = setTimeout(tick, forward ? 80 : 40);
    };
    timeoutId = setTimeout(tick, 400);
    return () => clearTimeout(timeoutId);
  }, []);

  const certificates = [
    { name: 'ISO 9001', img: '/images/iso9001.png', desc: 'มาตรฐานคุณภาพสากล' },
    { name: 'Thailand Trusted Quality', img: '/images/633db849-5816-477f-8c09-b0bac0df786f.jpg', desc: 'รับรองโดยหน่วยงานที่เกี่ยวข้อง' },
    { name: 'Best Car Rental 2024', img: '/images/2ee5f421-8d2b.jpg', desc: 'รางวัลยอดเยี่ยมแห่งปี' },
  ];

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const simulateSearchAndNavigate = (path = '/cars') => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(path);
    }, 700);
  };

  const handleBookingSearch = () => {
    const params = new URLSearchParams({
      location: bookingLocation,
      pickup: pickupDate,
      pickupTime,
      dropoff: returnDate,
      dropoffTime: returnTime,
    });
    setToastMessage(`กำลังค้นหา "${bookingLocation}" ...`);
    setTimeout(() => setToastMessage(''), 2400);
    simulateSearchAndNavigate(`/cars?${params.toString()}`);
  };

  const locationDropdownRef = useRef(null);

  const selectLocation = (loc) => {
    setBookingLocation(loc);
    setShowLocationDropdown(false);
  };

  const handleLocationInput = (value) => {
    setBookingLocation(value);
    setShowLocationDropdown(true);
  };

  useEffect(() => {
    const onClickOutside = (event) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
    };
    window.addEventListener('mousedown', onClickOutside);
    return () => window.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleClearBooking = () => {
    setBookingLocation('');
    const today = new Date();
    setPickupDate(today.toISOString().split('T')[0]);
    setReturnDate(() => {
      const d = new Date();
      d.setDate(d.getDate() + 3);
      return d.toISOString().split('T')[0];
    });
    setPickupTime('10:00');
    setReturnTime('10:00');
  };

  const popular = ['Family cars', 'Sports cars', 'Airport pickup', 'Self-drive', 'Long term', 'Math tuition', 'English'];

  const locationOptions = [
    { label: 'ประวัติศาสตร์', type: 'header' },
    { label: 'เมืองเมลเบิร์น', icon: '🏬' },
    { label: 'สถานียอดนิยม', type: 'header' },
    { label: 'สนามบินมิวินิก', icon: '✈️' },
    { label: 'สนามบินนานาชาติเชียงใหม่', icon: '✈️' },
    { label: 'สนามบินนานาชาติภูเก็ต', icon: '✈️' },
    { label: 'กรุงเทพฯ', icon: '🏙️' },
  ];

  // reveal-on-scroll for subcategory sections
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal-section'));
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // show minimal header-only view on first visit in this session
  const [introActive, setIntroActive] = useState(() => !sessionStorage.getItem('home_intro_seen'));

  useEffect(() => {
    if (!introActive) return;
    const onScroll = () => {
      if (window.scrollY > 30) {
        sessionStorage.setItem('home_intro_seen', '1');
        setIntroActive(false);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [introActive]);

  const dismissIntro = () => {
    sessionStorage.setItem('home_intro_seen', '1');
    setIntroActive(false);
  };

  return (
    <div className={`home-root ${introActive ? 'intro-active' : ''}`} style={{ padding: 0, background: 'linear-gradient(120deg,#f8fafc 60%,#e0e7ff 100%)', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      <LoadingOverlay visible={loading} />
      {toastMessage && (
        <div className="toast-notification">
          <div className="toast-content">{toastMessage}</div>
        </div>
      )}

      {/* Intro overlay: when introActive is true we keep header visible and hide the page body */}
      {introActive && (
        <div className="intro-banner">
          <div className="intro-inner">
            <div className="logo-only">
              <img src="/images/logo.png" alt="logo" style={{ height: 34 }} onError={(e)=>{e.currentTarget.style.display='none'}} />
            </div>
            <div className="intro-actions">
              <button className="btn btn-outline" onClick={() => { dismissIntro(); navigate('/login'); }}>เข้าสู่ระบบ</button>
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="hero-outer">
        <div className="hero-inner">
          <div className="hero-left">
            <h1>เช่ารถกับแคทตี้ — ค้นหา เปรียบเทียบ จองง่ายในที่เดียว</h1>
            <p>บริการจัดหารถเช่า พร้อมตัวเลือกเปรียบเทียบราคาจากหลายเจ้า และบริการรับ-ส่งสนามบิน</p>
            <div className="hero-subtitle">คลิกเลือกประเภทบริการ แล้วเริ่มค้นหารถที่ตรงใจคุณได้เลย</div>
          </div>

          <div className="hero-right">
            <div className="booking-card">
              <div className="booking-card-header">
                <div className="booking-tabs">
                  {['รถยนต์', 'รถบรรทุก', 'การสมัครสมาชิก'].map((tab) => (
                    <button
                      key={tab}
                      className={`booking-tab ${tab === activeTab ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab)}
                      aria-selected={tab === activeTab}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <button className="booking-link" onClick={() => navigate('/booking')}>ดู/แก้ไขข้อมูลการจองของฉัน</button>
              </div>

              <div className="booking-row">
                <div className="booking-field booking-location">
                  <label>จุดรับรถ</label>
                  <input
                    type="text"
                    value={bookingLocation}
                    onChange={e => handleLocationInput(e.target.value)}
                    onFocus={() => setShowLocationDropdown(true)}
                    placeholder={
                      activeTab === 'รถบรรทุก'
                        ? 'เลือกที่รับสินค้า หรือคลังสินค้า'
                        : 'สนามบิน, เมือง หรือสถานี'
                    }
                    autoComplete="off"
                  />

                  {showLocationDropdown && (
                    <div className="location-dropdown" ref={locationDropdownRef}>
                      {(() => {
                        const query = bookingLocation.trim().toLowerCase();
                        const groups = [];
                        let currentGroup = null;

                        locationOptions.forEach((opt) => {
                          if (opt.type === 'header') {
                            currentGroup = { header: opt.label, items: [] };
                            groups.push(currentGroup);
                            return;
                          }

                          const matches = !query || opt.label.toLowerCase().includes(query);
                          if (matches && currentGroup) {
                            currentGroup.items.push(opt);
                          }
                        });

                        return groups.map((group, gi) => {
                          if (!group.items.length) return null;
                          return (
                            <div key={gi}>
                              <div className="location-dropdown-heading">{group.header}</div>
                              {group.items.map((opt, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  className="location-dropdown-item"
                                  onMouseDown={() => selectLocation(opt.label)}
                                >
                                  <span className="location-icon">{opt.icon}</span>
                                  <span>{opt.label}</span>
                                </button>
                              ))}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  )}
                </div>
                <div className="booking-field booking-field-ext">
                  <button className="link-button">+ สถานที่ส่งคืนที่แตกต่างกัน</button>
                </div>
              </div>
              <div className="booking-row">
                <div className="booking-field">
                  <label>วันที่รับ</label>
                  <input type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} />
                </div>
                <div className="booking-field">
                  <label>เวลา</label>
                  <input type="time" value={pickupTime} onChange={e => setPickupTime(e.target.value)} />
                </div>
              </div>
              <div className="booking-row">
                <div className="booking-field">
                  <label>วันที่คืน</label>
                  <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} />
                </div>
                <div className="booking-field">
                  <label>เวลา</label>
                  <input type="time" value={returnTime} onChange={e => setReturnTime(e.target.value)} />
                </div>
              </div>
              <div className="booking-row booking-actions">
                <button className="btn btn-primary" onClick={handleBookingSearch}>รถโชว์</button>
                <button className="btn btn-outline" onClick={handleClearBooking}>ล้าง</button>
              </div>
              <div className="booking-note">
                <span>ใช้อัตราค่าบริการของบริษัท</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 12px 40px' }}>
        {/* Category panel: clean text-only grid + many subcategory sections (reveal on scroll) */}
        <div style={{ marginTop: -28, padding: '0 12px' }}>
          <div className="category-card">
            <div className="category-header">
              <div>
                <h3 style={{ margin: 0 }}>บริการยอดนิยม</h3>
                <div style={{ color: '#6b7280', marginTop: 6 }}>เลือกหมวดหมู่ที่คุณสนใจ — กดเพื่อเลื่อนไปยังหัวข้อย่อย</div>
              </div>
              <div>
                <button className="btn-outline" onClick={() => navigate('/cars')}>ดูทั้งหมด</button>
              </div>
            </div>

            <div className="category-grid">
              {[
                'เช่ารถยนต์','เช่ามอเตอร์ไชค์','เรียนพิเศษ','เช่ารถตู้','เช่าระยะสั้น','เช่าระยะยาว','งานช่าง','บริการรับ-ส่ง','บริการสำหรับองค์กร','เช่ารถพรีเมียม','รถครอบครัว','รถสปอร์ต','รถไฟฟ้า','บริการเดลิเวอรี่','ไกด์ท่องเที่ยว','บริการสนามบิน','เช่าแบบมีคนขับ','เช่าขับเอง','บริการทำความสะอาด','งานแต่งงาน'
              ].map((c, i) => (
                <button key={c} className="category-btn" onClick={() => {
                  const el = document.getElementById(`section-${i}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}>{c}</button>
              ))}
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>คำค้นหายอดนิยม</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {popular.map((s, i) => (
                  <button key={i} onClick={() => navigate(`/cars?q=${encodeURIComponent(s)}`)} className="btn-outline">{s}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Subcategory sections - many items, reveal on scroll */}
          <div style={{ marginTop: 18 }}>
            {[{
              title: 'เช่ารถยนต์', items: ['เช่ารายวัน','เช่ารายเดือน','เช่าพร้อมคนขับ','เช่าสำหรับท่องเที่ยว','เช่าสำหรับธุรกิจ','เช่าตามจังหวัด','เช่าแบบระยะยาว']
            },{
              title: 'เช่ามอเตอร์ไชค์', items: ['มอเตอร์ไชค์รายวัน','มอเตอร์ไชค์ท่องเที่ยว','สกู๊ตเตอร์ไฟฟ้า','มอเตอร์ไชค์พรีเมียม']
            },{
              title: 'เรียนพิเศษ', items: ['ติวคณิตศาสตร์','ติวภาษาอังกฤษ','ติววิทยาศาสตร์','ติวสอบเข้ามัธยม','เรียนออนไลน์']
            },{
              title: 'บริการสำหรับองค์กร', items: ['เช่ารถองค์กร','แพ็กเกจพนักงาน','เช่าสำหรับอีเวนท์','สัญญารายปี']
            },{
              title: 'งานช่าง & บริการ', items: ['ช่างไฟฟ้า','ช่างประปา','ช่างซ่อมทั่วไป','ติดตั้งเครื่องใช้ไฟฟ้า','แม่บ้าน/ทำความสะอาด']
            },{
              title: 'บริการพิเศษ', items: ['บริการส่งของ','บริการผู้ช่วยส่วนตัว','บริการไกด์','บริการสนามบิน']
            }].map((sec, idx) => (
              <section key={sec.title} id={`section-${idx}`} className="reveal-section" data-index={idx}>
                <h4>{sec.title}</h4>
                <div className="sub-list">
                  {sec.items.map((it, j) => <button key={j} className="sub-btn" onClick={() => navigate(`/cars?q=${encodeURIComponent(it)}`)}>{it}</button>)}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Featured */}
        <section style={{ marginTop: 22 }}>
          <h2 style={{ fontSize: 22, color: '#111827' }}>รถแนะนำ / Featured Cars</h2>
          <p style={{ color: '#6b7280' }}>เลือกดูรถยอดนิยม พร้อมสถานะการจองแบบเรียลไทม์</p>
          <div className="featured-cars-grid">
            <FeaturedCars searchQuery={search} layout={window.innerWidth <= 480 ? 'carousel' : 'grid'} />
          </div>
        </section>

       
        {/* Certificates */}
        <section style={{ marginTop: 28 }}>
          <h3 style={{ color: '#0b74a6' }}>ใบรับรองและรางวัล</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
            {certificates.map((c, i) => <CertificateCard key={i} cert={c} />)}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ marginTop: 26, background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 6px 24px rgba(15,23,42,0.04)' }}>
          <h3 style={{ color: '#0b74a6' }}>คำถามที่พบบ่อย</h3>
          <FAQItem q="จองรถเช่าอย่างไร?" a="สามารถเลือกจากรถที่ว่าง กดปุ่ม 'จอง' และกรอกข้อมูลการเช่าได้เลย" />
          <FAQItem q="ต้องใช้เอกสารอะไรบ้าง?" a="บัตรประชาชนและใบขับขี่ของผู้เช่า" />
          <FAQItem q="สามารถยกเลิกการจองได้หรือไม่?" a="สามารถยกเลิกได้ฟรีภายใน 24 ชั่วโมงก่อนถึงเวลารับรถ" />
          <FAQItem q="มีบริการรับรถที่สนามบินหรือไม่?" a="มีบริการรับรถที่สนามบินทุกสาขาหลัก" />
          <FAQItem q="มีประกันภัยรถเช่าหรือไม่?" a="ทุกรถมีประกันภัยชั้น 1 ครอบคลุม" />
        </section>

        {/* CTA */}
        <section style={{ marginTop: 20, textAlign: 'center' }}>
          <a href="/booking" className="btn btn-primary btn-lg">จองเลย — รับส่วนลดพิเศษ</a>
        </section>

      </main>

      {/* FOOTER */}
      <footer style={{ background: '#eef2ff', padding: '2rem 1rem', marginTop: 28 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 18 }}>
          <div>
            <h4 style={{ color: '#0b74a6' }}>บริการลูกค้า</h4>
            <ul style={{ color: '#334155', listStyle: 'none', padding: 0 }}>
              <li>การรับประกันบริการ</li>
              <li>ข้อมูลบริการเพิ่มเติม</li>
              <li>ติดต่อเรา</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#0b74a6' }}>เกี่ยวกับ</h4>
            <ul style={{ color: '#334155', listStyle: 'none', padding: 0 }}>
              <li>เกี่ยวกับ เช่ารถกับแคทตี้</li>
              <li>ร่วมงานกับเรา</li>
              <li><Link to="/terms">ข้อกำหนดและเงื่อนไข</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#0b74a6' }}>ช่องทางติดต่อ</h4>
            <div style={{ color: '#334155' }}>โทร 02-038-5222 • Line: @kattycar • Email: contact@kattycar.com</div>
          </div>
          <div>
            <h4 style={{ color: '#0b74a6' }}>ดาวน์โหลดแอพ</h4>
            <p style={{ color: '#334155', fontSize: 14, marginBottom: 8 }}>เช่ารถสะดวกยิ่งขึ้นด้วยมือถือ</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#000', borderRadius: 6, color: '#fff', textDecoration: 'none', fontWeight: 600 }}>
                <img src="/images/apple-logo.png" alt="App Store" style={{ width: 20, height: 20 }} /> App Store
              </a>
              <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#34A853', borderRadius: 6, color: '#fff', textDecoration: 'none', fontWeight: 600 }}>
                <img src="/images/google-play-logo.png" alt="Google Play" style={{ width: 20, height: 20 }} /> Google Play
              </a>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', color: '#64748b', marginTop: 16, fontSize: 13 }}>
          © {new Date().getFullYear()} เช่ารถกับแคทตี้ — All rights reserved
          <div style={{ marginTop: 6, fontSize: 12 }}>
            <Link to="/privacy" style={{ color: '#64748b', marginRight: 12, textDecoration: 'underline dotted' }}>นโยบายความเป็นส่วนตัว</Link>
            <Link to="/terms" style={{ color: '#64748b', textDecoration: 'underline dotted' }}>ข้อกำหนดการให้บริการ</Link>
          </div>
        </div>
      </footer>


      
      
    </div>
  );
};

export default Home;
