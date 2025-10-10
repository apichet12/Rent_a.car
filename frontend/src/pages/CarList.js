// CarList.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';



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

 useEffect(() => {
  const fetchCars = async () => {
    try {
  const res = await fetch('/api/cars');
  const data = await res.json();

      
      const stored = JSON.parse(localStorage.getItem('cars_availability') || '{}');
      const carsWithAvailability = data.map(c => ({
        ...c,
        available: stored[c.id] ?? true
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
    if (q) list = list.filter(c => c.name.toLowerCase().includes(q.toLowerCase()) || c.desc.toLowerCase().includes(q.toLowerCase()));
    if (minPrice) list = list.filter(c => c.price >= Number(minPrice));
    if (maxPrice) list = list.filter(c => c.price <= Number(maxPrice));
    if (seatsFilter) list = list.filter(c => String(c.seats) === String(seatsFilter));
    if (fuelFilter) list = list.filter(c => c.fuel === fuelFilter);
    if (onlyAvailable) list = list.filter(c => c.available);
    if (sortBy === 'price_asc') list.sort((a,b)=>a.price-b.price);
    if (sortBy === 'price_desc') list.sort((a,b)=>b.price-a.price);
    if (sortBy === 'name') list.sort((a,b)=>a.name.localeCompare(b.name));
    return list;
  }, [cars, q, minPrice, maxPrice, seatsFilter, fuelFilter, onlyAvailable, sortBy]);

  return (
    <div style={{padding:'2rem', maxWidth:'1200px', margin:'0 auto'}}>
      <h2 style={{textAlign:'center', fontSize:'2rem', fontWeight:700}}>เลือกรถ / Select Car</h2>

     
      <div className="filters">
        <input className="nice-input" placeholder="ค้นหาชื่อหรือคำอธิบาย" value={q} onChange={e=>setQ(e.target.value)} />
        <input className="nice-input" placeholder="ราคาต่ำสุด" value={minPrice} onChange={e=>setMinPrice(e.target.value)} />
        <input className="nice-input" placeholder="ราคาสูงสุด" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} />
        <select value={seatsFilter} onChange={e=>setSeatsFilter(e.target.value)}>
          <option value="">ทุกจำนวนที่นั่ง</option>
          <option value="2">2</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="7">7</option>
          <option value="12">12</option>
        </select>
        <select value={fuelFilter} onChange={e=>setFuelFilter(e.target.value)}>
          <option value="">ทุกเชื้อเพลิง</option>
          <option value="เบนซิน">เบนซิน</option>
          <option value="ดีเซล">ดีเซล</option>
          <option value="ไฟฟ้า">ไฟฟ้า</option>
        </select>
        <label><input type="checkbox" checked={onlyAvailable} onChange={e=>setOnlyAvailable(e.target.checked)} /> เฉพาะที่ว่าง</label>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)}>
          <option value="recommended">แนะนำ</option>
          <option value="price_asc">ราคาต่ำ→สูง</option>
          <option value="price_desc">ราคาสูง→ต่ำ</option>
          <option value="name">ชื่อ</option>
        </select>
        <button onClick={()=>{setQ(''); setMinPrice(''); setMaxPrice(''); setSeatsFilter(''); setFuelFilter(''); setOnlyAvailable(false); setSortBy('recommended');}}>เคลียร์</button>
      </div>

      
      <div className="car-grid">
        {filteredCars.map(car => (
          <div key={car.id} className="car-card">
            <div className="car-image">
          <img src={car.image} alt={car.name} onClick={()=>setSelected(car)} />

              <span className={car.available ? 'badge-available' : 'badge-unavailable'}>
                {car.available ? 'ว่าง' : 'ไม่ว่าง'}
              </span>
            </div>
            <h3 onClick={()=>setSelected(car)}>{car.name}</h3>
            <span>{car.desc}</span>
            <div>ปี {car.year} | {car.seats} ที่นั่ง | {car.fuel}</div>
            <ul>{car.features?.map((f,i)=><li key={i}>• {f}</li>)}</ul>
            <p>ราคา/วัน: {car.price.toLocaleString()} บาท</p>
            <div className="car-actions">
              <button disabled={!car.available} onClick={()=>navigate('/booking',{state:{car}})}>จอง / Book</button>
              <button style={{color: favorites[car.id]? 'red':'#fff'}} onClick={()=>toggleFavorite(car.id)}>❤</button>
            </div>
          </div>
        ))}
      </div>

      
      {selected && (
        <div className="car-modal-backdrop" onClick={()=>setSelected(null)}>
          <div className="car-modal" onClick={e=>e.stopPropagation()}>
            <img src={selected.image} alt={selected.name} />
            <h2>{selected.name}</h2>
            <span>{selected.desc}</span>
            <div>ปี {selected.year} | {selected.seats} ที่นั่ง | {selected.fuel}</div>
            <ul>{selected.features?.map((f,i)=><li key={i}>• {f}</li>)}</ul>
            <p>ราคา/วัน: {selected.price.toLocaleString()} บาท</p>
            <button onClick={()=>{navigate('/booking',{state:{car:selected}}); setSelected(null)}}>จองรถ</button>
            <button className="close-modal" onClick={()=>setSelected(null)}>✕</button>
          </div>
        </div>
      )}

      <style>{`
        .filters {display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:18px;}
        .filters input, .filters select, .filters button, .filters label {padding:10px; border-radius:8px; border:1px solid #e6eefc; min-width:120px;}
        .car-grid {display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:20px;}
        .car-card {border-radius:16px; overflow:hidden; background:#fff; box-shadow:0 8px 20px rgba(0,0,0,0.08); display:flex; flex-direction:column; align-items:center; height:100%; transition:transform 0.3s;}
        .car-card:hover { transform:translateY(-5px);}
        .car-image {position:relative; width:100%;}
        .car-image img {width:100%; height:160px; object-fit:cover; cursor:pointer; border-radius:12px 12px 0 0;}
        .badge-available {position:absolute; top:10px; left:10px; padding:4px 8px; border-radius:8px; font-size:0.8rem; font-weight:bold; background:linear-gradient(90deg,#22c55e,#16a34a); color:#fff;}
        .badge-unavailable {position:absolute; top:10px; left:10px; padding:4px 8px; border-radius:8px; font-size:0.8rem; font-weight:bold; background:linear-gradient(90deg,#ef4444,#b91c1c); color:#fff;}
        .car-actions { display:flex; gap:8px; width:100%; padding:8px; margin-top:auto; }
        .car-actions button { flex:1; padding:10px; border:none; border-radius:10px; font-weight:bold; cursor:pointer; transition:0.3s; }
        .car-actions button:disabled { background:#ddd; cursor:not-allowed; }
        .car-actions button:not(:disabled):not([style*="color:red"]) { background:linear-gradient(90deg,#06b6d4,#4f46e5); color:#fff; }
        .car-modal-backdrop { position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.35); display:flex; align-items:center; justify-content:center; z-index:99; }
        .car-modal { background:#fff; border-radius:16px; padding:2rem; min-width:320px; max-width:500px; box-shadow:0 8px 30px rgba(0,0,0,0.25); position:relative; }
        .car-modal img { width:100%; height:200px; object-fit:cover; border-radius:12px; margin-bottom:12px; }
        .car-modal .close-modal { position:absolute; top:12px; right:12px; padding:4px 12px; background:#eee; border:none; border-radius:8px; cursor:pointer; font-weight:bold; }
        @media (max-width: 768px) {
          .filters { flex-direction:column; align-items:stretch; gap:8px; }
          .filters input, .filters select, .filters button, .filters label { width:100%; }
          .car-grid { grid-template-columns:1fr; gap:12px; }
          .car-card img { height:200px; }
        }
        @media (max-width: 480px) {
          .car-modal { width:95vw; padding:1rem; border-radius:12px; }
          .car-modal img { height:180px; }
          .car-modal button { font-size:0.9rem; padding:10px; }
        }
      `}</style>
    </div>
  );
};

export default CarList;