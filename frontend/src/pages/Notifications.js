import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const doFetch = async () => {
      try {
        const url = user ? `/api/notifications?forUser=${encodeURIComponent(user.username)}` : '/api/notifications';
        const res = await fetch(url);
        const data = await res.json();
        setNotes(data || []);
      } catch (e) { console.error(e); }
    };
    doFetch();
  }, [user]);

  return (
    <div className="page-card">
      <h2>การแจ้งเตือน</h2>
      <p style={{ color: '#6b7280' }}>รายการแจ้งเตือนล่าสุด</p>
      <div style={{ marginTop: 12 }}>
        {notes.length ? notes.map(n => (
          <div key={n.id} style={{ background: '#fff', padding: 12, borderRadius: 10, marginBottom: 8 }}>
            <div style={{ fontWeight: 700 }}>{n.message}</div>
            <div style={{ color: '#6b7280', fontSize: 13, marginTop: 6 }}>{new Date(n.time).toLocaleString()}</div>
          </div>
        )) : <div style={{ color: '#6b7280' }}>ยังไม่มีการแจ้งเตือน</div>}
      </div>
    </div>
  );
};

export default Notifications;
