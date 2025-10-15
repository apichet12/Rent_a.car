import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { PlusCircle, Trash2 } from 'lucide-react';

const AdminCars = () => {
  const { user } = useContext(AuthContext);
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', seats: 4, fuel: 'เบนซิน', desc: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // --- Fetch cars ---
  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cars');
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setCars(data || []);
    } catch (e) {
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCars(); }, []);

  // --- Add a new car ---
  const handleAdd = async () => {
    setError('');
    setSuccess('');
    if (!user || user.role !== 'admin') return setError('ต้องเป็นผู้ดูแลระบบเพื่อเพิ่มรถ');
    if (!form.name || !form.price) return setError('กรุณากรอกชื่อและราคา');

    try {
      const res = await fetch('/api/admin/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminUsername: user.username,
          car: { ...form, price: Number(form.price) },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setForm({ name: '', price: '', seats: 4, fuel: 'เบนซิน', desc: '' });
        setSuccess('✅ เพิ่มรถสำเร็จ!');
        fetchCars();
      } else setError(data.message || 'ไม่สามารถเพิ่มรถได้');
    } catch (e) {
      setError(`เกิดข้อผิดพลาด: ${e.message}`);
    }
  };

  // --- Delete car ---
  const handleDelete = async (id) => {
    if (!user || user.role !== 'admin') return;
    if (!window.confirm('ต้องการลบรถคันนี้ใช่หรือไม่?')) return;
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/admin/cars/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminUsername: user.username }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('🚗 ลบรถสำเร็จ!');
        fetchCars();
      } else setError(data.message || 'ไม่สามารถลบได้');
    } catch (e) {
      setError(`เกิดข้อผิดพลาด: ${e.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">🚗 จัดการรถ (Admin)</h2>
        <p className="text-slate-500 text-sm">เพิ่ม / ลบรถ ดูรายการรถทั้งหมด</p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
        {error && <div className="text-red-500 font-medium">{error}</div>}
        {success && <div className="text-green-600 font-medium">{success}</div>}

        <input
          type="text"
          placeholder="ชื่อรุ่นรถ *"
          className="w-full border border-slate-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-sky-400 outline-none"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="number"
          min="0"
          placeholder="ราคา (บาท/วัน) *"
          className="w-full border border-slate-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-sky-400 outline-none"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="คำอธิบายเพิ่มเติม"
          className="w-full border border-slate-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-sky-400 outline-none"
          value={form.desc}
          onChange={(e) => setForm({ ...form, desc: e.target.value })}
        />

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg py-2.5 transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            เพิ่มรถ
          </button>
          <button
            onClick={() => setForm({ name: '', price: '', seats: 4, fuel: 'เบนซิน', desc: '' })}
            className="flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-100 rounded-lg py-2.5 transition-all"
          >
            รีเซ็ต
          </button>
        </div>
      </div>

      {/* Car List */}
      <div className="mt-8">
        {loading ? (
          <p className="text-center text-slate-500 text-lg">⏳ กำลังโหลด...</p>
        ) : cars.length ? (
          <div className="space-y-4">
            {cars.map((c) => (
              <div
                key={c.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-800">{c.name}</h3>
                  <p className="text-slate-500 text-sm">{c.desc || '-'}</p>
                  <p className="text-sky-600 font-semibold mt-1">{c.price} ฿/วัน</p>
                </div>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="flex items-center gap-1 mt-3 sm:mt-0 border border-red-500 text-red-500 px-3 py-2 rounded-lg hover:bg-red-50 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  ลบ
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500 text-lg">ยังไม่มีรถในระบบ</p>
        )}
      </div>
    </div>
  );
};

export default AdminCars;
