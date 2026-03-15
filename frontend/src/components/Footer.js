import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h4>Rent a car with Katty</h4>
          <p>
            แพลตฟอร์มค้นหา เปรียบเทียบ และจองรถเช่าในไทย ให้บริการทั้งรถยนต์  และรถเพื่อธุรกิจ
          </p>
          <p style={{ marginTop: 12 }}>
            โทร 02-038-5222 • Line: @kattycar • Email: contact@kattycar.com
          </p>
        </div>

        <div>
          <h4>บริการของเรา</h4>
          <ul>
            <li>
              <Link to="/cars">ค้นหารถเช่า</Link>
            </li>
            <li>
              <Link to="/booking">ดู/แก้ไขการจอง</Link>
            </li>
            <li>
              <Link to="/contact">ติดต่อเรา</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>เกี่ยวกับ</h4>
          <ul>
            <li>
              <Link to="/privacy">นโยบายความเป็นส่วนตัว</Link>
            </li>
            <li>
              <Link to="/terms">ข้อกำหนดและเงื่อนไข</Link>
            </li>
            <li>
              <Link to="/tuition">คำถามที่พบบ่อย</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>ดาวน์โหลดแอพ</h4>
          <p>ใช้งานสะดวกผ่านมือถือ</p>
          <div className="app-buttons">
            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noopener noreferrer"
              className="app-btn apple"
            >
              <img src="/images/apple-logo.png" alt="App Store" /> App Store
            </a>
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              className="app-btn google"
            >
              <img src="/images/google-play-logo.png" alt="Google Play" /> Google Play
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {year} Rent a car with Katty — สงวนลิขสิทธิ์
        <div>
          <Link to="/privacy">นโยบายความเป็นส่วนตัว</Link>
          <Link to="/terms">ข้อกำหนดการให้บริการ</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
