import React, { useEffect, useRef, useState } from 'react';
import './ChatWidget.css';

const cannedReplies = [
  'สวัสดีครับ! มีอะไรให้ช่วยได้บ้างครับ?',
  'คุณต้องการค้นหารถแบบไหนครับ? เช่น รถเก๋ง, รถ SUV หรือมอเตอร์ไซค์',
  'เรามีโปรโมชั่นพิเศษสำหรับสมาชิกวันนี้ อยากดูไหมครับ?',
  'หากต้องการความช่วยเหลือเรื่องการชำระเงิน ให้บอกผมได้เลยครับ',
  'ลองพิมพ์ "ราคา" หรือ "เช่า" เพื่อให้ผมช่วยค้นหาได้เร็วขึ้นครับ',
];

const getBotReply = (message) => {
  const lower = message.toLowerCase();

  // Greeting / small talk
  if (
    lower.includes('สวัสดี') ||
    lower.includes('hello') ||
    lower.includes('hi') ||
    lower.includes('หวัดดี')
  ) {
    return 'สวัสดีครับ! 😊 มีอะไรให้ช่วยหรืออยากลองค้นหารถแบบไหนครับ?';
  }

  if (lower.includes('ขอบคุณ') || lower.includes('thanks') || lower.includes('thank')) {
    return 'ยินดีครับ! ถ้ามีคำถามเพิ่มเติมก็บอกได้เลยนะครับ 😊';
  }

  // Respond to general questions / prompts in a more conversational way
  if (lower.includes('?') || lower.includes('ไหม') || lower.includes('ได้ไหม')) {
    return 'ได้เลยครับ 😊 ถามมาได้เลยเกี่ยวกับรถที่ต้องการหรือวิธีจอง ผมช่วยได้!';
  }

  // If the user wants to contact us about cars or rentals, provide contact details.
  if (
    lower.includes('ติดต่อ') ||
    lower.includes('เบอร์') ||
    lower.includes('โทร') ||
    lower.includes('line') ||
    lower.includes('อีเมล') ||
    lower.includes('email')
  ) {
    return `📞 เบอร์ติดต่อ: 080-123-4567\n📧 อีเมล: contact@rentacarwithkatty.com\n
ถ้ามีคำถามเรื่องรถหรือการจอง แจ้งมาได้เลยครับ 😊`;
  }

  if (lower.includes('ราคา')) return 'ราคาจะแสดงในหน้ารถที่คุณเลือก คุณสามารถกรองตามช่วงราคาได้ด้วยตัวกรองด้านซ้ายค่ะ.';
  if (lower.includes('จอง') || lower.includes('booking') || lower.includes('เช่า')) return 'คุณสามารถกดปุ่ม "จองรถ" ที่หน้าแสดงรายการรถ แล้วเลือกวันที่รับ-คืนได้เลยค่ะ.';
  if (lower.includes('แนะนำ') || lower.includes('แนะนำรถ')) return 'แนะนำให้ลองดูรถยอดนิยม เช่น Toyota Camry หรือ Tesla Model 3 ที่รีวิวดีและราคาเหมาะสม.';
  if (lower.includes('โปรโมชั่น') || lower.includes('ส่วนลด')) return 'ตอนนี้มีส่วนลดพิเศษสำหรับลูกค้าที่จองล่วงหน้านะครับ ลองดูที่บูทแคมเปญในหน้าหลักได้เลย.';

  // Generic conversational fallback (randomized เพื่อให้ดูเป็นธรรมชาติ)
  return cannedReplies[Math.floor(Math.random() * cannedReplies.length)];
};

const BRAND_NAME = 'Rent a car with Katty';

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: `สวัสดีและยินดีต้อนรับสู่ ${BRAND_NAME}! 😊` },
    {
      id: 2,
      from: 'bot',
      text: `ฉันคือ AI ฝ่ายบริการของ ${BRAND_NAME} พร้อมให้ความช่วยเหลือในการจองรถ, เช็คโปรโมชั่น หรือสอบถามข้อมูลทั่วไปได้เลยครับ`,
    },
    { id: 3, from: 'bot', text: 'เมื่อคุณพร้อมแล้ววันนี้ฉันจะช่วยอะไรคุณได้บ้าง?' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const sendingRef = useRef(false);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, open]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    if (sendingRef.current) return; // ป้องกันกดซ้ำหลายครั้ง

    sendingRef.current = true;
    const trimmed = text.trim();
    const userMsg = { id: Date.now(), from: 'user', text: trimmed };
    setInput('');
    setTyping(true);

    const addBotMessage = (text) => {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.from === 'bot' && last.text === text) return prev;
        return [...prev, { id: Date.now() + 1, from: 'bot', text }];
      });
    };

    setMessages((prev) => {
      const updated = [...prev, userMsg];

      const history = updated
        .slice(-12)
        .map((msg) => ({ from: msg.from, text: msg.text }))
        .filter((m) => m.text);

      (async () => {
        try {
          const resp = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: trimmed, history }),
          });

          if (!resp.ok) {
            throw new Error('Chat API error');
          }

          const data = await resp.json();
          const botText = data?.reply || getBotReply(trimmed);
          addBotMessage(botText);
        } catch (err) {
          addBotMessage(getBotReply(trimmed));
        } finally {
          setTyping(false);
          sendingRef.current = false;
        }
      })();

      return updated;
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className={`chat-widget ${open ? 'open' : ''}`}>
      {!open ? (
        <button className="chat-bubble-button" onClick={() => setOpen(true)} aria-label="เปิดแชท">
          💬
        </button>
      ) : (
        <>
          <div className="chat-header">
            <div className="chat-title">
              <span className="chat-dot" />
              AI ฝ่ายบริการของ {BRAND_NAME}
            </div>
            <button className="chat-toggle" onClick={() => setOpen(false)} aria-label="ปิดแชท">
              ✕
            </button>
          </div>

          <div className="chat-body">
            <div className="chat-messages">
              {messages.map((msg) => (
                <div key={msg.id} className={`chat-message ${msg.from}`}>
                  {msg.from === 'bot' && <span className="chat-avatar">AI</span>}
                  <div className="chat-bubble">{msg.text}</div>
                </div>
              ))}
              {typing && (
                <div className="chat-message bot">
                  <div className="chat-bubble typing">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="พิมพ์ข้อความ..."
              />
              <button className="chat-send" onClick={() => sendMessage(input)}>
                ส่ง
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWidget;
