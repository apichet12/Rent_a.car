// src/pages/mobile/ProfileMobile.js
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useIsMobile } from "../../hooks/useIsMobile";
import MobileNav from "../../components/mobile/MobileNav";

const formatThaiDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", { timeZone: "Asia/Bangkok" });
};

export default function ProfileMobile() {
  const { user, setUser } = useContext(AuthContext);
  const isMobile = useIsMobile();

  const username = user?.username || "Klick Drive Member";

  // โหลด user จาก server
  useEffect(() => {
    if (!username) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${username}`);
        const data = await res.json();
        if (data.success) {
          setUser(data);
        }
      } catch (err) {
        console.error("Fetch user error:", err);
      }
    };
    fetchUser();
  }, [username, setUser]);

  const memberSince = formatThaiDate(user?.createdAt);

  if (!isMobile) return <div className="desktop-content"><h1>Profile Page (Desktop)</h1></div>;

  return (
    <div className="mobile-profile-page" style={{ paddingBottom: 64, fontFamily: "Prompt, sans-serif" }}>
      <div style={{ background: "#4f46e5", padding: 20, color: "#fff", textAlign: "center" }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%", background: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px"
        }}>
          <span style={{ fontSize: 32, color: "#4f46e5", fontWeight: 700 }}>
            {username.charAt(0).toUpperCase()}
          </span>
        </div>
        <h3 style={{ margin: 0 }}>{username}</h3>
        <p style={{ fontSize: 12, marginTop: 4 }}>เป็นสมาชิกเมื่อ {memberSince}</p>
      </div>

      <div style={{ padding: 12 }}>
        <h4>บัญชีของ {username}</h4>
        <div style={{ marginTop: 12, fontSize: 14, color: "#6b7280" }}>
          {/* ตัวอย่าง Tab / รีวิว */}
          รีวิวจากฟรีแลนซ์: ยังไม่มีรีวิวในขณะนี้
        </div>
      </div>

      {/* Footer */}
      <footer style={{ marginTop: 28, padding: "16px", fontSize: 12, color: "#64748b", textAlign: "center" }}>
        © {new Date().getFullYear()} Klick Drive
      </footer>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
