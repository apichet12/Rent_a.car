
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ bookingsToday: 0, totalIncome: 0, cars: 0, reviews: 0, avgRating: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ดึงข้อมูลจริงจาก backend (สมมุติ endpoint /api/admin/dashboard)
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/dashboard');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch {}
      setLoading(false);
    };
    if (user && user.role === 'admin') fetchStats();
  }, [user]);

  if (!user || user.role !== 'admin') {
    return <div className="page-card" style={{ textAlign: 'center', padding: 32 }}><h2>เฉพาะผู้ดูแลระบบเท่านั้น</h2></div>;
  }

  return (
    <div className="page-card" style={{ maxWidth: 900, margin: '0 auto', background: 'linear-gradient(135deg,#f8fafc 60%,#e0e7ef 100%)', boxShadow: '0 4px 24px #e0e7ef', borderRadius: 18, padding: 32 }}>
      <h2 style={{ color: '#1e293b', marginBottom: 0 }}>แดชบอร์ดแอดมิน</h2>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: 24 }}>
        <div style={{ flex: '1 1 180px', background: '#fff', padding: 24, borderRadius: 14, boxShadow: '0 2px 8px #f1f5f9', minWidth: 180, textAlign: 'center' }}>
          <h3 style={{ marginBottom: 8, color: '#0ea5e9' }}>ยอดจองวันนี้</h3>
          <p style={{ fontSize: '2rem', color: '#0ea5e9', margin: 0 }}>{loading ? '...' : stats.bookingsToday}</p>
        </div>
        <div style={{ flex: '1 1 180px', background: '#fff', padding: 24, borderRadius: 14, boxShadow: '0 2px 8px #f1f5f9', minWidth: 180, textAlign: 'center' }}>
          <h3 style={{ marginBottom: 8, color: '#4f46e5' }}>รายได้รวม</h3>
          <p style={{ fontSize: '2rem', color: '#4f46e5', margin: 0 }}>{loading ? '...' : `฿ ${stats.totalIncome.toLocaleString()}`}</p>
        </div>
        <div style={{ flex: '1 1 180px', background: '#fff', padding: 24, borderRadius: 14, boxShadow: '0 2px 8px #f1f5f9', minWidth: 180, textAlign: 'center' }}>
          <h3 style={{ marginBottom: 8, color: '#06b6d4' }}>รถให้บริการ</h3>
          <p style={{ fontSize: '2rem', color: '#06b6d4', margin: 0 }}>{loading ? '...' : stats.cars}</p>
        </div>
        <div style={{ flex: '1 1 180px', background: '#fff', padding: 24, borderRadius: 14, boxShadow: '0 2px 8px #f1f5f9', minWidth: 180, textAlign: 'center' }}>
          <h3 style={{ marginBottom: 8, color: '#fbbf24' }}>คะแนนรีวิว</h3>
          <p style={{ fontSize: '2rem', color: '#fbbf24', margin: 0 }}>{loading ? '...' : `${stats.avgRating} ★`}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
