// CarList.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './CarList.css';

const CarList = () => {
  const [selected, setSelected] = useState(null);
  const [cars, setCars] = useState([]);
  const [favorites, setFavorites] = useState({});
  const navigate = useNavigate();

  const [q, setQ] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [seatsFilter, setSeatsFilter] = useState('');
  const [fuelFilter, setFuelFilter] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  const [vehicleType, setVehicleType] = useState('all'); // all | car | bike | special

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch('/data/cars.json');
        const data = await res.json();

        const stored = JSON.parse(localStorage.getItem('cars_availability') || '{}');
        const carsWithAvailability = data.map(c => ({
          ...c,
          available: stored[c.id] === undefined ? true : stored[c.id]
        }));
        setCars(carsWithAvailability);

        const map = {};
        carsWithAvailability.forEach(c => (map[c.id] = c.available));
        localStorage.setItem('cars_availability', JSON.stringify(map));

        const storedFav = JSON.parse(localStorage.getItem('cars_favorites') || '{}');
        setFavorites(storedFav);
      } catch (err) {
        console.error('Failed to fetch cars', err);
      }
    };
    fetchCars();
  }, []);

  const toggleFavorite = id => {
    setFavorites(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem('cars_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const filteredCars = useMemo(() => {
    let list = cars.slice();
    if (q) list = list.filter(c => (c.name || '').toLowerCase().includes(q.toLowerCase()) || (c.desc || '').toLowerCase().includes(q.toLowerCase()));
    if (vehicleType && vehicleType !== 'all') list = list.filter(c => (c.type || 'car') === vehicleType);
    if (minPrice) list = list.filter(c => c.price >= Number(minPrice));
    if (maxPrice) list = list.filter(c => c.price <= Number(maxPrice));
    if (seatsFilter) list = list.filter(c => String(c.seats) === String(seatsFilter));
    if (fuelFilter) list = list.filter(c => c.fuel === fuelFilter);
    if (onlyAvailable) list = list.filter(c => c.available);
    if (sortBy === 'price_asc') list.sort((a,b)=>a.price-b.price);
    if (sortBy === 'price_desc') list.sort((a,b)=>b.price-a.price);
    if (sortBy === 'name') list.sort((a,b)=>a.name.localeCompare(b.name));
    return list;
  }, [cars, q, minPrice, maxPrice, seatsFilter, fuelFilter, onlyAvailable, sortBy, vehicleType]);

  return (
    <div className="carlist-page">
      <div className="carlist-hero">
        <h2 style={{fontSize: '2rem', fontWeight:700}}>เลือกรถ / Select Car</h2>
      </div>

      <div className="carlist-wrap">
        <aside className="carlist-aside">
          <div className="panel">
            <h3>ตัวช่วยค้นหา</h3>
            <div className="filters">
              <input className="nice-input" placeholder="ค้นหาชื่อหรือคำอธิบาย" value={q} onChange={e=>setQ(e.target.value)} />
              <div style={{display:'flex', gap:8}}>
                <input className="nice-input" placeholder="ราคาต่ำสุด" value={minPrice} onChange={e=>setMinPrice(e.target.value)} />
                <input className="nice-input" placeholder="ราคาสูงสุด" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} />
              </div>
              <select value={seatsFilter} onChange={e=>setSeatsFilter(e.target.value)}>
                <option value="">ทุกจำนวนที่นั่ง</option>
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="7">7</option>
                <option value="12">12</option>
              </select>
              <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                <button type="button" onClick={() => setVehicleType('all')} className={"btn-outline" + (vehicleType==='all' ? ' active' : '')}>ทั้งหมด</button>
                <button type="button" onClick={() => setVehicleType('car')} className={"btn-outline" + (vehicleType==='car' ? ' active' : '')}>รถยนต์</button>
                <button type="button" onClick={() => setVehicleType('bike')} className={"btn-outline" + (vehicleType==='bike' ? ' active' : '')}>มอเตอร์ไชค์</button>
                <button type="button" onClick={() => setVehicleType('special')} className={"btn-outline" + (vehicleType==='special' ? ' active' : '')}>เรียนพิเศษ</button>
              </div>
              <select value={fuelFilter} onChange={e=>setFuelFilter(e.target.value)}>
                <option value="">ทุกเชื้อเพลิง</option>
                <option value="เบนซิน">เบนซิน</option>
                <option value="ดีเซล">ดีเซล</option>
                <option value="ไฟฟ้า">ไฟฟ้า</option>
              </select>
              <label style={{display:'flex', alignItems:'center', gap:8}}><input type="checkbox" checked={onlyAvailable} onChange={e=>setOnlyAvailable(e.target.checked)} /> เฉพาะที่ว่าง</label>
              <div style={{display:'flex', gap:8}}>
                <button onClick={()=>{setQ(''); setMinPrice(''); setMaxPrice(''); setSeatsFilter(''); setFuelFilter(''); setOnlyAvailable(false); setSortBy('recommended');}} className="btn-outline">ล้างตัวกรอง</button>
              </div>
            </div>
          </div>
        </aside>

        <main className="carlist-main">
          <div className="carlist-head">
            <div>
              <h3 style={{margin:0, fontSize:20}}>ผลการค้นหา</h3>
              <div className="car-count">พบรถว่าง {filteredCars.length} คัน</div>
            </div>
            <div>
              <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{padding:8, borderRadius:8}}>
                <option value="recommended">เรียงผลตาม: แนะนำ</option>
                <option value="price_asc">ราคาต่ำ→สูง</option>
                <option value="price_desc">ราคาสูง→ต่ำ</option>
                <option value="name">ชื่อ</option>
              </select>
            </div>
          </div>

          <div className="car-grid">
            {filteredCars.map(car => (
              <div key={car.id} className="car-card">
                <div className="thumb">
                  <img src={car.image} alt={car.name} onClick={()=>setSelected(car)} />
                  <span className={car.available ? 'badge-available' : 'badge-unavailable'}>
                    {car.available ? 'ว่าง' : 'ไม่ว่าง'}
                  </span>
                </div>
                <div className="body">
                  <div className="meta">
                    <div>
                      <h4>{car.name}</h4>
                      <div className="desc">{car.desc}</div>
                      <div className="specs">ปี {car.year} • {car.seats} ที่นั่ง • {car.fuel}</div>
                    </div>
                    <div className="price">
                      <div>{car.price.toLocaleString()} ฿</div>
                      <div style={{color:'#6b7280', fontSize:12}}>โดยประมาณ</div>
                    </div>
                  </div>

                  <div className="actions">
                    <button disabled={!car.available} onClick={()=>navigate('/booking',{state:{car}})} className="btn-primary">รายละเอียดรถเช่า</button>
                    <button onClick={()=>toggleFavorite(car.id)} className={"fav-btn" + (favorites[car.id] ? ' active' : '')}>❤</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {selected && (
        <div className="car-modal-backdrop" onClick={()=>setSelected(null)}>
          <div className="car-modal" onClick={e=>e.stopPropagation()}>
            <img src={selected.image} alt={selected.name} />
            <h2>{selected.name}</h2>
            <p>{selected.desc}</p>
            <div>ปี {selected.year} | {selected.seats} ที่นั่ง | {selected.fuel}</div>
            <ul>{selected.features?.map((f,i)=><li key={i}>• {f}</li>)}</ul>
            <p>ราคา/วัน: {selected.price.toLocaleString()} บาท</p>
            <div style={{display:'flex', gap:8, marginTop:12}}>
              <button onClick={()=>{navigate('/booking',{state:{car:selected}}); setSelected(null)}} className="btn-primary">จองรถ</button>
              <button className="close-modal" onClick={()=>setSelected(null)}>✕</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .car-grid {display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:20px;}
        .car-card {border-radius:12px; overflow:hidden; background:#fff; box-shadow:0 8px 20px rgba(0,0,0,0.06); transition:transform 0.18s;}
        .car-card:hover { transform:translateY(-6px); }
        .car-card img { display:block; width:100%; }
        .badge-available { padding:6px 10px; border-radius:8px; font-weight:700; color:#fff; background:linear-gradient(90deg,#22c55e,#16a34a); }
        .badge-unavailable { padding:6px 10px; border-radius:8px; font-weight:700; color:#fff; background:linear-gradient(90deg,#ef4444,#b91c1c); }
        .car-modal-backdrop { position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.35); display:flex; align-items:center; justify-content:center; z-index:99; }
        .car-modal { background:#fff; border-radius:12px; padding:1.25rem; min-width:300px; max-width:640px; box-shadow:0 8px 30px rgba(0,0,0,0.25); }
        .car-modal img { width:100%; height:200px; object-fit:cover; border-radius:8px; margin-bottom:12px; }
        .close-modal { border:none; background:#eee; padding:8px 10px; border-radius:8px; cursor:pointer; }
        @media (max-width: 768px) { .car-grid { grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
};

export default CarList;
