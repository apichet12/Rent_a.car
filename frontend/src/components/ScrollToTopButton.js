import React, { useState, useEffect } from 'react';

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      style={{
        position: 'fixed',
        bottom: 40,
        right: 40,
        background: '#3b82f6',
        color: '#fff',
        border: 'none',
        borderRadius: '50%',
        width: 50,
        height: 50,
        cursor: 'pointer',
        fontSize: 24,
        zIndex: 1000,
      }}
    >
      ↑
    </button>
  );
};

export default ScrollToTopButton;
