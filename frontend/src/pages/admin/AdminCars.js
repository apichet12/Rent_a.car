import React, { useState, useEffect, useContext } from 'react';
import styles from './AdminCars.module.css';
import { AuthContext } from '../../contexts/AuthContext';

const AdminCars = () => {
    const { user } = useContext(AuthContext);
    const [cars, setCars] = useState([]);
    const [form, setForm] = useState({ name: '', price: '', seats: 4, fuel: 'เบนซิน', desc: '', image: null });
    const [preview, setPreview] = useState(null); // แสดง preview รูป
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchCars = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/cars');
            if (!res.ok) throw new Error(`เกิดข้อผิดพลาด HTTP ${res.status}`);
            const data = await res.json();
            setCars(data || []);
        } catch {
            setCars([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCars(); }, []);

    const handleAdd = async () => {
        setError(''); setSuccess('');
        if (!user || user.role !== 'admin') { setError('🚫 ต้องเป็นผู้ดูแลระบบเท่านั้น'); return; }
        if (!form.name || !form.price) { setError('กรุณากรอกชื่อรุ่นและราคา'); return; }

        try {
            const formData = new FormData();
            formData.append('adminUsername', user.username);
            formData.append('name', form.name);
            formData.append('price', form.price);
            formData.append('seats', form.seats);
            formData.append('fuel', form.fuel);
            formData.append('desc', form.desc);
            if (form.image) formData.append('image', form.image); // เพิ่มไฟล์รูป

            const res = await fetch('/api/admin/cars', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `เกิดข้อผิดพลาด HTTP ${res.status}`);
            }

            const data = await res.json();
            if (data.success) {
                setForm({ name: '', price: '', seats: 4, fuel: 'เบนซิน', desc: '', image: null });
                setPreview(null);
                setSuccess('✅ เพิ่มรถสำเร็จ!');
                fetchCars();
            } else {
                setError(data.message || 'ไม่สามารถเพิ่มรถได้');
            }
        } catch (e) {
            setError(`❌ เกิดข้อผิดพลาด: ${e.message}`);
        }
    };

    const handleDelete = async (id) => {
        setError(''); setSuccess('');
        if (!user || user.role !== 'admin') return;
        if (!window.confirm('🚨 คุณแน่ใจหรือว่าต้องการลบรถคันนี้?')) return;
        try {
            const res = await fetch(`/api/admin/cars/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminUsername: user.username })
            });
            if (!res.ok) throw new Error('ไม่สามารถลบรถได้');
            const data = await res.json();
            if (data.success) { setSuccess('🗑️ ลบรถสำเร็จ!'); fetchCars(); }
            else setError('ไม่สามารถลบได้');
        } catch (e) { setError(`❌ ${e.message}`); }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, image: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className={styles.pageContainer}>
            <h2 className={styles.title}>🚗 จัดการรถเช่า (แผงผู้ดูแล)</h2>
            <p className={styles.subtitle}>เพิ่ม ลบ และจัดการรายการรถเช่าทั้งหมดในระบบ</p>

            {/* ฟอร์มเพิ่มรถ */}
            <div className={styles.formSection}>
                <div className={styles.formGrid}>
                    {error && <div className={styles.error}>{error}</div>}
                    {success && <div className={styles.success}>{success}</div>}

                    <input 
                        className={styles.input} 
                        placeholder="ชื่อรุ่นรถ *" 
                        value={form.name} 
                        onChange={e => setForm({ ...form, name: e.target.value })} 
                    />
                    <input 
                        className={styles.input} 
                        placeholder="ราคา (บาท/วัน) *" 
                        type="number" 
                        min="0" 
                        value={form.price} 
                        onChange={e => setForm({ ...form, price: e.target.value })} 
                    />
                    <input 
                        className={styles.input} 
                        placeholder="คำอธิบายเพิ่มเติม" 
                        value={form.desc} 
                        onChange={e => setForm({ ...form, desc: e.target.value })} 
                    />
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        className={styles.input}
                    />
                    {preview && <img src={preview} alt="preview" className={styles.previewImage} />}

                    <div className={styles.buttonRow}>
                        <button 
                            className={`${styles.buttonBase} ${styles.buttonPrimary}`} 
                            onClick={handleAdd} disabled={loading}>
                            ➕ เพิ่มรถ
                        </button>
                        <button 
                            className={`${styles.buttonBase} ${styles.buttonGhost}`} 
                            onClick={() => { setForm({ name: '', price: '', seats: 4, fuel: 'เบนซิน', desc: '', image: null }); setPreview(null); }}
                            disabled={loading}>
                            รีเซ็ตฟอร์ม
                        </button>
                    </div>
                </div>
            </div>

            {/* รายการรถ */}
            {loading ? (
                <div className={styles.loadingText}>⏳ กำลังโหลดข้อมูลรถ...</div>
            ) : (
                cars.length ? (
                    <div className={styles.listContainer}>
                        {cars.map(c => (
                            <div key={c.id} className={styles.carItem}>
                                {c.image && <img src={c.image} alt={c.name} className={styles.carImage} />}
                                <div>
                                    <div className={styles.carName}>{c.name}</div>
                                    <div className={styles.carDetails}>
                                        {c.desc || 'ไม่มีคำอธิบายเพิ่มเติม'} 
                                        <span className={styles.carPrice}> | {c.price} บาท/วัน</span>
                                    </div>
                                </div>
                                <button className={styles.buttonDelete} onClick={() => handleDelete(c.id)} disabled={loading}>ลบ</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.noDataText}>ยังไม่มีรถในระบบ 😞 กรุณาเพิ่มรถใหม่</div>
                )
            )}
        </div>
    );
};

export default AdminCars;
