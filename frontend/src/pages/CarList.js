import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [selected, setSelected] = useState(null);
  const [favorites, setFavorites] = useState({});
  const navigate = useNavigate();

  // Filters
  const [q, setQ] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [seatsFilter, setSeatsFilter] = useState('');
  const [fuelFilter, setFuelFilter] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');

  // Fetch cars from backend
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch('/api/cars');
        const data = await res.json();
        setCars(data);

        // Load favorites from localStorage
        const storedFav = JSON.parse(localStorage.getItem('cars_favorites') || '{}');
        setFavorites(storedFav);
      } catch (err) {
        console.error('Cannot fetch cars:', err);
      }
    };
    fetchCars();
  }, []);

  // Toggle favorite
  const toggleFavorite = (id) => {
    const updated = { ...favorites, [id]: !favorites[id] };
    setFavorites(updated);
    localStorage.setItem('cars_favorites', JSON.stringify(updated));
  };

  // Filter and sort cars
  const filteredCars = useMemo(() => {
    let list = [...cars];
    if (q) list = list.filter(c => c.name.toLowerCase().includes(q.toLowerCase()) || (c.desc?.toLowerCase()?.includes(q.toLowerCase())));
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
      <h2 style={{textAlign:'center'}}>เลือกรถ / Select Car</h2>

      {/* Filters */}
      <div className="filters" style={{display:'flex', flexWrap:'wrap', gap:12, marginBottom:20}}>
        <input placeholder="ค้นหาชื่อหรือคำอธิบาย" value={q} onChange={e=>setQ(e.target.value)} />
        <input placeholder="ราคาต่ำสุด" value={minPrice} onChange={e=>setMinPrice(e.target.value)} />
        <input placeholder="ราคาสูงสุด" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} />
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

      {/* Car Grid */}
      <div className="car-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'20px'}}>
        {filteredCars.map(car => (
          <div key={car.id} className="car-card" style={{borderRadius:'12px', boxShadow:'0 4px 12px rgba(0,0,0,0.1)', background:'#fff', display:'flex', flexDirection:'column', padding:12}}>
            <img src={car.image} alt={car.name} style={{width:'100%', height:160, objectFit:'cover', borderRadius:8, cursor:'pointer'}} onClick={()=>setSelected(car)} />
            <h3 onClick={()=>setSelected(car)}>{car.name}</h3>
            <div>{car.desc}</div>
            <div>ปี {car.year} | {car.seats} ที่นั่ง | {car.fuel}</div>
            <p>ราคา/วัน: {car.price?.toLocaleString()} บาท</p>
            <div style={{display:'flex', gap:8}}>
              <button disabled={!car.available} onClick={()=>navigate('/booking',{state:{car}})} style={{flex:1}}>{car.available?'จอง / Book':'ไม่ว่าง'}</button>
              <button onClick={()=>toggleFavorite(car.id)} style={{color:favorites[car.id]?'red':'#000'}}>❤</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:99}} onClick={()=>setSelected(null)}>
          <div style={{background:'#fff', padding:20, borderRadius:12, maxWidth:500, width:'90%'}} onClick={e=>e.stopPropagation()}>
            <img src={selected.image} alt={selected.name} style={{width:'100%', height:200, objectFit:'cover', borderRadius:8}} />
            <h2>{selected.name}</h2>
            <p>{selected.desc}</p>
            <div>ปี {selected.year} | {selected.seats} ที่นั่ง | {selected.fuel}</div>
            <p>ราคา/วัน: {selected.price?.toLocaleString()} บาท</p>
            <button onClick={()=>{navigate('/booking',{state:{car:selected}}); setSelected(null);}}>จองรถ</button>
            <button onClick={()=>setSelected(null)} style={{marginLeft:8}}>✕ ปิด</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarList;
