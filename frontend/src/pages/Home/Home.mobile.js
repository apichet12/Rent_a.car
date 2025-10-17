import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileNav from "../../components/mobile/MobileNav";
import LoadingOverlay from "../../components/LoadingOverlay";
import carsData from "../../data/cars";
import "./Home.mobile.css";

/* ---------------- CERTIFICATE CARD ---------------- */
function CertificateCard({ cert }) {
  const cardRef = useRef();
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const handleMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.transform = `rotateY(${(x / rect.width - 0.5) * 8}deg) rotateX(${(0.5 - y / rect.height) * 6}deg)`;
    };
    const reset = () => (card.style.transform = "rotateY(0deg) rotateX(0deg)");
    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", reset);
    return () => {
      card.removeEventListener("mousemove", handleMove);
      card.removeEventListener("mouseleave", reset);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      style={{
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 8px 24px rgba(2,6,23,0.06)",
        width: 240,
        height: 300,
        overflow: "hidden",
        transition: "transform 0.18s ease",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      <img
        src={cert.img}
        alt={cert.name}
        style={{ width: "100%", height: 140, objectFit: "cover" }}
      />
      <div style={{ padding: 12, textAlign: "center", flex: 1 }}>
        <div style={{ color: "#4f46e5", fontWeight: 700, marginBottom: 6 }}>{cert.name}</div>
        <div style={{ color: "#64748b", fontSize: 13 }}>{cert.desc}</div>
      </div>
    </div>
  );
}

/* ---------------- AUTOPLAY VIDEO ---------------- */
const AutoPlayVideo = ({ src, poster, className }) => {
  const videoRef = useRef();
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);
  return <video ref={videoRef} src={src} poster={poster} muted loop playsInline className={className} />;
};

/* ---------------- FEATURED CARS ---------------- */
const FeaturedCars = ({ searchQuery, layout = "grid" }) => {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cars_availability");
      if (stored) {
        const map = JSON.parse(stored);
        setCars(
          carsData.slice(0, 6).map((c) => ({ ...c, available: map[c.id] !== undefined ? map[c.id] : true }))
        );
      } else {
        const initial = carsData.slice(0, 6).map((c) => ({ ...c, available: Math.random() > 0.3 }));
        setCars(initial);
        const map = {};
        initial.forEach((x) => (map[x.id] = x.available));
        localStorage.setItem("cars_availability", JSON.stringify(map));
      }
    } catch {
      setCars(carsData.slice(0, 6).map((c) => ({ ...c, available: Math.random() > 0.3 })));
    }
  }, []);

  const goToBooking = (car) => navigate("/booking", { state: { car } });
  const filteredCars = cars.filter((car) => car.name.toLowerCase().includes(searchQuery?.toLowerCase() || ""));

  return (
    <div
      style={{
        display: layout === "carousel" ? "flex" : "grid",
        gridTemplateColumns: layout === "grid" ? "repeat(auto-fill,minmax(240px,1fr))" : undefined,
        gap: 16,
        overflowX: layout === "carousel" ? "auto" : undefined,
        paddingBottom: 8,
      }}
    >
      {filteredCars.map((car) => (
        <div key={car.id} style={{
          background: "#fff",
          padding: 12,
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(2,6,23,0.06)",
          display: "flex",
          flexDirection: "column",
          transition: "transform .18s ease",
          minWidth: layout === "carousel" ? 240 : undefined,
          flexShrink: 0,
        }}>
          <img src={car.image} alt={car.name} loading="lazy" style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8 }} />
          <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 700, color: "#111827" }}>{car.name}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>ปี {car.year} • {car.seats} ที่นั่ง</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 800, color: "#06b6d4" }}>{car.price.toLocaleString()} ฿/วัน</div>
              <div style={{ fontSize: 12, marginTop: 6 }}>
                {car.available ? <span style={{ color: "#059669", fontWeight: 700 }}>ว่าง</span> : <span style={{ color: "#ef4444", fontWeight: 700 }}>ไม่ว่าง</span>}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <button disabled={!car.available} onClick={() => goToBooking(car)} style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              border: "none",
              background: car.available ? "linear-gradient(90deg,#06b6d4,#4f46e5)" : "#e5e7eb",
              color: "#fff",
              fontWeight: 700,
              cursor: car.available ? "pointer" : "not-allowed",
            }}>จอง</button>
            <button onClick={() => navigate(`/cars/${car.id}`)} style={{
              padding: 10,
              borderRadius: 8,
              background: "#fff",
              border: "1px solid #e6e9f2",
              color: "#374151",
            }}>รายละเอียด</button>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ---------------- HOME MOBILE PAGE ---------------- */
const HomeMobile = () => {
  const [search, setSearch] = useState("");
  const [typeText, setTypeText] = useState("");
  const [loading] = useState(false);
  const typePhrasesRef = useRef([
    "ไอเดียโลโก้ร้านอาหารที่ดีที่สุด...",
    "เปรียบเทียบราคาการเช่า SUV 7 ที่นั่ง...",
    "ติวคณิตศาสตร์สำหรับนักเรียนมัธยม...",
    "ค้นหาบริการเช่ามอเตอร์ไซค์...",
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    let phraseIndex = 0, charIndex = 0, forward = true, timeoutId;
    const tick = () => {
      const current = typePhrasesRef.current[phraseIndex];
      if (forward) {
        charIndex++;
        setTypeText(current.slice(0, charIndex));
        if (charIndex === current.length) { forward = false; timeoutId = setTimeout(tick, 900); return; }
      } else {
        charIndex--;
        setTypeText(current.slice(0, charIndex));
        if (charIndex === 0) { forward = true; phraseIndex = (phraseIndex + 1) % typePhrasesRef.current.length; }
      }
      timeoutId = setTimeout(tick, forward ? 80 : 40);
    };
    timeoutId = setTimeout(tick, 400);
    return () => clearTimeout(timeoutId);
  }, []);

  const heroImages = [
    "https://images.unsplash.com/photo-1511918984145-48de785d4c4e",
    "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d",
    "https://images.unsplash.com/photo-1461632830798-3adb3034e4c8",
  ];

  const certificates = [
    { name: "ISO 9001", img: "/images/iso9001.png", desc: "มาตรฐานคุณภาพสากล" },
    { name: "Thailand Trusted Quality", img: "/images/633db849-5816-477f-8c09-b0bac0df786f.jpg", desc: "รับรองโดยหน่วยงานที่เกี่ยวข้อง" },
    { name: "Best Car Rental 2024", img: "/images/2ee5f421-8d2b.jpg", desc: "รางวัลยอดเยี่ยมแห่งปี" },
  ];

  return (
    <div className="home-mobile">
      <LoadingOverlay visible={loading} />

      {/* Search Pill Sticky */}
      <div className="hero-search-pill">
        <input
          type="text"
          placeholder={typeText || "ออกแบบโลโก้ร้านอาหารสไตล์..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => navigate(`/cars?q=${encodeURIComponent(search)}`)}>🔍</button>
      </div>

      {/* HERO */}
      <section className="hero-outer" style={{ padding: "0 12px", marginTop: 8 }}>
        <h1 className="hero-title">Klick Drive — เช่ารถ ง่ายและปลอดภัย</h1>
        <p className="hero-subtitle">รถใหม่ สะอาด พร้อมบริการครบวงจร — จองง่าย สะดวกทั้งมือถือ</p>

        <AutoPlayVideo src="https://www.w3schools.com/html/mov_bbb.mp4" poster={heroImages[0]} className="hero-video" />
      </section>

      {/* Featured Cars */}
      <section style={{ marginTop: 22, padding: "0 12px" }}>
        <h2 style={{ fontSize: 22, color: "#111827" }}>รถแนะนำ / Featured Cars</h2>
        <FeaturedCars searchQuery={search} layout="carousel" />
      </section>

      {/* Certificates */}
      <section style={{ marginTop: 22, padding: "0 12px" }}>
        <h3 style={{ color: "#0b74a6" }}>ใบรับรองและรางวัล</h3>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 12 }}>
          {certificates.map((c, i) => (<CertificateCard key={i} cert={c} />))}
        </div>
      </section>

      {/* Mobile Nav */}
      <MobileNav />
    </div>
  );
};

export default HomeMobile;
