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

  // Fetch cars from API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch('/data/cars.json'); // fetch จาก public folder
        const data = await res.json();

        // โหลดสถานะ availability จาก localStorage
        const stored = JSON.parse(localStorage.getItem('cars_availability') || '{}');
        const carsWithAvailability = data.map(c => ({
          ...c,
          available: stored[c.id] ?? true
        }));
        setCars(carsWithAvailability);

        // สร้าง map availability ใน localStorage
        const map = {};
        carsWithAvailability.forEach(c => (map[c.id] = c.available));
        localStorage.setItem('cars_availability', JSON.stringify(map));

        // โหลด favorites
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
    // ... (Filter logic remains the same)
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

  const clearFilters = () => {
    setQ('');
    setMinPrice('');
    setMaxPrice('');
    setSeatsFilter('');
    setFuelFilter('');
    setOnlyAvailable(false);
    setSortBy('recommended');
  };

  return (
    <div className="page-container">
      <h2 className="main-title">🚗 เลือกรถ / Select Car</h2>

      {/************************************** Filters *************************************/}
      <div className="filters-bar">
        {/* Search and Price Filters */}
        <div className="search-group">
          <input className="input-field" placeholder="🔎 ค้นหาชื่อหรือคำอธิบาย..." value={q} onChange={e=>setQ(e.target.value)} />
          <input className="input-field price-input" type="number" placeholder="💰 ราคาต่ำสุด" value={minPrice} onChange={e=>setMinPrice(e.target.value)} />
          <input className="input-field price-input" type="number" placeholder="💰 ราคาสูงสุด" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} />
        </div>

        {/* Dropdown Filters and Sort */}
        <div className="dropdowns-group">
          <select className="input-field" value={seatsFilter} onChange={e=>setSeatsFilter(e.target.value)}>
            <option value="">👥 ที่นั่งทั้งหมด</option>
            <option value="2">2 ที่นั่ง</option>
            <option value="4">4 ที่นั่ง</option>
            <option value="5">5 ที่นั่ง</option>
            <option value="7">7 ที่นั่ง</option>
            <option value="12">12 ที่นั่ง</option>
          </select>
          <select className="input-field" value={fuelFilter} onChange={e=>setFuelFilter(e.target.value)}>
            <option value="">⛽ เชื้อเพลิงทั้งหมด</option>
            <option value="เบนซิน">เบนซิน</option>
            <option value="ดีเซล">ดีเซล</option>
            <option value="ไฟฟ้า">ไฟฟ้า</option>
          </select>
          <select className="input-field sort-select" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
            <option value="recommended">⭐ แนะนำ</option>
            <option value="price_asc">⬆️ ราคาต่ำ→สูง</option>
            <option value="price_desc">⬇️ ราคาสูง→ต่ำ</option>
            <option value="name">🔠 ชื่อ (A-Z)</option>
          </select>
        </div>

        {/* Availability and Clear Button */}
        <div className="actions-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={onlyAvailable} onChange={e=>setOnlyAvailable(e.target.checked)} /> 
            <span>✅ เฉพาะที่ว่าง</span>
          </label>
          <button className="clear-button" onClick={clearFilters}>
            🗑️ เคลียร์
          </button>
        </div>
      </div>

      <hr className="divider"/>

      {/************************************** Car Cards *************************************/}
      <div className="car-grid">
        {filteredCars.map(car => (
          <div key={car.id} className="car-card">
            <div className="car-image">
              <img src={car.image} alt={car.name} onClick={()=>setSelected(car)} />
              <span className={car.available ? 'badge-available' : 'badge-unavailable'}>
                {car.available ? 'ว่าง' : 'ไม่ว่าง'}
              </span>
            </div>

            <div className="car-info-content">
              <h3 className="car-name" onClick={()=>setSelected(car)}>{car.name}</h3>
              <p className="car-description">{car.desc}</p>
              
              <div className="car-specs">
                <span>📅 ปี {car.year}</span>
                <span>👥 {car.seats} ที่นั่ง</span>
                <span>⛽ {car.fuel}</span>
              </div>

              {car.features?.length > 0 && (
                <ul className="car-features-list">
                  {car.features.slice(0, 3).map((f,i)=><li key={i}>✓ {f}</li>)}
                  {car.features.length > 3 && <li>...และอื่นๆ</li>}
                </ul>
              )}

              <p className="car-price">
                <span className="price-label">ราคา/วัน:</span> 
                <span className="price-value">{car.price.toLocaleString()}</span> บาท
              </p>
              
              <div className="car-actions">
                <button className="book-button" disabled={!car.available} onClick={()=>navigate('/booking',{state:{car}})}>
                  {car.available ? 'จอง / Book' : 'ไม่ว่าง 😔'}
                </button>
                <button className="favorite-button" style={{color: favorites[car.id]? 'red':'#a0aec0'}} onClick={()=>toggleFavorite(car.id)}>
                  ❤️
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredCars.length === 0 && (
          <p className="no-results">❌ ไม่พบรถตามเงื่อนไขที่เลือก</p>
        )}
      </div>

      {/************************************** Modal *************************************/}
      {selected && (
        <div className="car-modal-backdrop" onClick={()=>setSelected(null)}>
          <div className="car-modal" onClick={e=>e.stopPropagation()}>
            <img src={selected.image} alt={selected.name} />
            <div className="modal-content-details">
              <h2>{selected.name}</h2>
              <p className="car-description">{selected.desc}</p>
              <div className="car-specs">
                <span>📅 ปี {selected.year}</span>
                <span>👥 {selected.seats} ที่นั่ง</span>
                <span>⛽ {selected.fuel}</span>
              </div>
              <ul className="car-features-list">
                {selected.features?.map((f,i)=><li key={i}>✓ {f}</li>)}
              </ul>
              <p className="car-price">
                <span className="price-label">ราคา/วัน:</span> 
                <span className="price-value">{selected.price.toLocaleString()}</span> บาท
              </p>
              <button className="book-button large-button" onClick={()=>{navigate('/booking',{state:{car:selected}}); setSelected(null)}}>
                จองรถคันนี้ / Book Now
              </button>
            </div>
            <button className="close-modal" onClick={()=>setSelected(null)}>✕</button>
          </div>
        </div>
      )}

      {/************************************** New CSS *************************************/}
      <style>{`
        /* General Page Layout */
        .page-container {
          padding: 2rem;
          max-width: 1280px;
          margin: 0 auto;
          font-family: 'Sukhumvit Set', 'Kanit', sans-serif; /* Use a modern Thai font stack */
          background-color: #f7f9fc;
        }

        .main-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 800;
          color: #1a202c;
          margin-bottom: 2rem;
        }
        
        .divider {
          border: 0;
          height: 1px;
          background: #e2e8f0;
          margin: 20px 0;
        }

        /* Filters Bar */
        .filters-bar {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 1rem;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .search-group, .dropdowns-group, .actions-group {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .input-field {
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          background-color: #fefefe;
          font-size: 1rem;
          flex-grow: 1;
          min-width: 150px;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .input-field:focus {
          border-color: #4c51bf;
          box-shadow: 0 0 0 2px rgba(76, 81, 191, 0.2);
          outline: none;
        }
        
        .price-input { max-width: 120px; }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          background-color: #fefefe;
          cursor: pointer;
          font-weight: 600;
        }
        .checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #4c51bf;
        }

        .clear-button {
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          background-color: #e2e8f0;
          color: #2d3748;
          transition: background-color 0.3s;
          min-width: 100px;
        }
        .clear-button:hover {
          background-color: #cbd5e1;
        }

        /* Car Grid and Cards */
        .car-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
          margin-top: 2rem;
        }

        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem;
          font-size: 1.25rem;
          color: #718096;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .car-card {
          border-radius: 16px;
          overflow: hidden;
          background: #ffffff;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .car-card:hover { 
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }

        .car-image {
          position: relative;
          width: 100%;
        }
        .car-image img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          cursor: pointer;
          border-radius: 16px 16px 0 0;
        }

        .badge-available, .badge-unavailable {
          position: absolute;
          top: 15px;
          right: 15px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: bold;
          color: #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .badge-available { background-color: #38a169; } /* Green */
        .badge-unavailable { background-color: #e53e3e; } /* Red */
        
        .car-info-content {
          padding: 15px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .car-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
          margin-top: 0;
          margin-bottom: 5px;
          cursor: pointer;
        }

        .car-description {
          font-size: 0.9rem;
          color: #718096;
          margin-bottom: 10px;
        }

        .car-specs {
          display: flex;
          gap: 15px;
          font-size: 0.85rem;
          color: #4a5568;
          margin-bottom: 10px;
          padding-bottom: 10px;
          border-bottom: 1px dashed #edf2f7;
        }
        .car-specs span { font-weight: 500; }

        .car-features-list {
          list-style: none;
          padding: 0;
          margin-bottom: 10px;
          font-size: 0.9rem;
          color: #4a5568;
          flex-grow: 1;
        }
        .car-features-list li {
          margin-bottom: 4px;
          line-height: 1.4;
        }

        .car-price {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2d3748;
          margin-top: 10px;
          margin-bottom: 15px;
          text-align: right;
        }
        .price-label { font-size: 0.9rem; color: #718096; font-weight: 500;}
        .price-value { font-size: 1.5rem; font-weight: 800; color: #4c51bf; }

        .car-actions {
          display: flex;
          gap: 8px;
          width: 100%;
          margin-top: auto;
        }
        
        .book-button {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 10px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s, opacity 0.3s;
          background-color: #4c51bf; /* Indigo */
          color: #fff;
          font-size: 1rem;
        }
        .book-button:hover:not(:disabled) {
          background-color: #5a62d8;
        }
        .book-button:disabled {
          background: #e2e8f0;
          color: #a0aec0;
          cursor: not-allowed;
        }

        .favorite-button {
          width: 50px;
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #fff;
          cursor: pointer;
          font-size: 1.2rem;
          line-height: 1;
          transition: border-color 0.3s;
        }
        .favorite-button:hover {
          border-color: #a0aec0;
        }

        /* Modal Styles */
        .car-modal-backdrop { 
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; 
          background: rgba(0,0,0,0.5); display: flex; align-items: center; 
          justify-content: center; z-index: 1000;
        }
        .car-modal { 
          background: #fff; border-radius: 16px; min-width: 320px; 
          max-width: 600px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); 
          position: relative; display: flex; flex-direction: column;
          overflow: hidden; animation: fadeIn 0.3s;
        }
        .car-modal img { 
          width: 100%; height: 300px; object-fit: cover; 
        }
        .modal-content-details {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .car-modal h2 { 
          font-size: 2rem; font-weight: 700; color: #2d3748; margin-top: 0;
        }
        .car-modal .car-price { text-align: left; }

        .car-modal .large-button {
          padding: 15px;
          font-size: 1.1rem;
          margin-top: 10px;
        }

        .car-modal .close-modal { 
          position: absolute; top: 15px; right: 15px; 
          padding: 8px 15px; background: rgba(255,255,255,0.8); 
          border: none; border-radius: 50%; cursor: pointer; 
          font-weight: bold; font-size: 1.2rem; transition: background 0.2s;
        }
        .car-modal .close-modal:hover { background: #fff; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .search-group, .dropdowns-group {
            flex-direction: column;
            gap: 10px;
          }
          .input-field, .price-input {
            width: 100%;
            max-width: none;
          }
          .dropdowns-group, .actions-group {
            border-top: 1px dashed #edf2f7;
            padding-top: 10px;
          }
        }

        @media (max-width: 768px) {
          .page-container { padding: 1rem; }
          .main-title { font-size: 2rem; margin-bottom: 1.5rem; }
          .car-grid { grid-template-columns: 1fr; gap: 15px; }
          .filters-bar { padding: 0.75rem; }
          .car-card img { height: 220px; }
          .car-modal { max-width: 95vw; }
          .car-modal img { height: 250px; }
          .modal-content-details { padding: 1.5rem; }
        }
      `}</style>
    </div>
  );
};

export default CarList;