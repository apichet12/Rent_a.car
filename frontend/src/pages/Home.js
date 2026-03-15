import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import LoadingOverlay from '../components/LoadingOverlay';
import ChatWidget from '../components/ChatWidget';

const carouselItems = [
  {
    title: 'Toyota SUV 2024',
    subtitle: 'รถ SUV พลังแรง พร้อมบริการสนามบิน',
    price: 'เริ่มต้น 688 บาท/วัน',
    image: `${process.env.PUBLIC_URL}/images/633db849-5816-477f-8c09-b0bac0df786f.jpg`,
  },
  {
    title: 'BMW Series 3',
    subtitle: 'สปอร์ตซีดาน สำหรับการเดินทางหรูหรา',
    price: 'เริ่มต้น 781 บาท/วัน',
    image: `${process.env.PUBLIC_URL}/images/2ee5f421-8d2b.jpg`,
  },
];

const testimonialItems = [
  {
    quote: 'Rent a car with Katty เป็นบริษัทให้เช่ารถที่ผมใช้บริการแล้วไม่มีปัญหาเลยจริงๆ... จนกลายเป็นลูกค้าประจำตลอดไป',
    author: '– M. ลลิตา',
    image: `${process.env.PUBLIC_URL}/images/2ee5f421-8d2b.jpg`,
  },
  {
    quote: 'การจองรถกับที่นี่ทำได้เร็วมาก แถมบริการในสนามบินก็สะดวกสบายสุดๆ',
    author: '– P. กิตติพงศ์',
    image: `${process.env.PUBLIC_URL}/images/honda.jpg`,
  },
];

/* ---------------- HOME PAGE ---------------- */
const Home = () => {
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
  const carouselTimerRef = useRef(null);
  const testimonialTimerRef = useRef(null);

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const goCarousel = useCallback(
    (delta) => {
      setCarouselIndex((prev) => {
        const next = prev + delta;
        if (next < 0) return carouselItems.length - 1;
        if (next >= carouselItems.length) return 0;
        return next;
      });
    },
    []
  );

  const resetCarouselTimer = useCallback(() => {
    if (carouselTimerRef.current) clearInterval(carouselTimerRef.current);
    carouselTimerRef.current = setInterval(() => goCarousel(1), 6500);
  }, [goCarousel]);

  const goTestimonial = useCallback(
    (delta) => {
      setTestimonialIndex((prev) => {
        const next = prev + delta;
        if (next < 0) return testimonialItems.length - 1;
        if (next >= testimonialItems.length) return 0;
        return next;
      });
    },
    []
  );

  const resetTestimonialTimer = useCallback(() => {
    if (testimonialTimerRef.current) clearInterval(testimonialTimerRef.current);
    testimonialTimerRef.current = setInterval(() => goTestimonial(1), 7000);
  }, [goTestimonial]);

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

    resetCarouselTimer();
    resetTestimonialTimer();

    return () => {
      window.removeEventListener('mousedown', onClickOutside);
      if (carouselTimerRef.current) clearInterval(carouselTimerRef.current);
      if (testimonialTimerRef.current) clearInterval(testimonialTimerRef.current);
    };
  }, [resetCarouselTimer, resetTestimonialTimer]);

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

  const locationOptions = [
    { label: 'ประวัติศาสตร์', type: 'header' },
    { label: 'เมืองเมลเบิร์น', icon: '🏬' },
    { label: 'สถานียอดนิยม', type: 'header' },
    { label: 'สนามบินมิวินิก', icon: '✈️' },
    { label: 'สนามบินนานาชาติเชียงใหม่', icon: '✈️' },
    { label: 'สนามบินนานาชาติภูเก็ต', icon: '✈️' },
    { label: 'กรุงเทพฯ', icon: '🏙️' },
  ];


  return (
    <div className="home-root">
      <LoadingOverlay visible={loading} />
      {toastMessage && (
        <div className="toast-notification">
          <div className="toast-content">{toastMessage}</div>
        </div>
      )}

      {/* HERO */}
      <section
        className="home-hero"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/images/2ee5f421-8d2b.jpg)`,
        }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-title">
            <h1>Rent a car with Katty</h1>
            <p>ค้นหา เปรียบเทียบ และจองรถเช่าในไทย ในราคาที่ชัดเจน ได้รถเร็ว</p>
          </div>

          <div className="booking-card">
            <div className="booking-card-header">
              <div className="booking-tabs">
                {['รถยนต์', '', 'การสมัครสมาชิก'].map((tab) => (
                  <button
                    key={tab}
                    className={`booking-tab ${tab === activeTab ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab(tab);
                      resetCarouselTimer();
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <button className="booking-link" onClick={() => navigate('/booking')}>
                ดู/แก้ไขการจองของฉัน
              </button>
            </div>

            <div className="booking-row">
              <div className="booking-field booking-location">
                <label>สถานที่รับ</label>
                <input
                  type="text"
                  value={bookingLocation}
                  onChange={e => handleLocationInput(e.target.value)}
                  onFocus={() => setShowLocationDropdown(true)}
                  placeholder={
                    activeTab === ''
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
                <button className="link-button">+ สถานที่คืนแยกต่างหาก</button>
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
              <button className="btn btn-primary" onClick={handleBookingSearch}>
                ค้นหารถ
              </button>
              <button className="btn btn-outline" onClick={handleClearBooking}>
                ล้าง
              </button>
            </div>

            <div className="booking-note">
              <span>ใช้อัตราค่าบริการของบริษัท</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="promo-banner">
        <div className="promo-inner">
          <div className="promo-title">ราคาพิเศษสำหรับสมาชิก Rent a car with Katty เท่านั้น</div>
          <div className="promo-subtitle">รับส่วนลดสูงสุด 15% เมื่อจองผ่านระบบของเรา</div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="feature">
          <div className="feature-icon">🚗</div>
          <div className="feature-text">
            <div className="feature-title">เลือกได้หลากหลาย</div>
            <div className="feature-desc">ค้นหาได้ทั้งรถยนต์  และรถธุรกิจ</div>
          </div>
        </div>
        <div className="feature">
          <div className="feature-icon">⚡</div>
          <div className="feature-text">
            <div className="feature-title">จองง่าย จัดส่งเร็ว</div>
            <div className="feature-desc">ระบบคิดราคาอัตโนมัติ พร้อมแจ้งเตือนทันที</div>
          </div>
        </div>
        <div className="feature">
          <div className="feature-icon">💼</div>
          <div className="feature-text">
            <div className="feature-title">เหมาะกับธุรกิจ</div>
            <div className="feature-desc">จัดการบัญชีได้ง่าย พร้อมใบกำกับภาษี</div>
          </div>
        </div>
      </section>

      {/* CAR CARDS (PROMO) */}
      <section className="promo-cards">
        <div
          className="promo-card"
          style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/2ee5f421-8d2b.jpg)` }}
        >
          <div className="promo-card-overlay" />
          <div className="promo-card-content">
            <div className="promo-card-tag">Rent a car with Katty</div>
            <div className="promo-card-title">เปลี่ยนการเช่าเป็นรางวัล</div>
            <button className="btn btn-outline" onClick={() => navigate('/cars')}>ดูโปรโมชั่น</button>
          </div>
        </div>
        <div
          className="promo-card"
          style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/toyota.jpg)` }}
        >
          <div className="promo-card-overlay" />
          <div className="promo-card-content">
            <div className="promo-card-tag">15% ค่าสำรอง</div>
            <div className="promo-card-title">เริ่มต้นสบาย ๆ ด้วยราคาเบา ๆ</div>
            <button className="btn btn-outline" onClick={() => navigate('/cars')}>ดูคอลเลกชัน</button>
          </div>
        </div>
        <div
          className="promo-card"
          style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/honda.jpg)` }}
        >
          <div className="promo-card-overlay" />
          <div className="promo-card-content">
            <div className="promo-card-tag">15% ค่าสำรอง</div>
            <div className="promo-card-title">ประหยัดเมื่อจองล่วงหน้า</div>
            <button className="btn btn-outline" onClick={() => navigate('/cars')}>ดูข้อเสนอ</button>
          </div>
        </div>
      </section>

      {/* CAROUSEL */}
      <section className="car-carousel-section">
        <div className="carousel-header">
          <div className="carousel-title">รถยนต์ที่เหมาะสมที่สุดสำหรับการเดินทางครั้งต่อไปของคุณจากสนามบินมิวนิก</div>
          <div className="carousel-nav">
            <button
              className="carousel-arrow"
              onClick={() => {
                goCarousel(-1);
                resetCarouselTimer();
              }}
              aria-label="ก่อนหน้า"
            >
              ‹
            </button>
            <button
              className="carousel-arrow"
              onClick={() => {
                goCarousel(1);
                resetCarouselTimer();
              }}
              aria-label="ถัดไป"
            >
              ›
            </button>
          </div>
        </div>
        <div className="carousel-window">
          <div className="carousel-track" style={{ transform: `translateX(-${carouselIndex * 100}%)` }}>
            {carouselItems.map((item, idx) => (
              <div className="carousel-card" key={idx} style={{ backgroundImage: `url(${item.image})` }}>
                <div className="carousel-card-overlay" />
                <div className="carousel-card-content">
                  <div className="carousel-card-tag">{item.title}</div>
                  <div className="carousel-card-price">{item.price}</div>
                  <div className="carousel-card-subtitle">{item.subtitle}</div>
                  <button className="btn btn-outline" onClick={() => navigate('/cars')}>
                    ดูรถคันนี้
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="carousel-dots">
          {carouselItems.map((_, idx) => (
            <button
              key={idx}
              className={`carousel-dot ${carouselIndex === idx ? 'active' : ''}`}
              onClick={() => {
                setCarouselIndex(idx);
                resetCarouselTimer();
              }}
              aria-label={`แผ่นที่ ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonial-section">
        <div
          className="testimonial-bg"
          style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/2ee5f421-8d2b.jpg)` }}
        >
          <div className="testimonial-overlay" />
          <div className="testimonial-inner">
            <div className="testimonial-content">
              <div className="testimonial-quote">“{testimonialItems[testimonialIndex]?.quote || testimonialItems[0].quote}”</div>
              <div className="testimonial-author">{testimonialItems[testimonialIndex]?.author || testimonialItems[0].author}</div>

              <div className="testimonial-dots">
                {testimonialItems.map((_, idx) => (
                  <button
                    key={idx}
                    className={`testimonial-dot ${testimonialIndex === idx ? 'active' : ''}`}
                    onClick={() => {
                      setTestimonialIndex(idx);
                      resetTestimonialTimer();
                    }}
                    aria-label={`รีวิว ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rent a car with Katty INFO */}
      <section className="katty-info">
        <div className="katty-header">
          <h2>เพิ่มเติมเกี่ยวกับ Rent a car with Katty</h2>
          <p>บริการที่ออกแบบมาเพื่อให้การเช่ารถของคุณสะดวกและคุ้มค่าที่สุด</p>
        </div>
        <div className="katty-cards">
          <div className="katty-card">
            <div className="katty-card-image" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/googleplay.png)` }} />
            <div className="katty-card-body">
              <h3>จองเร็วขึ้น รับรางวัลทันที</h3>
              <p>จองผ่านแอพ Receive แต้มสะสมและข้อเสนอเฉพาะสมาชิก</p>
              <button className="btn btn-primary" onClick={() => navigate('/register')}>สมัครเลย</button>
            </div>
          </div>
          <div className="katty-card">
            <div className="katty-card-image" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/iso9001.png)` }} />
            <div className="katty-card-body">
              <h3>ซัพพอร์ต ตอบแชทความคืบหน้า</h3>
              <p>รับการแจ้งเตือนสถานะการจอง และการสื่อสารแบบเรียลไทม์</p>
              <button className="btn btn-primary" onClick={() => navigate('/contact')}>ติดต่อทีมงาน</button>
            </div>
          </div>
          <div className="katty-card">
            <div className="katty-card-image" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/633db849-5816-477f-8c09-b0bac0df786f.jpg)` }} />
            <div className="katty-card-body">
              <h3>ธุรกิจเจ๋ง</h3>
              <p>จัดการค่าบริการและเอกสารภาษีให้ง่ายสำหรับองค์กรของคุณ</p>
              <button className="btn btn-primary" onClick={() => navigate('/booking')}>ดูรายละเอียด</button>
            </div>
          </div>
        </div>
      </section>

      <ChatWidget />
    </div>
  );
};

export default Home;
